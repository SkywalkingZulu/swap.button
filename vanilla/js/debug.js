$(document).ready( function () {
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
			APP.Actions.eth.getBalance( function (amount) {
				APP.Help.ApplyData('#debug-account [data-target="eth-amount"]',amount);
			} );
			APP.Help.ApplyData('#debug-account [data-target="btc-private-key"]',
				APP.CORE.services.auth.accounts.btc.getPrivateKey()
			);
			APP.Help.ApplyData('#debug-account [data-target="btc-address"]',
				APP.CORE.services.auth.accounts.btc.getAddress()
			);
			APP.Actions.btc.getBalance( function (amount) {
				APP.Help.ApplyData('#debug-account [data-target="btc-amount"]',amount);
			} );
		};
		update_info();
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
	})();
} );