APP.Swap = function (orderID) {
	console.log("Begin swap",orderID);
	const order = APP.CORE.services.orders.getByKey(orderID);
	const flowType = (order.isMy) ? 
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
	const controlsRequest = APP.Help.getTempl(function () {
		/*
		{#tmpl-begin#}
		<div>
			<a href="#" class="button" data-action="begin">[SEND REQUEST]</a>
		</div>
		<div>
			<a href="#" class="button" data-action="close-window">[CLOSE]</a>
		</div>
		{#tmpl-end#}
		*/
	} );
	const controlsWaitAccept = APP.Help.getTempl(function () {
		/*
		{#tmpl-begin#}
		<div>
			<a href="#" class="button">[WAIT ACCEPT]</a>
		</div>
		<div>
			<a href="#" class="button" data-action="close-window">[CANCEL SWAP]</a>
		</div>
		{#tmpl-end#}
		*/
	} );
	const controlsDeclime = APP.Help.getTempl(function () {
		/*
		{#tmpl-begin#}
		<div>
			<a href="#" class="button" data-action="close-window-silent">[YOUR REQUEST DECLIMED - CLOSE WINDOW]</a>
		</div>
		{#tmpl-end#}
		*/
	} );
	const controlsAccept = APP.Help.getTempl(function () {
		/*
		{#tmpl-begin#}
		<div>
			<a href="#" class="button" data-action="begin">[BEGIN]</a>
		</div>
		<div>
			<a href="#" class="button" data-action="close-window">[CLOSE]</a>
		</div>
		{#tmpl-end#}
		*/
	} );
	/* Check - is token flow? */
	const accountInfo = APP.Help.getTempl(function () {
		/*
		{#tmpl-begin#}
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
		{#tmpl-end#}
		*/
	});
	let view = APP.Help.getTempl(function() {
		/*
		{#tmpl-begin#}
		<section class="swap-holder" data-order-id="{#order.id#}">
			<header>Not implemented view for swap direction 
				<b data-target="swap-current-step">0</b>
				&nbsp;of&nbsp;
				<b data-target="swap-total-steps">0</b>
			</header>
			{#beginStep#}
			<div data-target="step-info"></div>
			<article data-step="finish">
				<div>Ready</div>
				<div>
					<a href="#" class="button" data-action="close-window-silent">[CLOSE]</a>
				</div>
			</article>
		</section>
		{#tmpl-end#}
		*/
	});
	/* View */
	switch (flowType) {
		case "BTC2ETH":
			view = APP.Help.getTempl(function () {
				/*
				{#tmpl-begin#}
				<section class="swap-holder" data-order-id="{#order.id#}">
					<header>BTC to ETH swap 
						<b data-target="swap-current-step">0</b>
						&nbsp;of&nbsp;
						<b data-target="swap-total-steps">0</b>
					</header>
					{#beginStep#}
					<article data-step="2">Step 2</article>
					<article data-step="3">Step 3</article>
					<article data-step="4">Step 4</article>
					<article data-step="5">Step 5</article>
					<article data-step="6">Step 6</article>
					<article data-step="7">Step 7</article>
					<article data-step="8">Step 8</article>
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
				{#tmpl-end#}
				*/
			});
			break;
		case "BTC2NOXON":
			break;
		case "BTC2SWAP":
			break;
		case "ETH2BTC":
			view = APP.Help.getTempl(function () {
				/*
				{#tmpl-begin#}
				<section class="swap-holder" data-order-id="{#order.id#}">
					<header>ETH to BTC swap 
						<b data-target="swap-current-step">0</b>
						&nbsp;of&nbsp;
						<b data-target="swap-total-steps">0</b>
					</header>
					{#beginStep#}
					<article data-step="2">Step 2</article>
					<article data-step="3">Step 3</article>
					<article data-step="4">Step 4</article>
					<article data-step="5">Step 5</article>
					<article data-step="6">Step 6</article>
					<article data-step="7">Step 7</article>
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
				{#tmpl-end#}
				*/
			});
			break;
		case "NOXON2BTC":
			break;
		case "SWAP2BTC":
			break;
	};
	
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
		const swap_state_update = function (values) {
			console.log('swap state update',values);
			const step = swap.flow.state.step;
			if (me.prevStep!==step) {
				$(me).find('>ARTICLE.active-step').removeClass('active-step');
				if (step===1) {
					$(me).find('>ARTICLE[data-step="wait-other-user"]').addClass('active-step');
				};
				if ( step + 1 === swap.flow.steps.length ) {
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
					if ( step === 2 ) {
						swap.flow.submitSecret(APP.Help.getRandomKey(32));
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
					if ( step === 1 ) swap.flow.sign();
					if ( step === 3 ) swap.flow.verifyBtcScript();

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

	view.bind('ROOT','click', function (e) {
		
		const swap_holder = $(e.target).parents('.swap-holder')[0];
		if (e.target===$(swap_holder).find('A.button[data-action="close-window-silent"]')[0]) {
			e.preventDefault();
			const swap_holder = $(e.target).parents('.swap-holder')[0];
			$(swap_holder).remove();
			return;
		};
		if (e.target===$(swap_holder).find('A.button[data-action="close-window"]')[0]) {
			e.preventDefault();
			if (confirm("Cancel swap begin?")) {
				swap_holder.cancelSwap();
				$(swap_holder).remove();
			};
			return;
		};
		if (e.target===$(swap_holder).find('A.button[data-action="begin"]')[0]) {
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
	
	/* Swap process info */
	if (APP.SwapViews[flowType]!==undefined) {
		view.bind_func('updateView', APP.SwapViews[flowType]);
	};
	window.testswapview = view;
	return view;
};
APP.SwapViews = {};