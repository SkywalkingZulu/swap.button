PM.depend( [
	'js/app',
	'js/help.templ',
	'js/ui.tabs'
], function () {
	APP.Help.AppendStyle( () => {
		/***
		.-user-incoming-list.-has-orders TABLE>TBODY>TR.empty {
			display: none;
		}
		***/
	} );
	const incomingRequests = APP.Help.getTempl( () => {
		/***
		<section class="-user-incoming-list">
			<header>
				<h1>Your incoming requests for buy</h1>
			</header>
			<article>
				<table>
					<thead>
						<tr>
							<td colspan="2">You Sell</td>
							<td colspan="2">You Buy</td>
							<td rowspan="2">Rate</td>
							<td rowspan="2">Requests</td>
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
							<td colspan="6">No incoming requests</td>
						</tr>
					</tbody>
				</table>
			</article>
		</section>
		***/
	} );
	const incomingOrderRow = APP.Help.getTempl(function () {
		/***
		<tr data-id="{#order.id#}">
			<td>{#order.sellCurrency#}</td>
			<td>{#order.sellAmountFormated#}</td>
			<td>{#order.buyCurrency#}</td>
			<td>{#order.buyAmountFormated#}</td>
			<td>{#order.rate#}</td>
			<td data-target="requests">{#requests#}</td>
		</tr>
		***/
	});
	const incomingOrderRowRequest = APP.Help.getTempl( function () {
		/***
		<div data-target="request" data-request-id="{#request.orderID#}-{#request.peer#}">
			<a href="#"
				data-action="request-accept"
				data-id="{#request.orderID#}"
				data-peer="{#request.peer#}">[accept]</a>
			<a href="#"
				data-action="request-decline"
				data-id="{#request.orderID#}"
				data-peer="{#request.peer#}">[decline]</a>
		</div>
		***/
	});
	const requestsDom = incomingRequests.getDom();
	
	APP.UI.Tabs.add( 'Incoming requests (0)', requestsDom, function (tabID) {
		APP.UI.Tabs.hideTab( tabID );
		const updateHeader = function (data) {
			APP.UI.Tabs.updateHeader( tabID, 'Incoming requests ('+data.list.length+')' );
			if ((requestsDom.find('TBODY TR:not(.empty)')).length>0) {
				requestsDom.addClass('-has-orders');
				APP.UI.Tabs.showTab( tabID );
			} else {
				APP.UI.Tabs.hideTab( tabID );
				requestsDom.removeClass('-has-orders');
			}
		};
		$(document).delegate('[data-action="request-decline"]', 'click', function (e) {
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
		$(document).delegate('[data-action="request-accept"]', 'click', function (e) {
			e.preventDefault();
			const $t = $(e.target);
			const orderID = $t.data('id');
			const peerID = $t.data('peer');
			if (confirm("Accept request?")) {
				const order = APP.CORE.services.orders.getByKey(orderID);
				if (order!==null && order.isMy) {
					order.acceptRequest(peerID);
					let swapDom = APP.BeginSwap(orderID);
					window.swapDomTest = swapDom;
				};
			}
		} );
		$(window).bind('CORE>REQUEST>DEL', function (e,data) {
			APP.Help.eachF(data.delRequest, function (i,orderID) {
				requestsDom.find('TR[data-id="'+orderID+'"]').remove();
			} );
			updateHeader(data);
		} );
		$(window).bind('CORE>REQUEST>NEW', function (e,data) {
			APP.getMyRealOrders().then( list => {
				APP.Help.eachF( list , function (i,order) {
					if (data.newRequest.indexOf(order.id)!=-1) {
						incomingOrderRow.reset();
						incomingOrderRow.setObject('order',{
							id : order.id,
							buyCurrency : order.buyCurrency,
							buyAmountFormated: order.buyAmount.toFixed(5),
							sellCurrency : order.sellCurrency,
							sellAmountFormated: order.sellAmount.toFixed(5),
							rate : order.exchangeRate
						} );
						APP.Help.eachF( order.requests, function (ii,request) {
							incomingOrderRowRequest.reset();
							incomingOrderRowRequest.setObject( 'request', {
								orderID : order.id,
								peer : request.peer
							} );
							incomingOrderRow.addVar('requests',incomingOrderRowRequest.getPlain());
						} );
						requestsDom.find('TBODY').prepend(incomingOrderRow.getDom());
					};
				} );
				updateHeader(data);
			} );
		} );
	} , 3 );
	/*{#PM-READY#}*/
} );