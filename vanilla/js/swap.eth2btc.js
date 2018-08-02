APP.Swap.interfaces['ETH-BTC'] = function (orderID) {
	console.log("Begin swap",orderID);
	const swap = new window.swap.core.Swap(orderID);
	const swap_state_update = function (values) {
		console.log('swap state update',values);
		
		
		
	};
	swap.on('state update', swap_state_update);
	console.log(swap);
    console.log(swap.flow._flowName.toUpperCase());
	/*
	window.setTimeout( function () {
		console.log('auto sign flow');
		swap.flow.sign();
	}, 5000 );
	*/
	window.testswap = swap;
	return true;
}