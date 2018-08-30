PM.depend("js/app", function () {
	APP.Actions.btc = {
		login : function (privateKey, callback) {
			/* todo */
		},
		getAddress : function () {
			return APP.CORE.services.auth.accounts.btc.getAddress();
		},
		getBalanceAsync : async function () {
			return new Promise( callback => {
				const address = APP.CORE.services.auth.accounts.btc.getAddress();
				const url = `${config.api.bitpay}/addr/${address}`;
				$.ajax( {
					type : 'GET',
					url : url,
					complete : function (rv) {
						if (callback instanceof Function) {
							callback(rv.responseJSON.balance);
						}
					}
				} );
			});
		},
		getBalance : function (callback) {
			const address = APP.CORE.services.auth.accounts.btc.getAddress();
			const url = `${config.api.bitpay}/addr/${address}`;
			$.ajax( {
				type : 'GET',
				url : url,
				complete : function (rv) {
					if (callback instanceof Function) {
						callback(rv.responseJSON.balance);
					}
				}
			} );
		},
		fetchBalanceAsync : async (address) => {
			return await APP.Actions.btc.fetchBalance(address);
		},
		fetchBalance : async function (address,callback) {
			if (callback===undefined) {
				return new Promise( retCallback => {
					$.ajax( {
						type : 'GET',
						url : `${config.api.bitpay}/addr/${address}`,
						complete : function (rv) {
							retCallback(rv.responseJSON.balance);
						}
					} );
				} );
			} else {
				$.ajax( {
					type : 'GET',
					url : `${config.api.bitpay}/addr/${address}`,
					complete : function (rv) {
						if (callback instanceof Function) {
							callback(
								rv.responseJSON.balance,
								rv.responseJSON.unconfirmedBalance
							)
						}
					}
				} );
			};
		},
		getTransaction : function (callback) {
			new Promise((resolve) => {
				const address = APP.CORE.services.auth.accounts.btc.getAddress();
				
				const url = `${config.api.bitpay}/txs/?address=${address}`
				
				let transactions;
				
				$.ajax( {
					type : 'GET',
					url : url,
					complete : function (rv) {
						if (rv.responseJSON) {
							const res = rv.responseJSON;
							transactions = res.txs.map((item) => ({
								type: 'btc',
								hash: item.txid,
								confirmations: item.confirmations,
								value: item.vout[0].value,
								date: item.time * 1000,
								direction: address.toLocaleLowerCase() === item.vout[0].scriptPubKey.addresses[0].toLocaleLowerCase() ? 'in' : 'out',
							}));
							if (callback instanceof Function) {
								callback(transactions);
							}
						} else {
							if (callback instanceof Function) {
								callback([]);
								console.error('res:status BTC false', res)
							}
						}
					}
				});
			})
		},
		createScript : function (data) {
			console.log("Actions:BTC:CreateScript");
			console.log(data);
			const { secretHash, ownerPublicKey, recipientPublicKey, lockTime } = data
			let bitcoin = APP.CORE.env.bitcoin;
			const network = (
				APP.CORE.isMainNet
				? bitcoin.networks.bitcoin
				: bitcoin.networks.testnet
			);
			
			const script = bitcoin.script.compile([

				bitcoin.opcodes.OP_RIPEMD160,
				Buffer.from(secretHash, 'hex'),
				bitcoin.opcodes.OP_EQUALVERIFY,

				Buffer.from(recipientPublicKey, 'hex'),
				bitcoin.opcodes.OP_EQUAL,
				bitcoin.opcodes.OP_IF,

				Buffer.from(recipientPublicKey, 'hex'),
				bitcoin.opcodes.OP_CHECKSIG,

				bitcoin.opcodes.OP_ELSE,

				bitcoin.script.number.encode(lockTime),
				bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY,
				bitcoin.opcodes.OP_DROP,
				Buffer.from(ownerPublicKey, 'hex'),
				bitcoin.opcodes.OP_CHECKSIG,

				bitcoin.opcodes.OP_ENDIF,
			])

			const scriptPubKey  = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(script))
			const scriptAddress = bitcoin.address.fromOutputScript(scriptPubKey, { network: network })
			console.log(scriptAddress);
			return {
				scriptAddress,
			}
			/*
			const { secretHash, ownerPublicKey, recipientPublicKey, lockTime } = data
			let bitcoin = APP.CORE.env.bitcoin;
			const network = (
				APP.CORE.isMainNet
				? bitcoin.networks.bitcoin
				: bitcoin.networks.testnet
			);

			const script = bitcoin.script.compile([

				bitcoin.opcodes.OP_RIPEMD160,
				Buffer.from(secretHash, 'hex'),
				bitcoin.opcodes.OP_EQUALVERIFY,

				Buffer.from(recipientPublicKey, 'hex'),
				bitcoin.opcodes.OP_EQUAL,
				bitcoin.opcodes.OP_IF,

				Buffer.from(recipientPublicKey, 'hex'),
				bitcoin.opcodes.OP_CHECKSIG,

				bitcoin.opcodes.OP_ELSE,

				bitcoin.script.number.encode(lockTime),
				bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY,
				bitcoin.opcodes.OP_DROP,
				Buffer.from(ownerPublicKey, 'hex'),
				bitcoin.opcodes.OP_CHECKSIG,

				bitcoin.opcodes.OP_ENDIF,
			])

			const scriptPubKey  = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(script))
			const scriptAddress = bitcoin.address.fromOutputScript(scriptPubKey, network)

			return {
				scriptAddress,
			}
			*/
		},
		send : function (from, to, amount, callback ) {
			const privateKey = APP.CORE.services.auth.accounts.btc.getPrivateKey();
			let bitcoin = APP.CORE.env.bitcoin;
			const newtx = {
				inputs: [
					{
						addresses: [ from ],
					},
				],
				outputs: [
					{
						addresses: [ to ],
						value: amount * 100000000,
					},
				],
			};
			console.log(1,newtx);
			$.ajax({
				type: "POST",
				url: 'https://api.blockcypher.com/v1/btc/test3/txs/new',
				data: JSON.stringify(newtx),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				complete : function (rv) {
					let d = rv.responseJSON;
					console.log(d);
					const tmptx = {
						...d,
						pubkeys: [],
					};
					const network = (
						APP.CORE.isMainNet
						? bitcoin.networks.bitcoin
						: bitcoin.networks.testnet
					);
					console.log(privateKey,network);
					const keys = new bitcoin.ECPair.fromWIF(
						privateKey, 
						network
					); // eslint-disable-line

					tmptx.signatures = tmptx.tosign.map((toSign) => {
						tmptx.pubkeys.push(keys.getPublicKeyBuffer().toString('hex'))
						return keys.sign(BigInteger.fromHex(toSign.toString('hex')).toBuffer()).toDER().toString('hex')
					});
					console.log(tmptx);
					$.ajax( {
						type : 'POST',
						url : 'https://api.blockcypher.com/v1/btc/test3/txs/send',
						data: JSON.stringify(tmptx),
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						complete : function (rv) {
							const res = rv.responseJSON;
							if (callback instanceof Function) {
								callback(tmptx);
							}
						}
					} );
				} 
			});
		},
		fetchUnspents : function (address, callback) {
			$.ajax( {
				type : 'GET',
				url : `${config.api.bitpay}/addr/${address}/utxo`,
				complete : function (rv) {
					if (callback instanceof Function) {
						callback(rv.responseJSON);
					}
				}
			} );
		},
		fetchUnspentsAsync : async (address) => {
			return await new Promise( retCallback => {
				$.ajax( {
					type : 'GET',
					url : `${config.api.bitpay}/addr/${address}/utxo`,
					complete : function (rv) {
						console.log(rv.responseJSON);
						retCallback(rv.responseJSON);
					}
				} );
			});
			
		},
		broadcastTxAsync : async (txRaw) => {
			return await new Promise( retCallback => {
				$.ajax( {
					type : 'POST',
					url : `${config.api.bitpay}/tx/send`,
					data: {
						rawtx: txRaw,
					},
					complete : function (rv) {
						retCallback(rv.responseJSON);
					},
					error: function (jqXHR, exception) {
						console.log('BTC Action error: broadcastTxAsync');
						console.log(jqXHR,exception);
					}
				} );
			});
		},
		broadcastTx : function (txRaw, callback) {
			$.ajax( {
				type : 'POST',
				url : `${config.api.bitpay}/tx/send`,
				data: JSON.stringify({
					rawtx: txRaw,
				} ),
				complete : function (rv) {
					if (callback instanceof Function) {
						callback(rv.responseJSON);
					}
				}
			} );
		}
	};
	/*{#PM-READY#}*/
} );