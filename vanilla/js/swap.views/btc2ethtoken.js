PM.depend([
	"js/app",
	"js/swap"
], function () {
	const root = APP.Help.getTempl( function () {
		/***{#root#}***/
	} );
  const addressQRCore = APP.Help.getTempl( () => {
    /***
    <div class="-qr-code">
      <img src="https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=bitcoin:{#address#}?&amount={#amount#}"
          title="Scan and fund {#address#} amount {#amount#}" />
    </div>
    ***/
  } );
	APP.SwapViews['BTC2ETHTOKEN'] = function () {
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
		if (flow.step === 1 || flow.isMeSigned) {
			root.addVar('root', APP.Help.getHTML( () => {
				/***
				<h3>Waiting participant confirm this swap</h3>
				***/
				} )
			);
		};
		if (flow.isParticipantSigned) {
			root.addVar('root', APP.Help.getHTML( () => {
				/***
				<h3>Create a secret key</h3>
				***/
				} )
			);
			if (!flow.secretHash) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<a href="#" class="button cooldown" data-cooldown="30" data-action="submit-secret">Submit random secret</a>
					***/
					} )
				);
			};
			if (flow.secretHash) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<div>Save the secret key! Otherwise there will be a chance you loose your money!</div>
					<div>Secret Key: <strong>{#flow.secret#}</strong></div>
					<div>Secret Hash: <strong>{#flow.secretHash#}</strong></div>
					***/
					} )
				);
			};
			if (flow.step === 3 && !flow.isBalanceEnough && !flow.isBalanceFetching) {
				root.addVar('root', APP.Help.getHTML( () => {
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
				);
			};
			if (flow.step === 3 && flow.isBalanceFetching) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<div>Checking balance..</div>
					***/
					} )
				);
			};
			if (flow.step === 4 || flow.btcScriptValues) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<h3>Creating Bitcoin Script. Please wait, it will take a while</h3>
					***/
					} )
				);
			}
			if (flow.step === 4 && !flow.isBalanceEnough && !flow.isBalanceFetching) {
				if (flow.btcScriptValues && flow.scriptAddress) {
					root.addVar('root', APP.Help.getHTML( () => {
						/***
						<h3>Please charge BTC script</h3>
						<div>
							<div>Required balance: <strong>{#formated.swap.sellAmountWithFee#} ({#formated.swap.sellAmount#} + fee (0.00015)) </strong> {#swap.sellCurrency#}</div>
							<div>Script address: {#flow.scriptAddress#}</div>
							<div>Current script balance:</div>
							<div>{#flow.scriptBalance#} BTC (+{#flow.scriptUnconfirmedBalance#} unconfirmed BTC)</div>
              <div class="-qr-code">
                <img src="https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=bitcoin:{#flow.scriptAddress#}?&amount={#formated.swap.sellAmountWithFee#}"
                    title="Scan and fund {#flow.scriptAddress#} amount {#formated.swap.sellAmountWithFee#}" />
              </div>
							<hr />
              
						</div>
						<br />
						<a href="#" class="button" data-action="check-script-balance">Check BTC script balance and continue</a>
						***/
						} )
					);
				}
			}
			if (flow.step === 4 && flow.isBalanceFetching) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<div>Checking BTC script balance..</div>
					***/
					} )
				);
			};
			if (flow.step === 4 || flow.btcScriptValues) {
				if (flow.btcScriptCreatingTransactionHash) {
					root.addVar('root', APP.Help.getHTML( () => {
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
					);
				};
			};
			if (flow.btcScriptValues && flow.isBalanceEnough && !flow.isFinished && !flow.isEthWithdrawn) {
				if (!flow.refundTxHex) {
					root.addVar('root', APP.Help.getHTML( () => {
						/***
						<a href="#" class="button" data-action="get-refund-tx-hex">Create refund hex</a>
						***/
						} )
					);
				};
				if (flow.refundTxHex) {
					root.addVar('root', APP.Help.getHTML( () => {
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
					);
				};
			};
			if (flow.step === 5 || flow.isEthContractFunded) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<h3>ETH Owner received Bitcoin Script and Secret Hash. Waiting when he creates ETH Contract</h3>
					***/
					} )
				);
			};
			if (flow.step === 6 || flow.isEthWithdrawn) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<h3>ETH Contract created and charged. Requesting withdrawal from ETH Contract. Please wait</h3>
					***/
					} )
				);
			};
			if (flow.ethSwapWithdrawTransactionHash) {
				root.addVar('root', APP.Help.getHTML( () => {
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
				);
			};
			if (flow.step === 6) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<div><b>Wait...</b></div>
					***/
					} )
				);
			};
			if (flow.isEthWithdrawn) {
				root.addVar('root', APP.Help.getHTML( () => {
					/***
					<h3>Money was transferred to your wallet. Check the balance.</h3>
					<h2>Thank you for using Swap.Online!</h2>
					***/
					} )
				);
				/* resell */
				if (!this.no_resell) {
					( function () {
						/* one coin cost */
						root.addVar('root', APP.Help.getHTML( () => {
							/***
							<h4>Place a return request for {#swap.buyCurrency#}-BTC:</h4>
							<div>One coin cost {#extra.oneCoinCost#}</div>
							<div>One coin cost+5% {#extra.p5f#}</div>
							<div>New order cost {#extra.newSell5pf#}</div>
							<div>You can participate in the trade if you place a counter-claim with an extra charge)</div>
							<a href="#" class="button" data-action="re-sell" data-percent="5%">
								Sell at 5% more expensive than you bought
							</a>
							<a href="#" class="button" data-action="re-sell" data-percent="10%">
								Sell at 10% more expensive than you bought
							</a>
							<a href="#" class="button" data-action="re-sell" data-percent="15%">
								Sell at 15% more expensive than you bought
							</a>
							***/
						} ) );
					} )();
				}
			};
			if (flow.step >= 6 && !flow.isFinished) {
				if (false) {
					root.addVar('root', APP.Help.getHTML( () => {
						/***
						<a href="#" class="button" data-action="try-refund">TRY REFUND</a>
						***/
						} )
					);
				}
			};
			if (flow.refundTransactionHash) {
				root.addVar('root', APP.Help.getHTML( () => {
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
				);
			};
		};
		
		root.setObject('flow',flow);
		root.setObject('swap',this.swap);
		root.setObject('formated', {
			swap : {
				sellAmount : this.swap.sellAmount.toNumber(),
				sellAmountWithFee : this.swap.sellAmount.toNumber()+0.00015,
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
				APP.SwapViews['BTC2'+window.swap.core.constants.COINS[tokenName]] = APP.SwapViews['BTC2ETHTOKEN'];
			}
		};
	} );
	/*{#PM-READY#}*/
} );