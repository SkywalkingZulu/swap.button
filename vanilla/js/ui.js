$(document).ready(function (){
	/* Debug my orders - not needed in production */
	const renderMyOrders = function () {
		$('#debug-my-orders TABLE TBODY TR:not(.-template)').remove();
		if (APP.CORE.services.orders.getMyOrders().length>0) {
			$.each( APP.CORE.services.orders.getMyOrders() , function (i,order) {
				console.log(order);
				let row = $('#debug-my-orders TABLE TBODY TR.-template[data-target="row"]').
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
				$('#debug-my-orders TABLE TBODY TR.-template[data-target="empty"]').
					clone()
					.removeClass(
						'-template'
					)
			);
		}
	};
	/* Render all orders without filter (filter in future) */
	const renderPeerOrders = function () {
		$('TABLE#peer-orders-list TBODY TR:not(.-template)').remove();
		let otherOrdersCount = 0;
		if (APP.getOrders().length>0) {
			$.each( APP.getOrders() , function (i,order) {
				if (!order.isMy) {
					let row = $('TABLE#peer-orders-list TBODY TR.-template[data-target="row"]').
								clone().
								removeClass("-template");
					row.find('[data-target="buyC"]').html(order.buyCurrency);
					row.find('[data-target="buyA"]').html(order.buyAmount.toFixed(5));
					row.find('[data-target="sellC"]').html(order.sellCurrency);
					row.find('[data-target="sellA"]').html(order.sellAmount.toFixed(5));
					row.find('[data-target="rate"]').html(order.exchangeRate);
					row.find('[data-target="id"]').data("id",order.id);
					$('TABLE#peer-orders-list TBODY').append(row);
					otherOrdersCount++;
				}
			} );
		};
		if (otherOrdersCount===0) {
			$('TABLE#peer-orders-list TBODY').append(
				$('TABLE#peer-orders-list TBODY TR.-template[data-target="empty"]').
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
			APP.CORE.services.orders.remove($(e.target).data('id'));
			renderMyOrders();
		}
	} );
	$(window).bind("IPFS>CONNECT", function (e, peer) {
		renderMyOrders();
		renderPeerOrders();
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
		/* implementation exist? */
		if (APP.Swap.interfaces[order.buyCurrency+"-"+order.sellCurrency]===undefined) {
			alert("Not implements yet");
			return;
		};
		if (confirm("Begin swap?")) {
			
			const result = APP.Swap.interfaces[order.buyCurrency+"-"+order.sellCurrency](orderID);
			console.log(result);
		}
	} );
} );