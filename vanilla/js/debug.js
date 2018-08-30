PM.depend("js/app", function () {
	APP.AfterInitCall( function () {
		$(document).ready( function () {
			console.info("DEBUG BEGIN ---------------------- ");
			$('#show-debug-panel').bind('change', function (e) {
				if ($('#show-debug-panel').prop('checked')) {
					$('BODY').addClass('-debug-on');
				} else {
					$('BODY').removeClass('-debug-on');
				}
			} );
			$(window).bind("IPFS>DISCONNECT", function (e) {
				console.info("Ipfs disconnected");
			});
			$(window).bind("IPFS>CONNECT", function (e, peer) {
				console.info("Ipfs connected to peer",peer);
			});
			$(window).bind("CORE>ORDERS>ADD", function (e) {
				console.info("Order add",APP.getOrders());
			});
			$(window).bind("CORE>ORDERS>NEW", function (e) {
				console.info("New user orders",APP.getOrders());
			});
			$(window).bind("CORE>ORDERS>REMOVE", function (e) {
				console.info("Order removed",APP.getOrders());
			});
			$(document).delegate("SECTION.-debug>HEADER","click", function (e) {
				e.preventDefault();
				let p = $($(e.target).parents("SECTION")[0]);
				if (p.hasClass('-opened')) {
					p.removeClass('-opened');
				} else {
					p.addClass('-opened');
				}
			} );
			$('SECTION#debug-add-order INPUT[type="submit"]').bind('click', function (e) {
				APP.createOrder(
					$('SECTION#debug-add-order INPUT[data-target="buyC"]').val(),
					$('SECTION#debug-add-order INPUT[data-target="sellC"]').val(),
					$('SECTION#debug-add-order INPUT[data-target="buyA"]').val(),
					$('SECTION#debug-add-order INPUT[data-target="sellA"]').val(),
					$('SECTION#debug-add-order INPUT[data-target="rate"]').val()
				);
				$(window).trigger("CORE>ORDERS>CREATE");
			} );
			
			/* Account info */
			(function () {
				const update_info = function () {
					APP.Help.ApplyData('#debug-account [data-target="eth-private-key"]',
						APP.CORE.services.auth.accounts.eth.privateKey
					);
					APP.Help.ApplyData('#debug-account [data-target="eth-address"]',
						APP.CORE.services.auth.accounts.eth.address
					);
					$('#debug-account A[data-target="eth-address"]').attr('href',
						config.link.etherscan+"/address/"+APP.CORE.services.auth.accounts.eth.address
					);
					APP.Actions.eth.getBalance( function (amount) {
						APP.Help.ApplyData('#debug-account [data-target="eth-amount"]',amount);
					} );
					APP.Help.ApplyData('#debug-account [data-target="btc-private-key"]',
						APP.CORE.services.auth.accounts.btc.getPrivateKey()
					);
					APP.Help.ApplyData('#debug-account [data-target="btc-address"]',
						APP.CORE.services.auth.accounts.btc.getAddress()
					);
					$('#debug-account A[data-target="btc-address"]').attr('href',
						config.link.bitpay+"/address/"+APP.CORE.services.auth.accounts.btc.getAddress()
					);
					APP.Actions.btc.getBalance( function (amount) {
						APP.Help.ApplyData('#debug-account [data-target="btc-amount"]',amount);
					} );
				};
				try {
					update_info();
				} catch (e) {
					console.error("Fail init balances");
				};
				$(document).delegate('#debug-account [data-target="refresh-btc"]', 'click', function (e) {
					e.preventDefault();
					APP.Help.ApplyData('#debug-account [data-target="btc-amount"]','...');
					APP.Actions.btc.getBalance( function (amount) {
						APP.Help.ApplyData('#debug-account [data-target="btc-amount"]',amount);
					} );
				} );
				$(document).delegate('#debug-account [data-target="refresh-eth"]', 'click', function (e) {
					e.preventDefault();
					APP.Help.ApplyData('#debug-account [data-target="eth-amount"]','...');
					APP.Actions.eth.getBalance( function (amount) {
						APP.Help.ApplyData('#debug-account [data-target="eth-amount"]',amount);
					} );
				});
				$(document).delegate('#debug-account INPUT[type="submit"]','click', function (e) {
					e.preventDefault();
					localStorage.setItem(config.network+":eth:PrivateKey",
						$('#debug-account [data-target="eth-private-key"]').val()
					);
					localStorage.setItem(config.network+":btc:PrivateKey",
						$('#debug-account [data-target="btc-private-key"]').val()
					);
					APP.CORE.services.auth = new window.swap.core.auth({
						eth: localStorage.getItem(config.network+":eth:PrivateKey"),
						btc: localStorage.getItem(config.network+":btc:PrivateKey")
					});
					window.location.reload();
				} );
				/* Tokens info */
				APP.AfterInitCall( function () {
					(async function () {
						const templ = APP.Help.getTempl('[data-template="token-balance"]');
						const holder = $('#debug-token-balance-holder');
						for(var token_name in config.tokens) {
							const token_data = config.tokens[token_name];
							const tokenName = (window.swap.core.constants.COINS[token_name]!==undefined) ?
								window.swap.core.constants.COINS[token_name] : token_name.toUpperCase()
							let balance = await APP.Actions.token.getBalance(token_data.address,tokenName,token_data.decimals);
							console.log(tokenName,balance,token_data.address);
							templ.reset();
							templ.setVar('name',tokenName);
							templ.setVar('configName',token_name);
							templ.setVar('balance',balance);
							templ.setObject('token',token_data);
							holder.append(templ.getDom());
						};
					})();
				} );
			})();
			
			/*
			Templ test
			*/
			if (false) {
				console.info("Test templ work");
				
				var templ = function () {
					/***
					<div id="{#boo.id#}">
						{#boo.label#}
						{#boo.foo.label#}
						<strong>
							{#boo.foo.moo.label#}
							<b>
								{#boo.foo.moo.zoo.label#}
								<em class="some-selector">
									{#boo.foo.moo.zoo.goo.label#}
									<u class="some-selector-2">
										{#boo.foo.moo.zoo.goo.soo.label#}
									</u>
								</em>
							</b>
						</strong>
					</div>
					***/
				};
				var templ_o = APP.Help.getTempl( templ );
				console.info("Template object");
				console.log(templ_o);
				templ_o.setObject('boo', {
					id : 'test-templ-1',
					label : 'boo label',
					foo : {
						label : 'foo label',
						moo : {
							label : 'moo label',
							zoo : {
								label : 'zoo label',
								goo : {
									label: 'zoo label',
									soo: {
										label : 'soo label'
									}
								}
							}
						}
					}
				});
				console.info("get plain text and reset");
				console.log(templ_o.getPlain());
				templ_o.reset();
				templ_o.setObject('boo', {
					id : 'test-templ-2',
					label : 'boo label 2',
					foo : {
						label : 'foo label 2',
						moo : {
							label : 'moo label 2',
							zoo : {
								label : 'zoo label 2',
								goo : {
									label: 'zoo label 2',
									soo: {
										label : 'soo label 2'
									}
								}
							}
						}
					}
				});
				console.info("after reset plain and dom");
				console.log(templ_o.getPlain());
				console.log(templ_o.getDom());
				console.info("bind funcs for dom object...");
				templ_o.bind_func('test_func', function() {
					console.log('test_func call');
				} );
				templ_o.bind_func('test_func_2', function(a,b) {
					console.log('test_func_2 call ', a, b );
				} );
				console.info("bind events for dom elements of template");
				templ_o.bind('STRONG>B', 'click', function (e) {
					alert('STRONG>B click + preventDefault');
				} );
				templ_o.bind('STRONG', 'click', function(e) {
					alert('STRONG click');
				} );
				templ_o.bind('.some-selector', 'click', function (e) {
					alert('some-selector click');
				} );
				templ_o.bind('.some-selector-2', 'click', function (e) {
					alert('some-selector-2 click');
				} );
				console.info("append template");
				$('#debug-view').append(templ_o.getDom());
				console.info("test binded dom funcs");
				console.info($('#test-templ-2')[0].test_func());
				console.info($('#test-templ-2')[0].test_func_2(1,3));
				
				
				
			}
			/* INCOMING ORDER REQUESTS */
			$(window).bind("CORE>REQUEST>NEW", function (e, list ) {
				console.info("New order request incoming");
				console.log(list);
			} );
			$(window).bind("CORE>REQUEST>DEL", function (e,list) {
				console.info("Order request removed");
				console.log(list);
			} );
			$(window).bind("CORE>REQUEST>CHANGE", function (e,list) {
				console.info("Order requests list changed");
				console.log(list);
			} );
			/* console log toggle */
			( function () {
				const originalLog = console.log;
				const originalInfo = console.info;
				const originalWarn = console.warn;
				
				$('#disable-console-log').bind('change', function (e) {
					if ($('#disable-console-log').prop('checked')) {
						console.log = function () {};
						console.info = function () {};
						console.warn = function () {};
						console.clear();
					} else {
						console.log = originalLog;
						console.info = originalInfo;
						console.warn = originalWarn;
					}
				} );
			} )();
			console.info("DEBUG TESTS END --------------------------------");
		} );
	} );
	/*{#PM-READY#}*/
} );