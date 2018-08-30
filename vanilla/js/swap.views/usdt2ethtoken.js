PM.depend([
	"js/app",
	"js/swap"
], function () {
	const root = APP.Help.getTempl( function () {
		/***{#root#}***/
	} );
	const render = function ( tmpl ) { 
		root.addVar('root', APP.Help.getHTML( tmpl ) );
	};
	APP.SwapViews['USDT2ETHTOKEN'] = function () {
		root.reset();
		const flow = this.swap.flow.state;
		const extra = {};
		if (this.swap.id) {
			render( () => {
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
			} );
		};
		if (!this.swap.id) {
			if (this.swap.isMy) {
				render( () => { /***
					<h3>This order doesn&apos;t have a buyer</h3>
				***/ } );
			} else {
				render( () => { /***
					<h3>The order creator is offline. Waiting for him..</h3>
				***/ } )
			}
		};
		if (flow.isWaitingForOwner) {
			render( () => { /***
				<h3>Waiting for other user when he connect to the order</h3>
			***/ } );
		};
		if (flow.isParticipantSigned) {
            render( () => { /***
				<h3>2. Create a secret key</h3>
			***/ } );
			if (!flow.secretHash) {
				render( () => { /***
                    <input type="text" placeholder="Secret Key" defaultValue={secret} />
                    <br />
                    <TimerButton brand onClick={this.submitSecret}>Confirm</TimerButton>
				***/ } );
			} else {
				render( () => { /***
					<div>Save the secret key! Otherwise there will be a chance you loose your money!</div>
                    <div>Secret Key: <strong>{flow.secret}</strong></div>
                    <div>Secret Hash: <strong>{flow.secretHash}</strong></div>
				***/ } );
			};
			if (flow.step === 3 && !flow.isBalanceEnough && !flow.isBalanceFetching) {
				render( () => { /***
					<h3>Not enough money for this swap. Please charge the balance</h3>
                    <div>
						<div>Your balance: <strong>{flow.balance}</strong> {this.swap.sellCurrency}</div>
						<div>Required balance: <strong>{this.swap.sellAmount.toNumber()}</strong> {this.swap.sellCurrency}</div>
						<div>Your address: {this.swap.flow.myBtcAddress}</div>
						<hr />
						<span>{flow.address}</span>
                    </div>
                    <br />
                    <TimerButton brand onClick={this.updateBalance}>Continue</TimerButton>
				***/ } );
			};
			if (flow.step === 3 && flow.isBalanceFetching) {
				render ( () => { /***
					<div>Checking balance..</div>
                    <div><b>Wait...</b></div>
				***/ } );
			};
			if (flow.step === 4 || flow.usdtScriptValues) {
				render ( () => { /***
					<h3>3. Creating Bitcoin Script. Please wait, it will take a while</h3>
				***/ } );
				if (flow.usdtFundingTransactionHash) {
					render ( () => { /***
						<div>
							Transaction:
							<strong>
								<a
									href={`${config.link.bitpay}/tx/${flow.usdtFundingTransactionHash}`}
									target="_blank"
									rel="noopener noreferrer"
								>{flow.usdtFundingTransactionHash}</a>
							</strong>
                        </div>
					***/ } );
                    if (!flow.usdtScriptValues) {
						render ( () => { /*** <div><b>Wait...</b></div> ***/ } );
                    };
				};
				if (flow.usdtScriptValues && !flow.isFinished && !flow.isEthWithdrawn) {
					if (!flow.refundTxHex) {
						render( () => { /***
							<Button brand onClick={this.getRefundTxHex}> Create refund hex</Button>
						***/ } );
					};
					if (flow.refundTxHex) {
						render ( () => { /***
							<div>
								<a
									href="https://wiki.swap.online/faq/my-swap-got-stuck-and-my-bitcoin-has-been-withdrawn-what-to-do/"
									target="_blank"
									rel="noopener noreferrer"
								>How refund your money ?</a>
								Refund hex transaction:
								<code>{flow.refundTxHex}</code>
							</div>
						***/ } );
                    };
				}
			};
			if (flow.step === 5 || flow.isEthContractFunded) {
				render ( () => { /***
					<h3>4. ETH Owner received Bitcoin Script and Secret Hash. Waiting when he creates ETH Contract</h3>
				***/ } );
				if (!flow.isEthContractFunded) {
					render ( () => { /*** <div><b>Wait...</b></div> ***/ } );
				}
			};
			if (flow.ethSwapCreationTransactionHash) {
				render ( () => { /***
					<div>
						Transaction:
						<strong>
							<a
								href={`${config.link.etherscan}/tx/${flow.ethSwapCreationTransactionHash}`}
								target="_blank"
								rel="noopener noreferrer"
							>{flow.ethSwapCreationTransactionHash}</a>
						</strong>
					</div>
				***/ } );
			};
			if (flow.step === 6 || flow.isEthWithdrawn) {
				render ( () => { /***
					<h3>5. ETH Contract created and charged. Requesting withdrawal from ETH Contract. Please wait</h3>
                ***/ } );
			};
            if (flow.ethSwapWithdrawTransactionHash) {
				render ( () => { /***
					<div>
						Transaction:
						<strong>
							<a
								href={`${config.link.etherscan}/tx/${flow.ethSwapWithdrawTransactionHash}`}
								target="_blank"
								rel="noreferrer noopener"
							>{flow.ethSwapWithdrawTransactionHash}</a>
						</strong>
					</div>
				***/ } );
			};
            if (flow.step === 6) {
				render ( () => { /*** <div><b>Wait...</b></div> ***/ } );
			};
			if (flow.isEthWithdrawn) {
				render ( () => { /***
					<h3>6. Money was transferred to your wallet. Check the balance.</h3>
                    <h2>Thank you for using Swap.Online!</h2>
				***/ } );
			};
            if (flow.step >= 5 && !flow.isFinished) {
				/*
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    { enabledButton && !flow.isEthWithdrawn && <Button brand onClick={this.tryRefund}>TRY REFUND</Button> }
                    <Timer
                      lockTime={flow.usdtScriptValues.lockTime * 1000}
                      enabledButton={() => this.setState({ enabledButton: true })}
                    />
                  </div>
				  */
			};
            if (flow.refundTransactionHash) {
				render ( () => { /***
					<div>
						Transaction:
						<strong>
							<a
								href={`${config.link.bitpay}/tx/${flow.refundTransactionHash}`}
								target="_blank"
								rel="noreferrer noopener"
							>{flow.refundTransactionHash}</a>
						</strong>
					</div>
				***/ } );
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
	for (var tokenName in config.tokens) {
		if (window.swap.core.constants.COINS[tokenName]!==undefined) {
			APP.SwapViews["USDT2"+window.swap.core.constants.COINS[tokenName]] = APP.SwapViews['USDT2ETHTOKEN'];
		}
	};
	/*{#PM-READY#}*/
} );