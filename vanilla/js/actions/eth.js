PM.depend("js/app", function () {
	APP.Actions.eth = {
		login : function (privateKey, callback ) {
			/* todo */
		},
		getAddress : function () {
			return APP.CORE.services.auth.accounts.eth.address;
		},
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
		},
		getBalanceAsync : async function () {
			return APP.CORE.env.web3.eth.getBalance(APP.CORE.services.auth.accounts.eth.address)
				.then(result => Number(APP.CORE.env.web3.utils.fromWei(result)))
				.catch((e) => {
					console.log('Web3 doesn\'t work please again later ', e.error)
				})
		},
		fetchBalanceAsync : (address) =>
			APP.CORE.env.web3.eth.getBalance(address)
				.then(result => Number(APP.CORE.env.web3.utils.fromWei(result)))
				.catch((e) => {
					console.log('Web3 doesn\'t work please again later ', e.error)
				}),
		fetchBalance : function (address, callback) {
			APP.CORE.env.web3.eth.getBalance(address)
				.then(result => {
					if (callback instanceof Function) {
						callback(APP.CORE.env.web3.utils.fromWei(result))
					}
					return Number(APP.CORE.env.web3.utils.fromWei(result))
				})
				.catch((e) => {
					console.log('Web3 doesn\'t work please again later ', e.error)
				});
		},
		getTransaction : function (callback) {
			new Promise((resolve) => {
				const address = APP.CORE.services.auth.accounts.eth.address;

				const url = `${config.api.etherscan}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${config.apiKeys.etherscan}`
				let transactions
				$.ajax({
					type : 'GET',
					url : url,
					complete : function (rv) {
						const res = rv.responseJSON;
						if (res.status) {
							transactions = res.result
								.filter((item) => item.value > 0).map((item) => ({
									type: 'eth',
									confirmations: item.confirmations,
									hash: item.hash,
									status: item.blockHash != null ? 1 : 0,
									value: APP.CORE.env.web3.utils.fromWei(item.value),
									address: item.to,
									date: item.timeStamp * 1000,
									direction: address.toLowerCase() === item.to.toLowerCase() ? 'in' : 'out',
								}));
							
							if (callback instanceof Function) {
								callback(transactions);
							};
							resolve(transactions);
						}
						else {
						  console.error('res:status ETH false', res)
						}
					}
				});
			});
		},
		send : function (from, to, amount, callback , callbackerror) {
			new Promise(async (resolve, reject) => {
				const privateKey = APP.CORE.services.auth.accounts.eth.privateKey;
				const params = {
					to: String(to).trim(),
					gasPrice: '20000000000',
					gas: '21000',
					value: APP.CORE.env.web3.utils.toWei(String(amount)),
				};
				let txRaw;

				await APP.CORE.env.web3.eth.accounts.signTransaction(params, privateKey)
					.then(result => {
						txRaw = APP.CORE.env.web3.eth.sendSignedTransaction(result.rawTransaction)
					})

				const receipt = await txRaw.on('transactionHash', (hash) => {
					/*
					const txId = `${config.link.etherscan}/tx/${hash}`
					actions.loader.show(true, true, txId)
					*/
				})
				.on('error', (err) => {
					reject(err);
					if (callbackerror instanceof Function) {
						callbackerror(err);
					}
				})

				resolve(receipt)
				if (callback instanceof Function) {
					callback(receipt);
				}
			})
		}
	};
	/*{#PM-READY#}*/
} );