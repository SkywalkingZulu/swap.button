PM.depend( [
	'js/app',
	'js/help.templ',
	'js/ui.tabs'
], function () {
	APP.Help.AppendStyle( () => {
		/***
		.-user-orders-list.-has-orders TABLE>TBODY>TR.empty {
			display: none;
		}
		***/
	} );
	let ordersTabID = null;
	const _ordersTable = APP.Help.getTempl( () => {
		/***
		<section class="-user-orders-list">
			<header>
				<h1>Your orders</h1>
			</header>
			<table>
				<thead>
					<tr>
						<td colspan="2">You Sell</td>
						<td colspan="2">You Buy</td>
						<td rowspan="2">Rate</td>
						<td rowspan="2">Actions</td>
					</tr>
					<tr>
						<td>Currency</td>
						<td>Amount</td>
						<td>Currency</td>
						<td>Amount</td>
					</tr>
				</thead>
				<tbody>
					<tr class="empty">
						<td colspan="6">Your order list is empty</td>
					</tr>
				</tbody>
			</table>
		</section>
		***/
	} );
	const _orderRow = APP.Help.getTempl( () => {
		/***		
		<tr>
			<td>{#order.sellCurrency#}</td>
			<td>{#order.sellAmount#}</td>
			<td>{#order.buyCurrency#}</td>
			<td>{#order.buyAmount#}</td>
			<td>{#order.rate#}</td>
			<td>
				<a href="#" data-id="{#order.id#}" data-action="remove-order">REMOVE</a>
			</td>
		</tr>
		***/
	} );
	const ordersDOM = _ordersTable.getDom();
	const renderMyOrders = function () {
		ordersDOM.find('TBODY>TR:not(.empty)').remove();
		if (APP.CORE.services.orders.getMyOrders().length>0) {
			ordersDOM.addClass('-has-orders');
			$.each( APP.CORE.services.orders.getMyOrders() , function (i,order) {
				ordersDOM.find('TABLE>TBODY').append(
					_orderRow
						.reset()
						.setObject( 'order', {
							buyCurrency : order.buyCurrency,
							sellCurrency : order.sellCurrency,
							buyAmount : order.buyAmount,
							sellAmount : order.sellAmount,
							rate : order.exchangeRate,
							id : order.id
						} )
						.getDom()
					
				);
			} );
			APP.UI.Tabs.showTab( ordersTabID );
		} else {
			APP.UI.Tabs.hideTab( ordersTabID );
			ordersDOM.removeClass('-has-orders');
		}
	};
	APP.UI.Tabs.add( 'Your order', ordersDOM, function (tabID) {
		ordersTabID = tabID;
		APP.UI.Tabs.hideTab( ordersTabID );
		
		$(window).bind("IPFS>CONNECT", function (e, peer) {
			renderMyOrders();
		} );
		$(window).bind("CORE>ORDERS>REMOVEMY", function (e) {
			renderMyOrders();
		} );
		$(window).bind("CORE>ORDERS>CREATE", function (e) {
			renderMyOrders();
		});
		renderMyOrders();
	}, 2 );
	/*{#PM-READY#}*/
});