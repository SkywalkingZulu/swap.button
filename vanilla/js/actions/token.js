APP.Actions.token = {
	login : (privateKey, contractAddress, nameContract, decimals) => {
		let data
		if (privateKey) {
			data = APP.CORE.env.web3.eth.accounts.privateKeyToAccount(privateKey)
		} else {
			console.info('Created account ETH Token ...')
			data = APP.CORE.env.web3.eth.accounts.create()
			APP.CORE.env.web3.eth.accounts.wallet.add(data)
		}

		APP.CORE.env.web3.eth.accounts.wallet.add(data.privateKey)
		console.info('Logged in with ETH Token', data)

		APP.Actions.token.setupContract(data.address, contractAddress, nameContract, decimals)
	},
	setupContract : (ethAddress, contractAddress, nameContract, decimals) => {
		if (!APP.CORE.env.web3.eth.accounts.wallet[ethAddress]) {
			throw new Error('web3 does not have given address')
		}

		const data = {
			address: ethAddress,
			balance: 0,
			name: nameContract,
			currency: nameContract.toUpperCase(),
			contractAddress,
			decimals,
		}

		/*reducers.user.setTokenAuthData({ name: data.name, data })*/
	},
	getBalance : async (tokenAddress, name, decimals) => {
		const address = APP.CORE.services.auth.accounts.eth.address;
		const ERC20 = new APP.CORE.env.web3.eth.Contract(window.abi_lib_vanilla, tokenAddress)

		const result = await ERC20.methods.balanceOf(address).call()
		let amount = new BigNumber(String(result)).dividedBy(new BigNumber(String(10)).pow(decimals)).toNumber()

		/* reducers.user.setTokenBalance({ name, amount }) */
		return amount
	},
	fetchBalance : async (address, tokenAddress, decimals) => {
		console.log('App.Actions.fetchBalance',address,tokenAddress,decimals);
		const ERC20 = new APP.CORE.env.web3.eth.Contract(window.abi_lib_vanilla, tokenAddress)
		const result = await ERC20.methods.balanceOf(address).call()

		const amount = new BigNumber(String(result)).dividedBy(new BigNumber(String(10)).pow(decimals)).toNumber()
		return amount
	},
	getTransaction : (contractAddress) =>
		new Promise((resolve) => {
			const address = APP.CORE.services.auth.accounts.eth.address;

			const url = [
				`https://api-rinkeby.etherscan.io/api?module=account&action=tokentx`,
				`&contractaddress=${contractAddress}`,
				`&address=${address}`,
				`&startblock=0&endblock=99999999`,
				`&sort=asc&apikey=${config.apiKeys.blocktrail}`,
			].join('');
			$.ajax( {
				type : 'GET',
				url : url,
				complete : function (rv) {
					const transactions = rv.responseJSON.result
					.filter((item) => item.value > 0).map((item) => ({
						confirmations: item.confirmations,
						type: item.tokenSymbol,
						hash: item.hash,
						contractAddress: item.contractAddress,
						status: item.blockHash != null ? 1 : 0,
						value: new BigNumber(String(item.value)).dividedBy(new BigNumber(10).pow(Number(item.tokenDecimal))).toNumber(),
						address: item.to,
						date: item.timeStamp * 1000,
						direction: address.toLowerCase() === item.to.toLowerCase() ? 'in' : 'out',
					}));
					resolve(transactions)
				},
				error : function () {
					resolve([])
				}
			} );
		}),
	send : (contractAddress, to, amount, decimals) => {
		const address = APP.CORE.services.auth.accounts.eth.address;

		const options = {
			from: address,
			gas: `${config.services.web3.gas}`,
			gasPrice: `${config.services.web3.gasPrice}`,
		}

		const tokenContract = new APP.CORE.env.web3.eth.Contract(abi, contractAddress, options)
		const newAmount = new BigNumber(String(amount)).times(new BigNumber(10).pow(decimals)).integerValue()

		return new Promise(async (resolve, reject) => {
			const receipt = await tokenContract.methods.transfer(to, newAmount).send();
			receipt.on('transactionHash', (hash) => {
				const txId = `${config.link.etherscan}/tx/${hash}`
				actions.loader.show(true, true, txId)
			})
			receipt.on('error', (err) => {
				reject(err)
			});
			resolve(receipt)
		})
	},
	approve : (contractAddress, amount, decimals, name) => {
		const address = APP.CORE.services.auth.accounts.eth.address;

		const newAmount = new BigNumber(String(amount)).times(new BigNumber(10).pow(decimals)).integerValue()
		const ERC20     = new APP.CORE.env.web3.eth.Contract(abi, contractAddress)

		return new Promise(async (resolve, reject) => {
			try {
				const result = await ERC20.methods.approve(config.token.contract, newAmount).send({
					from: address,
					gas: `${config.services.web3.gas}`,
					gasPrice: `${config.services.web3.gasPrice}`,
				})
				.on('error', err => {
					reject(err)
				});
				resolve(result)
			} catch (err) {
				reject(err)
			}
		})
		.then(() => {
			/*reducers.user.setTokenApprove({ name, approve: true  })*/
		})
	},
	allowance : (contractAddress, name) => {
		const { user: { ethData: { address } } } = getState()
		const ERC20     = new APP.CORE.env.web3.eth.Contract(abi, contractAddress)

		return new Promise(async (resolve, reject) => {
			let allowance = await ERC20.methods.allowance(address, config.token.contract).call()
			console.log('💸 allowance:', allowance)

			reducers.user.setTokenApprove({ name, approve: allowance > 0 })

			resolve(allowance)
		})
	},
	AllowedTokens : [],
	AuthAll : function () {
		for (var token_name in config.tokens) {
			new Promise( 
				ready => {
					if (window.swap.core.constants.COINS[token_name]!==undefined) {
						const nameContract = window.swap.core.constants.COINS[token_name];
						APP.Actions.token.AllowedTokens.push(nameContract);
						/* TODO - make other eth address for tokens */
						const privateKey = APP.CORE.services.auth.accounts.eth.privateKey;
						const contractAddress = config.tokens[token_name].address;
						
						const decimals = config.tokens[token_name].decimals;
						
						APP.Actions.token.login(
							privateKey, 
							contractAddress, 
							nameContract, 
							decimals
						);
						
						
						ready('Token ('+token_name+') auth ready');
					} else {
						ready('Token ('+token_name+') not found in Swap.Core');
					}
				})
				.then( isReady => { console.log( isReady ); } );
		};
	}
};
APP.Actions.token.AuthAll();