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
	APP.SwapViews['ETHTOKEN2USDT'] = function () {
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
		if (flow.step === 1 || flow.isMeSigned) {
			render( () => { /***
				<h3>1. Please confirm your participation to begin the deal</h3>
			***/ } );
        };
        if (flow.step === 1) {
			render( () => { /***
				<div>
					Confirmation of the transaction is necessary for crediting the reputation.
					If a user does not bring the deal to the end he gets a negative reputation.
				</div>
				***/
			} );
			if (!flow.isSignFetching && !flow.isMeSigned) {
				render( () => { /***
					<br />
					<TimerButton brand onClick={this.signSwap}>Confirm</TimerButton>
				***/ } );
			}
			if (flow.isSignFetching || flow.signTransactionHash) {
				render( () => { /***
					<h4>Please wait. Confirmation processing</h4>
				***/ } );
				if (flow.signTransactionHash) {
					render( () => { /***
						<div>
							Transaction:
							<strong>
								<a
									href={`${config.link.etherscan}/tx/${flow.signTransactionHash}`}
									target="_blank"
									rel="noopener noreferrer"
								>{flow.signTransactionHash}</a>
							</strong>
						</div>
					***/});
				};
				if (flow.isSignFetching) {
					render( () => { /*** <div><b>Wait....</b></div> ***/ } )
				};
			}
        }
        if (flow.isMeSigned) {
			render( () => { /***
				<h3>2. Waiting BTC Owner creates Secret Key, creates BTC Script and charges it</h3>
			***/ } );
			if (flow.step === 2) {
				render( () => { /*** <div><b>Wait...</b></div> ***/ } );
			}
			if (flow.secretHash && flow.usdtScriptValues) {
				render( () => { /***
					<h3>3. Bitcoin Script created and charged. Please check the information below</h3>
                    <div>Secret Hash: <strong>{flow.secretHash}</strong></div>
				***/ } );
				if (flow.usdtFundingTransactionHash) {
					render( () => { /***
						<div>
							Script address:
							<strong>
								<a
									href={`${config.link.bitpay}/tx/${flow.usdtFundingTransactionHash}`}
									target="_blank"
									rel="noopener noreferrer"
									>{flow.usdtFundingTransactionHash}</a>
							</strong>
						</div>
					***/ } );
				};
				if ( flow.usdtScriptValues ) {
					render( () => { /***
						<br />
                        <pre>
							<code>{`
bitcoinjs.script.compile([
	bitcoin.core.opcodes.OP_RIPEMD160,
    Buffer.from('${flow.usdtScriptValues.secretHash}', 'hex'),
    bitcoin.core.opcodes.OP_EQUALVERIFY,

    Buffer.from('${flow.usdtScriptValues.recipientPublicKey}', 'hex'),
    bitcoin.core.opcodes.OP_EQUAL,
    bitcoin.core.opcodes.OP_IF,

    Buffer.from('${flow.usdtScriptValues.recipientPublicKey}', 'hex'),
    bitcoin.core.opcodes.OP_CHECKSIG,

    bitcoin.core.opcodes.OP_ELSE,

    bitcoin.core.script.number.encode(${flow.usdtScriptValues.lockTime}),
    bitcoin.core.opcodes.OP_CHECKLOCKTIMEVERIFY,
    bitcoin.core.opcodes.OP_DROP,
    Buffer.from('${flow.usdtScriptValues.ownerPublicKey}', 'hex'),
    bitcoin.core.opcodes.OP_CHECKSIG,

    bitcoin.core.opcodes.OP_ENDIF,
])
                      `}
							</code>
						</pre>
					***/ } );
				};
                render( () => { /***
                    <br />
                    <br />
				***/ } );
				if (flow.step === 3) {
					render( () => { /***
					  <br />
					  <TimerButton brand onClick={this.confirmBTCScriptChecked}>Everything is OK. Continue</TimerButton>
					***/ } );
                }
			};
			if (flow.step === 4 && !flow.isBalanceEnough && !flow.isBalanceFetching) {
				render( () => { /***
					<h3>Not enough money for this swap. Please fund the balance</h3>
                    <div>
						<div>Your balance: <strong>{flow.balance}</strong> {this.swap.sellCurrency}</div>
						<div>Required balance: <strong>{this.swap.sellAmount.toNumber()}</strong> {this.swap.sellCurrency}</div>
						<div>Your address: {this.swap.flow.myEthAddress}</div>
						<hr />
						<span>{flow.address}</span>
                    </div>
                    <br />
                    <TimerButton brand onClick={this.updateBalance}>Continue</TimerButton>
				***/ } );
			};
			if (flow.step === 4 && flow.isBalanceFetching) {
				render( () => { /***
					<div>Checking balance..</div>
                    <div><b>Wait...</b></div>
				***/ } );
			};
			if (flow.step >= 5 || flow.isEthContractFunded) {
				render( () => { /***
					<h3>4. Creating Ethereum Contract. Please wait, it will take a while</h3>
				***/ } );
			};
            if (flow.ethSwapCreationTransactionHash) {
				render( () => { /***
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
            if (flow.step === 5) {
				render( () => { /*** <div><b>Wait</b></div> ***/ } );
			};
			if (flow.refundTransactionHash) {
				render( () => { /***
					<div>
						Transaction:
						<strong>
							<a
								href={`${config.link.etherscan}/tx/${flow.refundTransactionHash}`}
								target="_blank"
								rel="noopener noreferrer"
							>{flow.refundTransactionHash}</a>
						</strong>
					</div>
				***/ } );
			};
			if (flow.step === 6 || flow.isEthWithdrawn) {
				render( () => { /***
					<h3>5. Waiting BTC Owner adds Secret Key to ETH Contact</h3>
				***/ } );
				if (!flow.isEthWithdrawn) {
					render( () => { /*** <div><b>Wait...</b></div> ***/ } );
				};
			};
			if (flow.step === 7 || flow.isBtcWithdrawn) {
				render( () => { /***
					<h3>6. BTC Owner successfully took money from ETH Contract and left Secret Key. Requesting withdrawal from BTC Script. Please wait</h3>
				***/ } );
			};
            if (flow.usdtSwapWithdrawTransactionHash) {
				render( () => { /***
					<div>
						Transaction:
						<strong>
							<a
								href={`${config.link.bitpay}/tx/${flow.usdtSwapWithdrawTransactionHash}`}
								target="_blank"
								rel="noopener noreferrer"
							>{flow.usdtSwapWithdrawTransactionHash}</a>
						</strong>
					</div>
				***/ } );
			};
			if (flow.step === 7) {
				render( () => { /*** <div><b>Wait...</b></div> ***/ } );
			};
			if (flow.isBtcWithdrawn) {
				render( () => { /***
					<h3>7. Money was transferred to your wallet. Check the balance.</h3>
                    <h2>Thank you for using Swap.Online!</h2>
					***/
				} );
			};
			if (flow.step >= 6 && !flow.isFinished) {
				/*
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    { enabledButton && !flow.isBtcWithdrawn && <Button brand onClick={this.tryRefund}>TRY REFUND</Button> }
                    <Timer
                      lockTime={(flow.usdtScriptValues.lockTime - 5400) * 1000}
                      enabledButton={() => this.setState({ enabledButton: true })}
                    />
                  </div>
				  */
                
			};
        }
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
			APP.SwapViews[window.swap.core.constants.COINS[tokenName]+'2USDT'] = APP.SwapViews['ETHTOKEN2USDT'];
		}
	};
	/*{#PM-READY#}*/
} );