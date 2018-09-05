PM.depend([
	"js/app",
	"js/swap"
], function () {
	const root = APP.Help.getTempl( function () {
		/***{#root#}***/
	} );
	APP.SwapViews['ETHTOKEN2BTC'] = function () {
		root.reset();
		const flow = this.swap.flow.state;
		const extra = {};
		if (this.swap.id) {
			root.addVar('root', APP.Help.getHTML( () => {
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
			);
		};
		if (!this.swap.id) {
			if (this.swap.isMy) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<h3>This order doesn&apos;t have a buyer</h3>
					***/
					} )
				);
			} else {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<h3>The order creator is offline. Waiting for him..</h3>
					***/
					} )
				);
			}
		};
		if (flow.isWaitingForOwner) {
			root.addVar('root', APP.Help.getHTML( () => {
				/***
				<h3>Waiting for other user when he connect to the order</h3>
				***/
				} )
			);
		};
		if (flow.step === 1) {
			root.addVar('root', APP.Help.getHTML( () => {
				/***
				<div>
					Confirmation of the transaction is necessary for crediting the reputation.
					If a user does not bring the deal to the end he gets a negative reputation.
				</div>
				***/
				} )
			);
			if (!flow.isSignFetching && !flow.isMeSigned) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<a href="#" class="button cooldown" data-cooldown="10" data-action="sign">Confirm</a>
					***/
					} )
				);
			}
			if (flow.isSignFetching || flow.signTransactionHash) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<h4>Please wait. Confirmation processing</h4>
					***/
					} )
				);
				if (flow.signTransactionHash) {
					root.addVar('root', APP.Help.getHTML( () => {
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
					);
				};
				if (flow.isSignFetching) {
					root.addVar('root', APP.Help.getHTML( () => {
						/***
						<div><b>Wait...</b></div>
						***/
						} )
					);
					
				}
			}
		}
		if (flow.isMeSigned) {
			root.addVar('root', APP.Help.getHTML( () => {
				/***
				<h3>Waiting BTC Owner creates Secret Key, creates BTC Script and charges it</h3>
				***/
				} )
			);
			if (flow.step === 2) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<div><b>Wait...</b></div>
					***/
					} )
				);
			};
			if (flow.secretHash && flow.btcScriptValues) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<h3>Bitcoin Script created and charged. Please check the information below</h3>
					<div>Secret Hash: <strong>{#flow.secretHash#}</strong></div>
					***/
					} )
				);
				if (flow.btcScriptCreatingTransactionHash) {
					root.addVar('root', APP.Help.getHTML( () => {
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
					);
				};
				root.addVar('root', APP.Help.getHTML( () => {
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
				);
				if (flow.step === 3) {
					root.addVar('root', APP.Help.getHTML( () => {
						/***
						<a href="#" class="button cooldown" data-cooldown="60" data-action="confirm-btc-script">Everything is OK. Continue</a>
						***/
						} )
					);
				};
			};
			if (flow.step === 4 && !flow.isBalanceEnough && !flow.isBalanceFetching) {
				root.addVar('root', APP.Help.getHTML( () => {
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
				);
			};
			if (flow.step === 4 && flow.isBalanceFetching) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<div>Checking balance..</div>
					<div><b>Wait...</b></div>
					***/
					} )
				);
			};
			if (flow.step >= 5 || flow.isEthContractFunded) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<h3>Creating Ethereum Contract. Please wait, it will take a while</h3>
					***/
					} )
				);
			};
			if (flow.ethSwapCreationTransactionHash) {
				root.addVar('root', APP.Help.getHTML( () => {
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
				);
			};
			if (flow.step === 5) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<div><b>Wait...</b></div>
					***/
					} )
				);
			};
			if (flow.refundTransactionHash) {
				root.addVar('root', APP.Help.getHTML( () => {
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
				);
			};
			if (flow.step === 6 || flow.isEthWithdrawn) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<h3>Waiting BTC Owner adds Secret Key to ETH Contact</h3>
					***/
					} )
				);
			};
			if (flow.step === 7 || flow.isBtcWithdrawn) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<h3>BTC Owner successfully took money from ETH Contract and left Secret Key. Requesting withdrawal from BTC Script. Please wait</h3>
					***/
					} )
				);
			};
			if (flow.btcSwapWithdrawTransactionHash) {
				root.addVar('root', APP.Help.getHTML( () => {
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
				);
			};
			if (flow.step === 7) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<div><b>Wait...</b></div>
					***/
					} )
				);
			};
			if (flow.isBtcWithdrawn) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<h3>Money was transferred to your wallet. Check the balance.</h3>
					<h2>Thank you for using Swap.Online!</h2>
					***/
					} )
				);
			};
			if (flow.step >= 7 && !flow.isFinished) {
				if (false) {
					root.addVar('root', APP.Help.getHTML( () => {
						/***
						<a href="#" class="button" data-action="try-refund">TRY REFUND</a>
						***/
						} )
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
		root.setObject('extra',extra);
		return root.getPlain();
	};
	APP.AfterInitCall( () => {
		for (var tokenName in config.tokens) {
			if (window.swap.core.constants.COINS[tokenName]!==undefined) {
				APP.SwapViews[window.swap.core.constants.COINS[tokenName]+'2BTC'] = APP.SwapViews['ETHTOKEN2BTC'];
			}
		};
	} );
	/*{#PM-READY#}*/
} );