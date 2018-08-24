(function () {
	const root = APP.Help.getTempl( function () {
		/***{#root#}***/
	} );
	APP.SwapViews['BTC2ETHTOKEN'] = function () {
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
		if (flow.step === 1 || flow.isMeSigned) {
			root.addVar('root', APP.Help.getTempl( function () {
				/***
				<h3>1. Waiting participant confirm this swap</h3>
				***/
				} )
				.getSource()
			);
		};
		if (flow.isParticipantSigned) {
			root.addVar('root', APP.Help.getTempl( function () {
				/***
				<h3>2. Create a secret key</h3>
				***/
				} )
				.getSource()
			);
			if (!flow.secretHash) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<a href="#" class="button" data-action="submit-secret">Submit random secret</a>
					***/
					} )
					.getSource()
				);
			};
			if (flow.secretHash) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<div>Save the secret key! Otherwise there will be a chance you loose your money!</div>
                    <div>Secret Key: <strong>{#flow.secret#}</strong></div>
                    <div>Secret Hash: <strong>{#flow.secretHash#}</strong></div>
					***/
					} )
					.getSource()
                );
			};
			if (flow.step === 3 && !flow.isBalanceEnough && !flow.isBalanceFetching) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
                    <h3>Not enough money for this swap. Please charge the balance</h3>
                    <div>
						<div>Your balance: <strong>{#flow.balance#}</strong> {#swap.sellCurrency#}</div>
						<div>Required balance: <strong>{#formated.swap.sellAmount#}</strong> {#swap.sellCurrency#}</div>
						<div>Your address: {#swap.flow.myBtcAddress#}</div>
						<hr />
						<span>Or charge flow address {#flow.address#}</span>
                    </div>
					<br />
					<a href="#" class="button" data-action="update-balance">Continue</a>
					***/
					} )
					.getSource()
                );
			};
			if (flow.step === 3 && flow.isBalanceFetching) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
                    <div>Checking balance..</div>
					***/
					} )
					.getSource()
				);
			};
			if (flow.step === 4 || flow.btcScriptValues) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
                    <h3>3. Creating Bitcoin Script. Please wait, it will take a while</h3>
					***/
					} )
					.getSource()
				);
				if (flow.btcScriptCreatingTransactionHash) {
					root.addVar('root', APP.Help.getTempl( function () {
						/***
                        <div>
							Transaction:
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
			};
			if (flow.btcScriptValues && !flow.isFinished && !flow.isEthWithdrawn) {
				if (!flow.refundTxHex) {
					root.addVar('root', APP.Help.getTempl( function () {
						/***
						<a href="#" class="button" data-action="get-refund-tx-hex">Create refund hex</a>
						***/
						} )
						.getSource()
					);
				};
				if (flow.refundTxHex) {
					root.addVar('root', APP.Help.getTempl( function () {
						/***
						<div>
							<a
								href="https://wiki.swap.online/faq/my-swap-got-stuck-and-my-bitcoin-has-been-withdrawn-what-to-do/"
								target="_blank"
								rel="noopener noreferrer"
							>
								How refund your money ?
							</a>
							Refund hex transaction:
							<code>
								{#flow.refundTxHex#}
							</code>
                        </div>
						***/
						} )
						.getSource()
					);
				};
			};
			if (flow.step === 5 || flow.isEthContractFunded) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
                    <h3>4. ETH Owner received Bitcoin Script and Secret Hash. Waiting when he creates ETH Contract</h3>
					***/
					} )
					.getSource()
				);
			};
			if (flow.step === 6 || flow.isEthWithdrawn) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<h3>5. ETH Contract created and charged. Requesting withdrawal from ETH Contract. Please wait</h3>
					***/
					} )
					.getSource()
				);
			};
			if (flow.ethSwapWithdrawTransactionHash) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<div>
						Transaction:
						<strong>
							<a
								href="{#config.link.etherscan#}/tx/{#flow.ethSwapWithdrawTransactionHash#}"
								target="_blank"
								rel="noreferrer noopener"
							>
								{#flow.ethSwapWithdrawTransactionHash#}
							</a>
						</strong>
					</div>
					***/
					} )
					.getSource()
                );
			};
			if (flow.step === 6) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<div><b>Wait...</b></div>
					***/
					} )
					.getSource()
				);
			};
			if (flow.isEthWithdrawn) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<h3>6. Money was transferred to your wallet. Check the balance.</h3>
                    <h2>Thank you for using Swap.Online!</h2>
					***/
					} )
					.getSource()
				);
			};
			if (flow.step >= 6 && !flow.isFinished) {
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
			if (flow.refundTransactionHash) {
				root.addVar('root', APP.Help.getTempl( function () {
					/***
					<div>
						Transaction:
						<strong>
							<a
								href="{#config.link.bitpay#}/tx/{#flow.refundTransactionHash#}"
								target="_blank"
								rel="noreferrer noopener"
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
	APP.SwapViews['BTC2SWAP'] = APP.SwapViews['BTC2ETHTOKEN'];
	APP.SwapViews['BTC2NOXON'] = APP.SwapViews['BTC2ETHTOKEN'];
} )();