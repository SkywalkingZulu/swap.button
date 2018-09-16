PM.depend( [ 
	'js/app'
] , () => {
	/* ���� ������� */
	const tokensRates = {
		SWAP : 1000
	};
	APP.AfterInitCall( () => {
		APP.CORE.services.room.on( 'bot.request.createOrder' , function (data) {
			/* ������ ������ - ������� ����� � �������� ��� ������ ������������ */
			if ((tokensRates[data.currency]===undefined)) {
				/* ����� ������ �� ������� */
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
			/* ��������, ���� �� � ���� ����� ���������� ������� */
			if (false) {
				APP.CORE.services.room.sendMessagePeer(
					data.fromPeer,
					{
						event : 'bot.request.declime',
						data : {
							message : 'no token yet',
							amount: 1000			/* ������� ���� � ������� � ���� */
						}
					}
				);
			};
			let btcAmount = data.amount / tokensRates[data.currency];
			/*
			������� ����� � �������� ��� ���� ������������
				P.S. � ���� ����� ���������� �� � ������� �� ��������� ��������
			*/
			const orderForUser = APP.createOrder( 
				"BTC", 
				data.currency,
				btcAmount, 
				data.amount, 
				tokensRates[data.currency]
			);
			/*
				����� ������� - ���������� ��� ������ ������������
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