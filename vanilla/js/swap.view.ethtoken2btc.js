(function () {
	const root = APP.Help.getTempl( function () {
		/***{#root#}***/
	} );
	APP.SwapViews['ETHTOKEN2BTC'] = function () {
		root.reset();
		const flow = this.swap.flow.state;
		if (this.swap.id) {
			root.addVar('root', APP.Help.getTempl( function () {
					/***
					<div>
						<strong>
							{#formated.swap.sellAmount#} 
							{#swap.sellCurrency#} 
							&#10230; 
							{#formated.swap.buyAmount#} 
							{#swap.buyCurrency#}
						</strong>
					</div>
					***/
				} )
				.getSource()
			);
        };
		if (!this.swap.id) {
			if (this.swap.isMy) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<h3>This order doesn&apos;t have a buyer</h3>
					***/
					} )
					.getSource()
				);
			} else {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<h3>The order creator is offline. Waiting for him..</h3>
					***/
					} )
					.getSource()
				);
			}
		};
		if (flow.isWaitingForOwner) {
			root.addVar('root', APP.Help.getTempl( function () {
				/***
				<h3>Waiting for other user when he connect to the order</h3>
				***/
				} )
				.getSource()
			);
		};
		if (flow.step === 1) {
			root.addVar('root', APP.Help.getTempl( function () {
				/***
				<div>
					Confirmation of the transaction is necessary for crediting the reputation.
					If a user does not bring the deal to the end he gets a negative reputation.
				</div>
				***/
				} )
				.getSource()
			);
            if (!flow.isSignFetching && !flow.isMeSigned) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<a href="#" class="button" data-action="sign">Confirm</a>
					***/
					} )
					.getSource()
				);
			}
            if (flow.isSignFetching || flow.signTransactionHash) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
                    <h4>Please wait. Confirmation processing</h4>
					***/
					} )
					.getSource()
				);
				if (flow.signTransactionHash) {
					root.addVar('root', APP.Help.getTempl( function () {
						/***
                        <div>
							Transaction:
							<strong>
								<a
									href="{#config.link.etherscan#}/tx/{#flow.signTransactionHash#}"
									target="_blank"
									rel="noopener noreferrer"
								>
									{#flow.signTransactionHash#}
								</a>
							</strong>
                        </div>
						***/
						} )
						.getSource()
					);
				};
				if (flow.isSignFetching) {
					root.addVar('root', APP.Help.getTempl( function () {
						/***
						<div><b>Wait...</b></div>
						***/
						} )
						.getSource()
					);
					
				}
			}
		}
		if (flow.isMeSigned) {
			root.addVar('root', APP.Help.getTempl( function () {
				/***
				<h3>Waiting BTC Owner creates Secret Key, creates BTC Script and charges it</h3>
				***/
				} )
				.getSource()
			);
			if (flow.step === 2) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<div><b>Wait...</b></div>
					***/
					} )
					.getSource()
				);
			};
			if (flow.secretHash && flow.btcScriptValues) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<h3>Bitcoin Script created and charged. Please check the information below</h3>
					<div>Secret Hash: <strong>{#flow.secretHash#}</strong></div>
					***/
					} )
					.getSource()
				);
				if (flow.btcScriptCreatingTransactionHash) {
					root.addVar('root', APP.Help.getTempl( function () {
						/***
						<div>
							Script address:
							<strong>
								<a
									href="{#config.link.bitpay#}/tx/{#flow.btcScriptCreatingTransactionHash#}"
									target="_blank"
									rel="noopener noreferrer"
								>
									{#flow.btcScriptCreatingTransactionHash#}
								</a>
							</strong>
						</div>
						***/
						} )
						.getSource()
					);
				};
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<pre>
<code>
bitcoinjs.script.compile([
bitcoin.core.opcodes.OP_RIPEMD160,
Buffer.from('{#flow.btcScriptValues.secretHash#}', 'hex'),
bitcoin.core.opcodes.OP_EQUALVERIFY,

Buffer.from('{#flow.btcScriptValues.recipientPublicKey#}', 'hex'),
bitcoin.core.opcodes.OP_EQUAL,
bitcoin.core.opcodes.OP_IF,

Buffer.from('{#flow.btcScriptValues.recipientPublicKey#}', 'hex'),
bitcoin.core.opcodes.OP_CHECKSIG,

bitcoin.core.opcodes.OP_ELSE,

bitcoin.core.script.number.encode({#flow.btcScriptValues.lockTime#}),
bitcoin.core.opcodes.OP_CHECKLOCKTIMEVERIFY,
bitcoin.core.opcodes.OP_DROP,
Buffer.from('{#flow.btcScriptValues.ownerPublicKey#}', 'hex'),
bitcoin.core.opcodes.OP_CHECKSIG,

bitcoin.core.opcodes.OP_ENDIF,
])
</code>
					</pre>
					***/
					} )
					.getSource()
				);
				if (flow.step === 3) {
					root.addVar('root', APP.Help.getTempl( function () {
						/***
						<a href="#" class="button" data-action="confirm-btc-script">Everything is OK. Continue</a>
						***/
						} )
						.getSource()
					);
				};
			};
			if (flow.step === 4 && !flow.isBalanceEnough && !flow.isBalanceFetching) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<h3>Not enough money for this swap. Please fund the balance</h3>
					<div>
						<div>Your balance: <strong>{#flow.balance#}</strong> {#swap.sellCurrency#}</div>
						<div>Required balance: <strong>{#formated.swap.sellAmount#}</strong> {#swap.sellCurrency#}</div>
						<div>Your address: {#swap.flow.myEthAddress#}</div>
						<hr />
						<span>Or fund flow address {#flow.address#}</span>
					</div>
					<a href="#" class="button" data-action="update-balance">Continue</a>
					***/
					} )
					.getSource()
				);
			};
			if (flow.step === 4 && flow.isBalanceFetching) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<div>Checking balance..</div>
					<div><b>Wait...</b></div>
					***/
					} )
					.getSource()
				);
			};
			if (flow.step >= 5 || flow.isEthContractFunded) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<h3>Creating Ethereum Contract. Please wait, it will take a while</h3>
					***/
					} )
					.getSource()
				);
			};
			if (flow.ethSwapCreationTransactionHash) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<div>
						Transaction:
						<strong>
							<a
								href="{#config.link.etherscan#}/tx/{#flow.ethSwapCreationTransactionHash#}"
								target="_blank"
								rel="noopener noreferrer"
							>
								{#flow.ethSwapCreationTransactionHash#}
							</a>
						</strong>
					</div>
					***/
					} )
					.getSource()
				);
			};
			if (flow.step === 5) {
				root.addVar('root', APP.Help.getTempl( function() {
					/***
					<div><b>Wait...</b></div>
					***/
					} )
					.getSource()
				);
			};
			if (flow.refundTransactionHash) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<div>
						Transaction:
						<strong>
							<a
								href="{#config.link.etherscan#}/tx/{#flow.refundTransactionHash#}"
								target="_blank"
								rel="noopener noreferrer"
							>
								{#flow.refundTransactionHash#}
							</a>
						</strong>
					</div>
					***/
					} )
					.getSource()
				);
			};
			if (flow.step === 6 || flow.isEthWithdrawn) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<h3>Waiting BTC Owner adds Secret Key to ETH Contact</h3>
					***/
					} )
					.getSource()
				);
			};
			if (flow.step === 7 || flow.isBtcWithdrawn) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<h3>BTC Owner successfully took money from ETH Contract and left Secret Key. Requesting withdrawal from BTC Script. Please wait</h3>
					***/
					} )
					.getSource()
				);
			};
			if (flow.btcSwapWithdrawTransactionHash) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<div>
						Transaction:
						<strong>
							<a
								href="{#config.link.bitpay#}/tx/{#flow.btcSwapWithdrawTransactionHash#}"
								target="_blank"
								rel="noopener noreferrer"
							>
								{#flow.btcSwapWithdrawTransactionHash#}
							</a>
						</strong>
					</div>
					***/
					} )
					.getSource()
				);
			};
			if (flow.step === 7) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<div><b>Wait...</b></div>
					***/
					} )
					.getSource()
				);
			};
			if (flow.isBtcWithdrawn) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<h3>Money was transferred to your wallet. Check the balance.</h3>
					<h2>Thank you for using Swap.Online!</h2>
					***/
					} )
					.getSource()
				);
			};
			if (flow.step >= 7 && !flow.isFinished) {
				if (false) {
					root.addVar('root', APP.Help.getTempl( function () {
						/***
						<a href="#" class="button" data-action="try-refund">TRY REFUND</a>
						***/
						} )
						.getSource()
					);
				}
			};
		};
		root.setObject('flow',flow);
		root.setObject('swap',this.swap);
		root.setObject('formated', {
			swap : {
				sellAmount : this.swap.sellAmount.toNumber(),
				buyAmount : this.swap.buyAmount.toNumber()
			}
		});
		root.setObject('config',config);
		return root.getPlain();
	};
	APP.SwapViews['SWAP2BTC'] = APP.SwapViews['ETHTOKEN2BTC'];
	APP.SwapViews['NOXON2BTC'] = APP.SwapViews['ETHTOKEN2BTC'];
} )();