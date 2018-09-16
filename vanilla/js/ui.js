PM.depend("js/app", function() {
	APP.AfterInitCall( function () {
		$(document).ready(function () {
			
			/*
			FILTER UI 
			*/
			(function () {
				const filter_tmpl = APP.Help.getTempl( function () {
					/***
					<span class="-filter-currency">
						<input type="checkbox" {#filter.checked#} id="filter-{#filter.direction#}-{#filter.type#}" data-direction="{#filter.direction#}" data-currency="{#filter.type#}" />
						<label for="filter-{#filter.direction#}-{#filter.type#}">{#filter.type#}</label>
					</span>
					***/
				} );
				const holder_buy = $('[data-target="filter-buy-currency"]');
				const holder_sell = $('[data-target="filter-sell-currency"]');
				if (holder_buy.length && holder_sell.length) {
					let buy_all = (config.filter.buy.indexOf('ALL')!==-1) ? true : false;
					let sell_all = (config.filter.sell.indexOf('ALL')!==-1) ? true : false;
					
					APP.Help.eachF( config.currencies , function (i,currency) {
						/* buy */
						holder_buy.append(
							filter_tmpl
							.reset()
							.setObject('filter', {
								direction: 'BUY',
								type : currency,
								checked : (buy_all || (config.filter.buy.indexOf(currency)!==-1)) ? 'checked' : ''
							})
							.getDom()
						);
						/* sell */
						holder_sell.append(
							filter_tmpl
							.reset()
							.setObject('filter', {
								direction: 'SELL',
								type : currency,
								checked : (sell_all || (config.filter.sell.indexOf(currency)!==-1)) ? 'checked' : ''
							})
							.getDom()
						);
					} );
					$(document).delegate('[data-target="filter-buy-currency"] INPUT, [data-target="filter-sell-currency"] INPUT', 'change', function (e) {
						const new_buy = [];
						const new_sell = [];
						APP.Help.eachF($('[data-target="filter-buy-currency"] INPUT:checked, [data-target="filter-sell-currency"] INPUT:checked'), function (i,input) {
							(
								($(input).data('direction')==='BUY') ?
									new_buy : new_sell
							).push ( $(input).data('currency') );
						} );
						config.filter = {
							buy : new_buy,
							sell : new_sell
						};
						$(window).trigger('ORDER>FILTER>CHANGE');
					} );
					
				}
			} )();
			/* --- END FILTER UI --- */
			/* Debug incoming request list  - not need in production */
			(function () {
				var _holder = $('TABLE#incoming-requests>TBODY');
				var templ_order = APP.Help.getTempl(function () {
					/***
					<tr data-id="{#order.id#}">
						<td>{#order.buyCurrency#}</td>
						<td>{#order.buyAmountFormated#}</td>
						<td>{#order.sellCurrency#}</td>
						<td>{#order.sellAmountFormated#}</td>
						<td>{#order.rate#}</td>
						<td data-target="requests">{#requests#}</td>
					</tr>
					***/
				});
				var templ_order_request = APP.Help.getTempl( function () {
					/***
						<div data-target="request" data-request-id="{#request.orderID#}-{#request.peer#}">
							<a href="#"
								data-action="order-request-accept"
								data-id="{#request.orderID#}"
								data-peer="{#request.peer#}">[accept]</a>
							<a href="#"
								data-action="order-request-decline"
								data-id="{#request.orderID#}"
								data-peer="{#request.peer#}">[decline]</a>
						</div>
					***/
				} );
				
				$(document).delegate('[data-action="order-request-decline"]', 'click', function (e) {
					e.preventDefault();
					
					const $t = $(e.target);
					const orderID = $t.data('id');
					const peerID = $t.data('peer');
					if (confirm("Decline request?")) {
						const order = APP.CORE.services.orders.getByKey(orderID);
						if (order!==null && order.isMy) {
							order.declineRequest(peerID);
						};
					}
				} );
				$(window).bind('CORE>REQUEST>DEL', function (e,data) {
					APP.Help.eachF(data.delRequest, function (i,orderID) {
						_holder.find('TR[data-id="'+orderID+'"]').remove();
					} );
				} );
				$(window).bind('CORE>REQUEST>NEW', function (e,data) {
					APP.getMyRealOrders().then( list => {
						APP.Help.eachF( list , function (i,order) {
							if (data.newRequest.indexOf(order.id)!=-1) {
								templ_order.reset();
								templ_order.setObject('order',{
									id : order.id,
									buyCurrency : order.buyCurrency,
									buyAmountFormated: order.buyAmount.toFixed(5),
									sellCurrency : order.sellCurrency,
									sellAmountFormated: order.sellAmount.toFixed(5),
									rate : order.exchangeRate
								} );
								APP.Help.eachF( order.requests, function (ii,request) {
									templ_order_request.reset();
									templ_order_request.setObject( 'request', {
										orderID : order.id,
										peer : request.peer
									} );
									templ_order.addVar('requests',templ_order_request.getPlain());
								} );
								_holder.prepend(templ_order.getDom());
								
							};
						} );
					} );
				} );
			})();
			/* Debug my orders - not needed in production */
			const renderMyOrders = function () {
				$('#debug-my-orders TABLE TBODY TR:not(.-template)').remove();
				if (APP.CORE.services.orders.getMyOrders().length>0) {
					$.each( APP.CORE.services.orders.getMyOrders() , function (i,order) {
						let row = $('#debug-my-orders TABLE TBODY TR.-template[data-template="row"]').
									clone().
									removeClass("-template");
						row.find('[data-target="buyC"]').html(order.buyCurrency);
						row.find('[data-target="buyA"]').html(order.buyAmount);
						row.find('[data-target="sellC"]').html(order.sellCurrency);
						row.find('[data-target="sellA"]').html(order.sellAmount);
						row.find('[data-target="rate"]').html(order.exchangeRate);
						row.find('[data-target="id"]').data("id",order.id);
						$('#debug-my-orders TABLE TBODY').append(row);
					} );
				} else {
					$('#debug-my-orders TABLE TBODY').append(
						$('#debug-my-orders TABLE TBODY TR.-template[data-template="empty"]').
							clone()
							.removeClass(
								'-template'
							)
					);
				}
			};
			/* Render all orders without filter (filter in future) */
			const renderPeerOrder = function (order) {
				let row = $('TABLE#peer-orders-list TBODY TR.-template[data-template="row"]').
							clone().
							removeClass("-template");
				row = APP.Help.Render(row,{
					buyC : order.buyCurrency,
					buyA : order.buyAmount.toFixed(5),
					sellC : order.sellCurrency,
					sellA : order.sellAmount.toFixed(5),
					rate : order.exchangeRate,
					id : order.id
				});
				if (order.isRequested) {
					row.addClass('-is-requested');
				};
				return row;
			};
			const updateOrderStatus = function (order) {
				$('TR.-order-row[data-id="'+order.id+'"]').replaceWith(
					renderPeerOrder(order)
				);
			};
			const renderPeerOrders = function () {
				$('TABLE#peer-orders-list TBODY TR:not(.-template)').remove();
				let otherOrdersCount = 0;
				if (APP.getOrders().length>0) {
					$.each( APP.getOrders() , function (i,order) {
						if (!order.isMy) {
							/* filter check */
							if (
								(
									(config.filter.buy.indexOf("ALL")!==-1)
									&& (config.filter.sell.indexOf("ALL")!==-1)
								) || (
									(config.filter.buy.indexOf(order.sellCurrency)!==-1)
									&& (config.filter.sell.indexOf(order.buyCurrency)!==-1)
								)
							) {
								$('TABLE#peer-orders-list TBODY').append(
									renderPeerOrder(order)
								);
								otherOrdersCount++;
							}
						}
					} );
				};
				if (otherOrdersCount===0) {
					$('TABLE#peer-orders-list TBODY').append(
						$('TABLE#peer-orders-list TBODY TR.-template[data-template="empty"]').
							clone()
							.removeClass(
								'-template'
							)
					);
				}
			};
			/* remove my order - not needed in production */
			$(document).delegate('[data-action="remove-order"]', 'click', function (e) {
				e.preventDefault();
				if (confirm("Remove this order?")) {
					APP.removeMyOrder($(e.target).data('id'));
				}
			} );
			$(window).bind("IPFS>CONNECT", function (e, peer) {
				renderMyOrders();
				renderPeerOrders();
			} );
			$(window).bind("CORE>ORDERS>REMOVEMY", function (e) {
				renderMyOrders();
			} );
			$(window).bind("CORE>ORDERS>CREATE", function (e) {
				renderMyOrders();
			});
			$(window).bind("CORE>ORDERS>ADD", function (e) {
				renderPeerOrders();
			});
			$(window).bind("CORE>ORDERS>NEW", function (e) {
				renderPeerOrders();
			});
			$(window).bind("CORE>ORDERS>REMOVE", function (e) {
				renderPeerOrders();
			});
			$(window).bind("ORDER>FILTER>CHANGE", function (e) {
				renderPeerOrders();
			});
			/* ------------------------------------------- */
			/* Begin swap */
			$(document).delegate('[data-action="begin-swap"]', 'click', function (e) {
				e.preventDefault();
				const orderID = $(e.target).data('id');
				const order = APP.CORE.services.orders.getByKey(orderID);
				/* exist? */
				if (order===undefined) {
					alert("Order not found");
					return;
				};
				const result = APP.Swap(orderID);
				const swapDom = result.getDom();
				$('#active-swaps').append(swapDom);
				window.swapDomTest = swapDom;
				window.swapTestProcessor = result;
			} );
			/* Seller accept request */
			$(document).delegate('[data-action="order-request-accept"]', 'click', function (e) {
				e.preventDefault();
				const $t = $(e.target);
				const orderID = $t.data('id');
				const peerID = $t.data('peer');
				if (confirm("Accept request?")) {
					const order = APP.CORE.services.orders.getByKey(orderID);
					if (order!==null && order.isMy) {
						order.acceptRequest(peerID);
						let swapDOM = APP.BeginSwap(orderID);
						window.swapDomTest = swapDom;
					};
				}
			} );
			
			
			/* Orders in tab */
			PM.depend( 'js/ui.tabs', function () {
				APP.UI.Tabs.add('Orders', $('#peer-orders'));
			} );
		} );
	} );
	/*{#PM-READY#}*/
} );