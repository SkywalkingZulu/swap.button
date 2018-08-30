PM.depend("js/app", function () {
	APP.Actions.usdt = {
		login : (privateKey) => {
			let bitcoin = APP.CORE.env.bitcoin;
			let keyPair;

			if (privateKey) {
				const hash  = bitcoin.crypto.sha256(privateKey)
				const d     = BigInteger.fromBuffer(hash)

				keyPair     = new bitcoin.ECPair(d, null, { network: config.network })
			} else {
				console.info('Created account Bitcoin ...')
				keyPair     = bitcoin.ECPair.makeRandom({ network: config.network })
				privateKey  = keyPair.toWIF()
			};

			const account     = new bitcoin.ECPair.fromWIF(privateKey, btc.network) // eslint-disable-line
			const address     = account.getAddress()
			const publicKey   = account.getPublicKeyBuffer().toString('hex')

			const data = {
				account,
				keyPair,
				address,
				privateKey,
				publicKey,
			}

			console.info('Logged in with USDT', data)
			
		},
		getBalance : async () => {
			const { user: { usdtData: { address } } } = getState()
			const balance = await fetchBalance(address)
			return balance
		},
		fetchBalance : (address, assetId = 31) =>
			request.post(`https://api.omniexplorer.info/v1/address/addr/`, {
				body: `addr=${address}`,
			})
			.then(response => {
				const { error, balance } = response
				
				if (error) throw new Error(`Omni Balance: ${error} at ${address}`)

				const findById = balance
					.filter(asset => parseInt(asset.id) === assetId || asset.id === assetId)

				if (!findById.length) {
					return 0
				}

				console.log('Omni Balance:', findById[0].value)
				console.log('Omni Balance pending:', findById[0].pendingpos)
				console.log('Omni Balance pending:', findById[0].pendingneg)

				const usdsatoshis = BigNumber(findById[0].value)

				if (usdsatoshis) {
					return usdsatoshis.dividedBy(1e8).toNumber()
				} else {
					return 0
				}
			})
			.catch(error => console.error(error))
	};
	/*{#PM-READY#}*/
} );
