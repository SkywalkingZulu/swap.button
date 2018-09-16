PM.depend( [ 
	'js/app'
] , () => {
	/*  урс токенов */
	const tokensRates = {
		SWAP : 1000
	};
	APP.AfterInitCall( () => {
		APP.CORE.services.room.on( 'bot.request.createOrder' , function (data) {
			/* ѕришол запрос - создаем ордер и передаем его данные пользователю */
			if ((tokensRates[data.currency]===undefined)) {
				/* такие токены не продаем */
				APP.CORE.services.room.sendMessagePeer(
					data.fromPeer,
					{
						event : 'bot.request.declime',
						data : {
							message : 'not supported currency'
						}
					}
				);
				return;
			};
			/* ѕроверим, если ли у бота такое количество токенов */
			if (false) {
				APP.CORE.services.room.sendMessagePeer(
					data.fromPeer,
					{
						event : 'bot.request.declime',
						data : {
							message : 'no token yet',
							amount: 1000			/* —колько есть в наличии у бота */
						}
					}
				);
			};
			let btcAmount = data.amount / tokensRates[data.currency];
			/*
			—оздаем ордер и передаем его айди пользователю
				P.S. ¬ боте нужно запоминать их и удал€ть по истечению таймаута
			*/
			const orderForUser = APP.createOrder( 
				"BTC", 
				data.currency,
				btcAmount, 
				data.amount, 
				tokensRates[data.currency]
			);
			/*
				ќрдер создали - отправл€ем его данные пользователю
			*/
			console.log(orderForUser);
			APP.CORE.services.room.sendMessagePeer(
				data.fromPeer,
				{
					event : 'bot.request.accept',
					data : {
						orderID : orderForUser.id
					}
				}
			);
			console.log('request buy order create');
			console.log(data);
			console.log(btcAmount);
		} );			
	} );
	/*{#PM-READY#}*/
} );