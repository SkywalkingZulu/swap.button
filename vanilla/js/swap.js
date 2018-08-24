APP.Swap = function (orderID) {
	console.log("Begin swap",orderID);
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
	console.log('valid order data',validOrderData);
	console.log("Flow type:"+flowType);
	
	const until = (_step, swap) =>
		new Promise(resolve => {
			setInterval(
				() => ( swap.flow.state.step >= _step )
				? resolve() : null,
			500)

			swap.on('enter step', (step) => ( step >= _step ) ? resolve() : null)
		});
	  
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
			<div data-target="controls">
				{#controls#}
			</div>
		</article>
		<article data-step="wait-other-user">
			<div>Wait other user press &quot;Begin&quot;</div>
		</article>
		***/
	});
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
	
	view.bind_func('update_view', function () {
		console.log('update swap view');
	} );
	view.bind_func('updateView', function () { return ''; } );
	
	
	view.bind_func('begin', function () {
		const me = this;
		/* Begin */
		$(me).find('>ARTICLE.active-step').removeClass('active-step');
		const swap = new window.swap.core.Swap(orderID);
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
		
		const swap_state_update = async function (values) {
			console.log('swap state update',values);
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
			console.log('enter step',swap.flow._flowName, step)
			const flow = swap.flow;
			
			console.log(swap);
			me.update_view();
			switch (swap.flow._flowName) {
				case "BTC2ETH":
				case "BTC2NOXON":
				case "BTC2SWAP":
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
					
					if ( step == 2 ) {
						console.info('BTC2ETH Step 2');
						console.info(swap.flow.state.isParticipantSigned);
						console.info(swap.flow.state.secretHash);
						
						//swap.flow.submitSecret(APP.Help.getRandomKey(32));
					};
					
					if ( step + 1 === swap.flow.steps.length ) {
						console.log('[FINISHED] tx', swap.flow.state.ethSwapWithdrawTransactionHash);
						let txLinkDom = $(me).find('A[data-target="tx-link"]');
						const txLink = config.link.etherscan+"/tx/"+swap.flow.state.ethSwapWithdrawTransactionHash;
						txLinkDom.attr('href',txLink);
						txLinkDom.html(txLink);
						if (me.order.isMy) {
							APP.CORE.services.orders.remove(me.order.id);
							$(window).trigger("CORE>ORDERS>REMOVEMY");
						}
					};
					break;;
				case "ETH2BTC":
				case "NOXON2BTC":
				case "SWAP2BTC":
					//if ( step == 1 ) swap.flow.sign();
					//if ( step == 3 ) swap.flow.verifyBtcScript();
					if ( step + 1 === swap.flow.steps.length ) {
						console.log('[FINISHED] tx', swap.flow.state.btcSwapWithdrawTransactionHash);
						let txLinkDom = $(me).find('A[data-target="tx-link"]');
						const txLink = config.link.bitpay+"/tx/"+swap.flow.state.btcSwapWithdrawTransactionHash;
						txLinkDom.attr('href',txLink);
						txLinkDom.html(txLink);
						
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
		};
		swap.on('state update', swap_state_update);
	});
	view.bind_func('cancelSwap', function () {
		console.log('cancel swap begin');
	} );
	view.setVar('beginStep',accountInfo.getSource());
	if (!order.isMy) {
		view.setVar('controls',controlsRequest.getSource());
	};
	/* On render dom - init main values */
	view.onRenderDom( function () {
		const me = this;
		console.log('on render',me);
		const collect_data = async function () {
			const btc_address = APP.Actions.btc.getAddress();
			const btc_amount = await APP.Actions.btc.getBalanceAsync();
			const eth_address = APP.Actions.eth.getAddress();
			const eth_amount = await APP.Actions.eth.getBalanceAsync();
			
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
	const signSwap = function (swap_holder) {
		swap_holder.swap.flow.sign();
	};
	view.bind('ROOT','click', function (e) {
		
		const swap_holder = $(e.target).parents('.swap-holder')[0];
		const $button = (e.target.nodeName==='A') ? $(e.target) : $($(e.target).parents('A')[0]);
		if (!$button.length) return;
		if ($button.data('action')==='submit-secret') {
			console.log("ACTION:submit-secret");
			e.preventDefault();
			//await until(2, swap_holder.swap);
			swap_holder.swap.flow.submitSecret(APP.Help.getRandomKey(32));
			//await until(3, swap_holder.swap);
			return;
		};
		if ($button.data('action')==='sign') {
			console.log("ACTION:sign");
			console.log("isMeSigned: "+swap_holder.swap.flow.state.isMeSigned);
			e.preventDefault();
			signSwap(swap_holder);
			return;
		};
		if ($button.data('action')==='confirm-btc-script') {
			console.log("ACTION:confirm-btc-script");
			e.preventDefault();
			//await until(3, swap_holder.swap)
			swap_holder.swap.flow.verifyBtcScript()
			//await until(4, swap_holder.swap)
			return;
		};
		if ($button.data('action')==='update-balance') {
			console.log("ACTION:update-balance");
			e.preventDefault();
			//await until(3, swap_holder.swap)
			swap_holder.swap.flow.syncBalance();
			//await until(4, swap_holder.swap)
			return;
		};
		if ($button.data('action')==='try-refund') {
			console.log("ACTION:try-refund");
			e.preventDefault();
			swap_holder.swap.flow.tryRefund();
			return;
		};
		if ($button.data('action')==='get-refund-tx-hex') {
			console.log("ACTION:get-refund-tx-hex");
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
						console.log('Request not accepted');
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