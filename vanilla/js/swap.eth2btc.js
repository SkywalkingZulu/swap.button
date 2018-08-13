APP.Swap.interfaces['ETH-BTC'] = function (orderID) {
	console.log("Begin swap",orderID);
	const swap = new window.swap.core.Swap(orderID);
	const swap_state_update = function (values) {
		console.log('swap state update',values);
		const step = swap.flow.state.step;
		console.log('enter step',swap.flow._flowName, step)
		const flow = swap.flow;
		console.log(swap);
		switch (swap.flow._flowName) {
			case "BTC2ETH":
			case "BTC2NOXON":
			case "BTC2SWAP":
				if ( step === 3 ) {
					if (flow.step === 3 && !flow.isBalanceEnough && !flow.isBalanceFetching) {
						console.log('Not enough money for this swap. Please charge the balance');
						console.log('Your balance: '+flow.balance+' '+swap.sellCurrency);
						console.log('Required balance: '+swap.sellAmount.toNumber()+' '+swap.sellCurrency);
						console.log('Your address: '+swap.flow.myBtcAddress);
						console.log(flow.address);
						console.log('------------------------');
					}
				}
				if ( step === 2 ) {
					swap.flow.submitSecret(APP.Help.getRandomKey(32));
				};
				if ( step + 1 === swap.flow.steps.length ) {
					console.log('[FINISHED] tx', swap.flow.state.ethSwapWithdrawTransactionHash);
					// Orders.remove(swap.id)
				};
				break;;
			case "ETH2BTC":
			case "NOXON2BTC":
			case "SWAP2BTC":
				if ( step === 1 ) swap.flow.sign();
				if ( step === 3 ) swap.flow.verifyBtcScript();

				if ( step + 1 === swap.flow.steps.length ) {
					console.log('[FINISHED] tx', swap.flow.state.btcSwapWithdrawTransactionHash);
					// Orders.remove(swap.id)
				};
				break;
		}
	};
	/*
	order.sendRequest((isAccepted) => {
		
		console.log(`user ${order.owner.peer} ${isAccepted ? 'accepted' : 'declined'} your request`)
	});
	*/
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