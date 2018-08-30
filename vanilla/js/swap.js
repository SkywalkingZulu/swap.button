PM.depend("js/app", function () {
	APP.Swap = function (orderID) {
		const order = APP.CORE.services.orders.getByKey(orderID);
		
		const flowType = (!order.isMy) ? 
			order.buyCurrency+"2"+order.sellCurrency : 
			order.sellCurrency+"2"+order.buyCurrency;
		
		const validOrderData = {
			sellCurrency : (order.isMy) ? order.sellCurrency : order.buyCurrency,
			buyCurrency : (order.isMy) ? order.buyCurrency : order.sellCurrency,
			sellAmount : (order.isMy) ? order.sellAmount : order.buyAmount,
			buyAmount : (order.isMy) ? order.buyAmount : order.sellAmount
		};
		const initTimerButton = function (button) {
			const origText = button.html();
			let startTime = button.data('cooldown') + 1;
			let timer = 0;
			button.bind('click', function (e) {
				e.preventDefault();
				window.clearTimeout( timer );
			} );
			const timerCB = function () {
				startTime = startTime - 1;
				button.html( origText + "&nbsp;("+startTime+")" );
				if (startTime===0) {
					button.trigger('click');
				} else {
					timer = window.setTimeout( timerCB , 1000 );
				}
			};
			timerCB();
		};
		const initTimerButtons = function (holder) {
			let $timer_buttons = $(holder).find('.cooldown');
			$.each($timer_buttons, function (i,timer) {
				initTimerButton($(timer).removeClass('cooldown'));
			} );
		};
		const controlsRequest = APP.Help.getTempl(function () {
			/***
			<div>
				<a href="#" class="button" data-action="begin">[SEND REQUEST]</a>
			</div>
			<div>
				<a href="#" class="button" data-action="close-window">[CLOSE]</a>
			</div>
			***/
		} );
		const controlsWaitAccept = APP.Help.getTempl(function () {
			/***
			<div>
				<a href="#" class="button">[WAIT ACCEPT]</a>
			</div>
			<div>
				<a href="#" class="button" data-action="close-window">[CANCEL SWAP]</a>
			</div>
			***/
		} );
		const controlsDeclime = APP.Help.getTempl(function () {
			/***
			<div>
				<a href="#" class="button" data-action="close-window-silent">[YOUR REQUEST DECLIMED - CLOSE WINDOW]</a>
			</div>
			***/
		} );
		const controlsAccept = APP.Help.getTempl(function () {
			/***
			<div>
				<a href="#" class="button" data-action="begin">[BEGIN]</a>
			</div>
			<div>
				<a href="#" class="button" data-action="close-window">[CLOSE]</a>
			</div>
			***/
		} );
		/* Check - is token flow? */
		const accountInfo = APP.Help.getTempl(function () {
			/***
			<article class="active-step" data-step="init">Initialization</article>
			<article data-step="begin">
				<div>
					You BitCoin address : 
					<b data-target="user-auth-btc-address">0x</b>
				</div>
				<div>
					You BitCoin balance : 
					<b data-target="user-auth-btc-balance">0</b>
				</div>
				<div>
					You Etherium address : 
					<b data-target="user-auth-eth-address">0x</b>
				</div>
				<div>
					You Etherium balance : 
					<b data-target="user-auth-eth-balance">0x</b>
				</div>
				<div>You swap 
					<b data-target="order-sell-amount">-</b>
					<b data-target="order-sell-currency">-</b>
					&nbsp;to&nbsp;
					<b data-target="order-buy-amount">-</b>
					<b data-target="order-buy-currency">-</b>
				</div>
				{#tokenBalance#}
				<div data-target="controls">
					{#controls#}
				</div>
			</article>
			<article data-step="wait-other-user">
				<div>Wait other user press &quot;Begin&quot;</div>
			</article>
			***/
		});
		const tokenBalance = APP.Help.getTempl( () => {
			/***
			<div>
				You have <b data-target="user-auth-token-balance"></b> {#tokenName#}
			</div>
			***/
		} );
		let view = APP.Help.getTempl(function() {
			/***
			<section class="swap-holder" data-order-id="{#order.id#}">
				<header>Swap
					<b data-target="swap-current-step">0</b>
					&nbsp;of&nbsp;
					<b data-target="swap-total-steps">0</b>
				</header>
				{#beginStep#}
				<div data-target="step-info"></div>
				<article data-step="finish">
					<div>Ready</div>
					<div>
						<a href="#" data-target="tx-link" target="_blank">tx link</a>
					</div>
					<div>
						<a href="#" class="button" data-action="close-window-silent">[CLOSE]</a>
					</div>
				</article>
			</section>
			***/
		});
		
		view.bind_var('validOrderData',validOrderData);
		view.bind_var('order',order);
		view.bind_var('prevStep',0);
		
		view.bind_func('update_view', function () { } );
		view.bind_func('updateView', function () { return ''; } );
		
		
		
		
		view.bind_func('begin', function () {
			const me = this;
			/* Begin */
			$(me).find('>ARTICLE.active-step').removeClass('active-step');
			const swap = new window.swap.core.Swap(orderID);
			const swap_exists = APP.SwapHistory.has(orderID);
			
			this.swap = swap;
			$(me).find('[data-target="swap-current-step"]').html(this.swap.flow.state.step);
			$(me).find('[data-target="swap-total-steps"]').html(this.swap.flow.steps.length-1);
			/* Swap logic */
			$(me).find('>ARTICLE[data-step="wait-other-user"]').addClass('active-step');
			/* Swap process info */
			console.log('Append flow view type:'+swap.flow._flowName);
			if (APP.SwapViews[swap.flow._flowName]!==undefined) {
				me.updateView = APP.SwapViews[swap.flow._flowName];
			};
			
			if (!swap_exists) {
				/* History callback */
				$(window).trigger("SWAP>BEGIN", {
					orderID : orderID,
					swap : swap
				} );
			} else {
				$(window).trigger("SWAP>RESTART", {
					orderID : orderID,
					swap : swap
				} );
			};
			const swap_state_update = async function (values) {
				$(window).trigger("SWAP>UPDATE", {
					orderID : orderID,
					status : "RUN",
					swap : swap
				} );
				const step = swap.flow.state.step;
				if (me.prevStep!==step) {
					$(me).find('>ARTICLE.active-step').removeClass('active-step');
					if (step===1) {
						$(me).find('>ARTICLE[data-step="wait-other-user"]').addClass('active-step');
					};
					if ( step + 1 >= swap.flow.steps.length ) {
						$(me).find('>ARTICLE[data-step="finish"]').addClass('active-step');
					} else {
						$(me).find('>ARTICLE[data-step="'+step+'"]').addClass('active-step');
					};
					$(me).find('[data-target="swap-current-step"]').html(step);
				};
				const flow = swap.flow;
				
				me.update_view();
				switch (swap.flow._flowName) {
					case "BTC2ETH":
					case "BTC2NOXON":
					case "BTC2SWAP":
					case "BTC2USDT":
						if ( step === 3 ) {
							if (flow.step === 3 && !flow.isBalanceEnough && !flow.isBalanceFetching) {
								console.log('Not enough money for this swap. Please charge the balance');
								console.log('Your balance: '+flow.balance+' '+swap.sellCurrency);
								console.log('Required balance: '+swap.sellAmount.toNumber()+' '+swap.sellCurrency);
								console.log('Your address: '+swap.flow.myBtcAddress);
								console.log(flow.address);
								console.log('------------------------');
							}
						}
						
						if ( step + 1 === swap.flow.steps.length ) {
							console.log('[FINISHED] tx', swap.flow.state.ethSwapWithdrawTransactionHash);
							let txLinkDom = $(me).find('A[data-target="tx-link"]');
							const txLink = config.link.etherscan+"/tx/"+swap.flow.state.ethSwapWithdrawTransactionHash;
							txLinkDom.attr('href',txLink);
							txLinkDom.html(txLink);
							$(window).trigger("SWAP>FINISHED", {
								orderID : orderID,
								swap : swap
							} );
							if (me.order.isMy) {
								APP.CORE.services.orders.remove(me.order.id);
								$(window).trigger("CORE>ORDERS>REMOVEMY");
							}
						};
						break;;
					case "ETH2BTC":
					case "NOXON2BTC":
					case "SWAP2BTC":
					case "USTD2BTC":
						if ( step + 1 === swap.flow.steps.length ) {
							console.log('[FINISHED] tx', swap.flow.state.btcSwapWithdrawTransactionHash);
							let txLinkDom = $(me).find('A[data-target="tx-link"]');
							const txLink = config.link.bitpay+"/tx/"+swap.flow.state.btcSwapWithdrawTransactionHash;
							txLinkDom.attr('href',txLink);
							txLinkDom.html(txLink);
							$(window).trigger("SWAP>FINISHED", {
								orderID : orderID,
								swap : swap
							} );
							if (me.order.isMy) {
								APP.CORE.services.orders.remove(me.order.id);
								$(window).trigger("CORE>ORDERS>REMOVEMY");
							}
						};
						break;
				};
				$(me).find('[data-target="step-info"]')
					.empty()
					.append(me.updateView());
				initTimerButtons(me);
			};
			if (swap_exists) {
				/* Swap exist - try restart */
				APP.log("Swap for order:"+orderID+" exist. Restart it");
				swap.flow.restartStep();
			};
			swap.on('state update', swap_state_update);
			$(window).trigger("SWAP>UPDATE", {
				orderID : orderID,
				status : "RUN",
				swap : swap
			} );
		});
		view.bind_func('cancelSwap', function () {
			console.log('cancel swap begin');
		} );
		view.setVar('beginStep',accountInfo.getSource());
		/* this is token swap ? if yes - add token balance field */
		if (config.tokens[validOrderData.sellCurrency.toLowerCase()]
			|| config.tokens[validOrderData.buyCurrency.toLowerCase()]
		) {
			let tokenName = (config.tokens[validOrderData.sellCurrency.toLowerCase()]) ? validOrderData.sellCurrency : validOrderData.buyCurrency;
			view.addVar('tokenBalance',tokenBalance.getSource());
			view.setVar('tokenName',tokenName);
		};
		if (!order.isMy) {
			view.setVar('controls',controlsRequest.getSource());
		};
		/* On render dom - init main values */
		view.onRenderDom( function () {
			const me = this;
			const collect_data = async function () {
				const btc_address = APP.Actions.btc.getAddress();
				const btc_amount = await APP.Actions.btc.getBalanceAsync();
				const eth_address = APP.Actions.eth.getAddress();
				const eth_amount = await APP.Actions.eth.getBalanceAsync();
				
				/* this is token swap */
				if (config.tokens[me[0].validOrderData.sellCurrency.toLowerCase()]
					|| config.tokens[me[0].validOrderData.buyCurrency.toLowerCase()]
				) {
					let tokenName = (config.tokens[me[0].validOrderData.sellCurrency.toLowerCase()]) ? 
							me[0].validOrderData.sellCurrency : me[0].validOrderData.buyCurrency;
					me.find('[data-target="user-auth-token-balance"]').html(
						await APP.Actions.token.getBalance(
							config.tokens[tokenName.toLowerCase()].address, 
							tokenName, 
							config.tokens[tokenName.toLowerCase()].decimals
						)
					);
				};
				me.find('[data-target="user-auth-btc-address"]').html(btc_address);
				me.find('[data-target="user-auth-btc-balance"]').html(btc_amount);
				me.find('[data-target="user-auth-eth-address"]').html(eth_address);
				me.find('[data-target="user-auth-eth-balance"]').html(eth_amount);
				/* TODO Is my? may be need swap values */
				me.find('[data-target="order-buy-currency"]').html(
					me[0].validOrderData.buyCurrency
				);
				me.find('[data-target="order-sell-currency"]').html(
					me[0].validOrderData.sellCurrency
				);
				me.find('[data-target="order-buy-amount"]').html(
					me[0].validOrderData.buyAmount.toFixed(5)
				);
				me.find('[data-target="order-sell-amount"]').html(
					me[0].validOrderData.sellAmount.toFixed(5)
				);
				me.find('ARTICLE[data-step="init"]').removeClass('active-step');
				me.find('ARTICLE[data-step="begin"]').addClass('active-step');
				
			};
			collect_data();
			if (order.isMy) {
				me[0].begin();
			}
		} );
		view.bind('ROOT','click', function (e) {
			
			const swap_holder = $(e.target).parents('.swap-holder')[0];
			const $button = (e.target.nodeName==='A') ? $(e.target) : $($(e.target).parents('A')[0]);
			if (!$button.length) return;
			if ($button.data('action')==='re-sell') {
				e.preventDefault();
				let percent = (100+parseInt($button.data('percent'),10))/100;
				const newPrice = Number(swap_holder.swap.sellAmount)/Number(swap_holder.swap.buyAmount)*percent*Number(swap_holder.swap.buyAmount);
				const newRate = Number(swap_holder.swap.sellAmount)/newPrice;
				const newOrderData = {
					buyCurrency: swap_holder.swap.sellCurrency,
					sellCurrency: swap_holder.swap.buyCurrency,
					buyAmount: newPrice,
					sellAmount: Number(swap_holder.swap.buyAmount),
					exchangeRate: newRate,
				};
				APP.log("Create re-sell order +"+percent+"%", newOrderData);
				APP.createOrder( 
					newOrderData.buyCurrency, 
					newOrderData.sellCurrency,
					newOrderData.buyAmount,
					newOrderData.sellAmount,
					newOrderData.exchangeRate
				);
				$(swap_holder).remove();
				return;
			};
			if ($button.data('action')==='submit-secret') {
				e.preventDefault();
				swap_holder.swap.flow.submitSecret(APP.Help.getRandomKey(32));
				return;
			};
			if ($button.data('action')==='sign') {
				e.preventDefault();
				swap_holder.swap.flow.sign();
				return;
			};
			if ($button.data('action')==='add-gas') {
				e.preventDefault();
				const gwei =  new BigNumber(String(swap_holder.swap.flow.ethTokenSwap.gasPrice)).plus(new BigNumber(1e9));
				swap_holder.swap.flow.ethTokenSwap.addGasPrice(gwei);
				swap_holder.swap.flow.restartStep();
				return;
			};
			if ($button.data('action')==='confirm-btc-script') {
				e.preventDefault();
				swap_holder.swap.flow.verifyBtcScript()
				return;
			};
			if ($button.data('action')==='update-balance') {
				e.preventDefault();
				swap_holder.swap.flow.syncBalance();
				return;
			};
			if ($button.data('action')==='try-refund') {
				e.preventDefault();
				swap_holder.swap.flow.tryRefund();
				return;
			};
			if ($button.data('action')==='get-refund-tx-hex') {
				e.preventDefault();
				if (swap_holder.swap.flow.btcScriptValues) {
					swap_holder.swap.flow.getRefundTxHex()
				};
				return;
			};
			if ($button.data('action')==='close-window-silent') {
				e.preventDefault();
				const swap_holder = $(e.target).parents('.swap-holder')[0];
				$(swap_holder).remove();
				return;
			};
			if ($button.data('action')==='close-window') {
				e.preventDefault();
				if (confirm("Cancel swap begin?")) {
					swap_holder.cancelSwap();
					$(swap_holder).remove();
				};
				return;
			};
			if ($button.data('action')==='begin') {
				e.preventDefault();
				if (!order.isMy) {
					$(swap_holder)
						.find('[data-target="controls"]')
						.empty()
						.append(controlsWaitAccept.getDom());
					order.sendRequest((isAccepted) => {
						console.log(`user ${order.owner.peer} ${isAccepted ? 'accepted' : 'declined'} your request`)
						if (!isAccepted) {
							$(swap_holder)
								.find('[data-target="controls"]')
								.empty()
								.append(controlsDeclime.getDom());
						} else {
							swap_holder.begin();
						}
					});
				}
			};
		} );
		
		
		window.testswapview = view;
		return view;
	};
	APP.SwapViews = {};
	/*{#PM-READY#}*/
} );