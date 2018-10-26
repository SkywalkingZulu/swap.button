/*
	Кнопка запроса токенов на покупку
	- Пользователь выбирает вид токена (или берется из конфигурации config.filter.buy )
	- Указывает количество нужных токенов
	- Боту отправляется запрос на расчет стоимости покупки
	- Пользователь подтверждает обмен
	- Боту передается запрос на создание ордера
	- Бот создает ордер и передает айди ордера пользователю
	- Пользователь отправляет запрос на обмен по полученому айди
	- Бот принимает обмен
	- ....
*/
PM.depend( [ 
	'js/app',
	'js/help.templ',
	'js/ui.timerbutton'
] , () => {
	
	
	APP.AfterInitCall( () => {
		/*** templates ***/
		const buyForm = APP.Help.getTempl( () => {
			/***
			<section class="-request-buy-form">
				<header>
					<h1>Buy token</h1>
				</header>
				<article class="-request-calc" data-step="1">
					<header>
						<h2>(1 of 3) Input amount for calculate price</h2>
					</header>
					<div>
						<label>Buy Token:</label>
						{#buyTokenControl#}
					</div>
					<div>
						<label>Amount:</label>
						<input type="text" data-target="amount" />
					</div>
					<div>
						<label>Your wallet for tokens:</label>
						<input type="text" data-target="wallet" />
					</div>
					<div>
						<a href="#" class="button" data-action="request-buy-token">Calc price</a>
					</div>
				</article>
				<article class="-request-calc-wait" data-step="2">
					<header>
						<h2>(2 of 3) Confirm order</h2>
						<div>Please wait for calculate price</div>
					</header>
				</article>
				<article data-step="not-supported-token">
					<header>
						<h2>(2 of 3) Confirm order - error</h2>
						<div>Your request declimed - not supported currency</div>
						<div><a href="#" data-action="retry-step" data-step="1">Retry</a></div>
					</header>
				</article>
				<article data-step="no-token-yet">
					<header>
						<h2>(2 of 3) Confirm order - error</h2>
						<div>There is not enough number of tokens</div>
						<div><a href="#" data-action="retry-step" data-step="1">Retry</a></div>
					</header>
				</article>
        <article class="-request-incoming" data-step="3.1">
          <header>
            <h2>(2 of 3) Confirm profitable order</h2>
          </header>
          <div>
						You want buy 
						<strong data-target="buy-amount"></strong>
						<strong data-target="buy-currency"></strong>
					</div>
          <div>
						Target eth wallet for tokens:
						<strong data-target="buy-wallet"></strong>
					</div>
          <div class="-wait-incoming-order"><b>Waiting incoming orders</b></div>
          <ul class="-incoming-orders">
          </ul>
        </article>
				<article class="-request-confirm" data-step="3">
					<header>
						<h2>(2 of 3) Confirm order</h2>
					</header>
					<div>
						You want buy 
						<strong data-target="buy-amount"></strong>
						<strong data-target="buy-currency"></strong>
					</div>
					<div>
						Your order cost 
						<strong data-target="sell-amount"></strong>
						<strong data-target="sell-currency"></strong>
					</div>
					<div>
						Target eth wallet for tokens:
						<strong data-target="buy-wallet"></strong>
					</div>
					<div>
						<a href="#" data-action="accept-bot-order">Accept order</a>
					</div>
				</article>
				<article class="-request-wait" data-step="4">
					<header>
						<h2>(3 of 3) Wait for confirmation of your order</h2>
					</header>
					<div>Wait...</div>
				</article>
				<article class="-request-swap" data-step="swap">
					<header>
						<h2>(3 of 3) Swap process</h2>
					</header>
					<div data-target="swap-process">
					</div>
				</article>
			</section>
			***/
		} );
    const incomingOrderTemp = APP.Help.getTempl( () => {
      /***
      <li data-order-id="{#order.id#}" data-fixed-price="{#order.buyAmountFixed#}">
        <div>Order ID:<b>{#order.id#}</b></div>
        <div>Seller: <b>{#order.owner.eth.address#}</b></div>
        <div>Price: <b>{#order.buyAmountFixed#}</b></div>
        <div><a href="#" class="-button" data-action="accept-incoming-order" data-id="{#order.id#}">Accept order</a></div>
      </li>
      ***/
    } );
		const tokenControlSelect = APP.Help.getTempl( () => {
			/***
			<select data-target="currency">{#tokens#}</select>
			***/
		} );
		const tokenControlSelectItem = APP.Help.getTempl( () => {
			/***
			<option value="{#token.key#}">{#token.name#}</option>
			***/
		} );
		const tokenControlOne = APP.Help.getTempl( () => {
			/***
			<strong>{#token.name#}</strong>
			<input type="hidden" data-target="currency" value="{#token.key#}" />
			***/
		} );
		/*** ---- main logic ---- ***/
		(() => {
			/*** --- простая проверка на входные данные ***/
			if ((config.filter.buy.indexOf('ALL')!==-1)
				|| (
					(config.filter.buy.length===1)
					&& (config.filter.buy.indexOf('ETH')===-1)
					&& (config.filter.buy.indexOf('BTC')===-1)
				)
			) {
				/*** ---- init templates ---- ***/
				buyForm.reset();
				let buyFormDom = null;
				/* Выбор нескольких токенов на покупку или только один? */
				if ((config.filter.buy.length===1)
					&& (config.filter.buy.indexOf('ETH')===-1)
					&& (config.filter.buy.indexOf('BTC')===-1)
					&& (config.tokens[config.filter.buy[0].toLowerCase()]!==undefined)
				) {
					/* один токен */
					buyForm.addVar( 'buyTokenControl', 
						tokenControlOne
							.reset()
							.setObject( 'token', {
								key : config.filter.buy[0],
								name : config.filter.buy[0]
							} )
							.getPlain()
					);
				} else {
					/* Несколько видов токенов на выбор */
					tokenControlSelect.reset();
					const thisIsAll = (config.filter.buy[0]==='ALL') ? true : false;
					tokenControlSelect.addVar('tokens', 
						tokenControlSelectItem
							.reset()
							.setObject( 'token', {
								key : '',
								name : 'Select to for buy'
							} )
							.getPlain()
					);
					$.each( (thisIsAll) ? config.tokens : config.filter.buy, function (i,token) {
						tokenControlSelect.addVar('tokens',
							tokenControlSelectItem
								.reset()
								.setObject( 'token', {
									key : (thisIsAll) ? i.toUpperCase() : token,
									name : (thisIsAll) ? i.toUpperCase() : token
								} )
								.getPlain()
						);
					} );
					buyForm.addVar( 'buyTokenControl', tokenControlSelect.getPlain() );
				};
				
				buyForm.bind_func('goToStep', function (step) {
					$(this).find('ARTICLE').hide()
					$(this).find('ARTICLE[data-step="'+step+'"]').show();
				} );
				buyForm.onRenderDom( function () {
					const _this = this[0];
					/* Обработка отказа */
					APP.CORE.services.room.on( 'bot.request.declime' , function (data) {
						switch (data.message) {
							case 'not supported currency':
								_this.goToStep('not-supported-token');
								break;
							case 'no token yet':
								_this.goToStep('no-token-yet');
								break;
						}
					} );
          /* Обработка сформированого ордера - много-ордерность */
          APP.CORE.services.room.on( 'bot.request.incoming', function (data) {
            console.log('Bot incoming order');
            const orderData = APP.CORE.services.orders.getByKey( data.orderID );
						console.log(orderData);
            orderData.buyAmountFixed = orderData.buyAmount.toFixed(5);
            const orderSortPosition = orderData.buyAmountFixed;
            
            $(_this).find('.-wait-incoming-order').hide();
            const orderDom = incomingOrderTemp
              .reset()
              .setObject( 'order', orderData )
              .getDom();
              
            let orderRendered = false;
            let appendBefore = null;
            $.each($(_this).find('.-incoming-orders>LI'), function (i,li) {
              if (orderSortPosition<parseFloat($(li).data('fixed-price'))) {
                appendBefore = $(li);
                orderRendered = true;
              }
            } );
            if (!orderRendered) {
              $(_this).find('.-incoming-orders').append( orderDom );
            } else {
              appendBefore.before( orderDom );
            }
          } );
				} );
				
				buyForm.bind('[data-action="retry-step"]','click', function (e) {
					e.preventDefault();
					buyFormDom[0].goToStep($(e.target).data('step'));
				} );
        
				buyForm.bind_func('beginSwap', function () {
					
					const swap = new window.swap.core.Swap(buyFormDom[0].botOrderData.id);
					
					swap.flow.allowFundBTCDirectly = true;
          //swap.flow.noGasMode_Send();
					buyFormDom[0].swap = swap;
					buyFormDom[0].swap.flow.setEthAddress(buyFormDom[0].targetWallet);
					buyFormDom[0].no_resell = true;
					let swapViewRenderer = null;
					if (APP.SwapViews[swap.flow._flowName]!==undefined) {
						swapViewRenderer = APP.SwapViews[swap.flow._flowName];
					};
					
					const swap_state_update = async function (values) {
						
						const step = swap.flow.state.step;

						const flow = swap.flow;
						
						
						if (APP.Swap_btcDirections.indexOf(swap.flow._flowName)!==-1) {
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
								
								const txLink = config.link.etherscan+"/tx/"+swap.flow.state.ethSwapWithdrawTransactionHash;
								console.log(txLink);
								
							};
						};
						if (APP.Swap_ethDirections.indexOf(swap.flow._flowName)!==-1) {
							if ( step + 1 === swap.flow.steps.length ) {
								console.log('[FINISHED] tx', swap.flow.state.btcSwapWithdrawTransactionHash);
								
								const txLink = config.link.bitpay+"/tx/"+swap.flow.state.btcSwapWithdrawTransactionHash;
								console.log(txLink);
							};
						};
						if (swapViewRenderer instanceof Function) {
							buyFormDom.find('[data-target="swap-process"]')
								.empty()
								.append(swapViewRenderer.bind(buyFormDom[0]).call());
						};
						APP.UI.initTimerButtons(buyFormDom);
					};
					
					swap.on('state update', swap_state_update);
				} );
				buyForm.bind('[data-action="request-buy-token"]','click', function (e) {
					e.preventDefault();
					const currency = buyFormDom.find('[data-target="currency"]').val();
					const amount = buyFormDom.find('[data-target="amount"]').val();
					const wallet = buyFormDom.find('[data-target="wallet"]').val();
					
					if (currency==="") {
						alert("Please select token");
						return;
					};
					try {
						let testAmount = parseInt(amount,10);
						if (testAmount!=amount) {
							alert("Amount must be a whole number");
							return;
						}
					} catch (e) {
						alert("Amount must be a whole number");
					};
          
          if (wallet==="") {
            alert("Enter wallet");
            return;
          }
          
          buyFormDom.find('[data-target="buy-amount"]').html(amount);
          buyFormDom.find('[data-target="buy-currency"]').html(currency);
          buyFormDom.find('[data-target="buy-wallet"]').html(wallet);
          
					buyFormDom[0].goToStep(3.1);
					buyFormDom[0].targetWallet = wallet;
					/* send request to bot */
					APP.CORE.services.room.sendMessageRoom( { 
						event : 'bot.request.createOrder', 
						data : { 
							currency : currency, 
							amount : amount,
							wallet : wallet
						} 
					} );
          
					console.log("buy request",currency,amount);
				} );
				
				/* click events */
				buyForm.bind('ROOT','click', function (e) {
			
					const swap_holder = buyFormDom[0];
					const $button = (e.target.nodeName==='A') ? $(e.target) : $($(e.target).parents('A')[0]);
					if (!$button.length) return;
          if ($button.data('action')==='accept-incoming-order') {
            e.preventDefault();
            const orderData = APP.CORE.services.orders.getByKey( $(e.target).data('id') );
            if (orderData) {
              buyFormDom[0].botOrderData = orderData;
              buyFormDom[0].goToStep(4);
              buyFormDom[0].botOrderData.sendRequest((isAccepted) => {
                if (!isAccepted) {
                  /* hmmm */
                } else {
                  buyFormDom[0].goToStep("swap");
                  buyFormDom[0].beginSwap();
                }
              });
            }
            return;
          };
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
						$(window).trigger("CORE>ORDERS>CREATE");
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
					if ($button.data('action')==='check-script-balance') {
						e.preventDefault();
						swap_holder.swap.flow.checkScriptBalance();
					}
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
					
				} );
				buyFormDom = buyForm.getDom();
				buyFormDom[0].no_resell = true;
				window.testBuyForm = buyFormDom;
				$('BODY').append( buyFormDom );
				buyFormDom[0].goToStep(1);
			} else {
				/*** .... ***/
			}
		} )();
	} );
	/*{#PM-READY#}*/
} );