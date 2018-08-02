APP.Actions.eth = {
	getBalance : function (callback) {
		APP.CORE.env.web3.eth.getBalance(
			APP.CORE.services.auth.accounts.eth.address
		)
		.then(result => {
			const amount = Number(APP.CORE.env.web3.utils.fromWei(result))
			if (callback instanceof Function) {
				callback(amount);
			}
			return amount
		})
		.catch((e) => {
			console.log('Web3 doesn\'t work please again later ',  e.error)
		});
	}
}