(function () {
	const root = APP.Help.getTempl( function () {
		/*
		{#tmpl-begin#}
			{#root#}
		{#tmpl-end#}
		*/
	} );
	APP.SwapViews['BTC2ETH'] = function () {
		root.reset();
		const flow = this.swap.flow.state;
		console.log('BTC2ETH swap update view');
		console.log(flow);
		if (flow.isSignFetching) {
			if (flow.secretHash && flow.secret) {
				root.addVar('root', APP.Help.getTempl( function () {
					/*
					{#tmpl-begin#}
					<div>Save the secret key! Otherwise there will be a chance you loose your money!</div>
					<div>Secret Key: <strong>{#flow.secret#}</strong></div>
					<div>Secret Hash: <strong>{#flow.secretHash#}</strong></div>
					{#tmpl-end#}
					*/
					} )
					.getSource()
				);
			};
			if (flow.step === 3 && !flow.isBalanceEnough && !flow.isBalanceFetching) {
				root.addVar('root', APP.Help.getTempl( function () {
					/*
					{#tmpl-begin#}
					<h3>Not enough money for this swap. Please charge the balance</h3>
					<div>
					  <div>Your balance: <strong>{#flow.balance#}</strong> {swap.sellCurrency}</div>
					  <div>Required balance: <strong>{swap.sellAmount.toNumber()}</strong> {swap.sellCurrency}</div>
					  <div>Your address: {swap.flow.myBtcAddress}</div>
					  <hr />
					  <span>{#flow.address#}</span>
					  <Button brand onClick={this.updateBalance}>Continue</Button>
					</div>
					{#tmpl-end#}
					*/
					} )
					.getSource()
				);
			};
			if (flow.step === 3 && flow.isBalanceFetching) {
				root.addVar('root', APP.Help.getTempl( function () {
					/*
					{#tmpl-begin#}
					<div>Checking balance..</div>
					{#tmpl-end#}
					*/
					} )
					.getSource()
				);
			};
			if (flow.step === 4 || flow.btcScriptValues) {
				root.addVar('root', APP.Help.getTempl( function () {
					/*
					{#tmpl-begin#}
					<h3>3. Creating Bitcoin Script. Please wait, it will take a while</h3>
					{#tmpl-end#}
					*/
					} )
					.getSource()
				);
				if (flow.btcScriptCreatingTransactionHash) {
					root.addVar('root', APP.Help.getTempl( function () {
						/*
						{#tmpl-begin#}
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
						{#tmpl-end#}
						*/
						} )
						.getSource()
					);
				}
			}
			/*

			  
			  {
				flow.btcScriptValues && !flow.isFinished && !flow.isEthWithdrawn && (
				  <Fragment>
					<br />
					{ !flow.refundTxHex && <Button brand onClick={this.getRefundTxHex}> Create refund hex</Button> }
					{
					  flow.refundTxHex && (
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
							{flow.refundTxHex}
						  </code>
						</div>
					  )
					}
				  </Fragment>
				)
			  }
			  {
				(flow.step === 5 || flow.isEthContractFunded) && (
				  <Fragment>
					<h3>4. ETH Owner received Bitcoin Script and Secret Hash. Waiting when he creates ETH Contract</h3>
					{
					  !flow.isEthContractFunded && (
						<InlineLoader />
					  )
					}
				  </Fragment>
				)
			  }
			  {
				flow.ethSwapCreationTransactionHash && (
				  <div>
					Transaction:
					<strong>
					  <a
						href={`${config.link.etherscan}/tx/${flow.ethSwapCreationTransactionHash}`}
						target="_blank"
						rel="noopener noreferrer"
					  >
						{flow.ethSwapCreationTransactionHash}
					  </a>
					</strong>
				  </div>
				)
			  }
			  {
				(flow.step === 6 || flow.isEthWithdrawn) && (
				  <h3>5. ETH Contract created and charged. Requesting withdrawal from ETH Contract. Please wait</h3>
				)
			  }
			  {
				flow.ethSwapWithdrawTransactionHash && (
				  <div>
					Transaction:
					<strong>
					  <a
						href={`${config.link.etherscan}/tx/${flow.ethSwapWithdrawTransactionHash}`}
						target="_blank"
						rel="noreferrer noopener"
					  >
						{flow.ethSwapWithdrawTransactionHash}
					  </a>
					</strong>
				  </div>
				)
			  }
			  {
				flow.step === 6 && (
				  <InlineLoader />
				)
			  }

			  {
				flow.isEthWithdrawn && (
				  <Fragment>
					<h3>6. Money was transferred to your wallet. Check the balance.</h3>
					<h2>Thank you for using Swap.Online!</h2>
				  </Fragment>
				)
			  }
			  {
				flow.step >= 5 && !flow.isFinished && (
				  <div style={{ display: 'flex', alignItems: 'center' }}>
					{ enabledButton && !flow.isEthWithdrawn && <Button brand onClick={this.tryRefund}>TRY REFUND</Button> }
					<Timer
					  lockTime={flow.btcScriptValues.lockTime * 1000}
					  enabledButton={() => this.setState({ enabledButton: true })}
					/>
				  </div>
				)
			  }
			  {
				flow.refundTransactionHash && (
				  <div>
					Transaction:
					<strong>
					  <a
						href={`${config.link.bitpay}/tx/${flow.refundTransactionHash}`}
						target="_blank"
						rel="noreferrer noopener"
					  >
						{flow.refundTransactionHash}
					  </a>
					</strong>
				  </div>
				)
			  }
			</Fragment>
		  )
		}
		*/
		};
		root.setObject('flow',flow);
		root.setObject('config',config);
		return root.getPlain();
	};
} )();