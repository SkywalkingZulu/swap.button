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
	'js/help.templ'
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
						<a href="#" data-action="accept-bot-order">Accept order</a>
					</div>
				</article>
				<article class="-request-wait" data-step="4">
					<header>
						<h2>(3 of 3) Wait for confirmation of your order</h2>
					</header>
					<div>Wait...</div>
				</article>
			</section>
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
					/* Обработка принятия запроса */
					APP.CORE.services.room.on( 'bot.request.accept' , function (data) {
						console.log('Bot accept request');
						console.log(data);
						const orderData = APP.CORE.services.orders.getByKey( data.orderID );
						console.log(orderData);
						$(_this).find('[data-target="sell-amount"]').html(orderData.buyAmount.toFixed(5));
						$(_this).find('[data-target="sell-currency"]').html(orderData.buyCurrency);
						$(_this).find('[data-target="buy-amount"]').html(orderData.sellAmount.toFixed(5));
						$(_this).find('[data-target="buy-currency"]').html(orderData.sellCurrency);
						_this.botOrderData = orderData;
						_this.goToStep(3);
					} );
				} );
				buyForm.bind('[data-action="accept-bot-order"]','click', function (e) {
					/* Accept request */
					const result = APP.Swap(buyFormDom[0].botOrderData.id);
					const swapDom = result.getDom();
					$('#active-swaps').append(swapDom);
					buyFormDom.remove();
				} );
				buyForm.bind('[data-action="retry-step"]','click', function (e) {
					e.preventDefault();
					buyFormDom[0].goToStep($(e.target).data('step'));
				} );
				buyForm.bind('[data-action="request-buy-token"]','click', function (e) {
					e.preventDefault();
					let currency = buyFormDom.find('[data-target="currency"]').val();
					let amount = buyFormDom.find('[data-target="amount"]').val();
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
					buyFormDom[0].goToStep(2);
					/* send request to bot */
					APP.CORE.services.room.sendMessageRoom( { 
						event : 'bot.request.createOrder', 
						data : { 
							currency : currency, 
							amount : amount 
						} 
					} );
					console.log("buy request",currency,amount);
				} );
				buyFormDom = buyForm.getDom();
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