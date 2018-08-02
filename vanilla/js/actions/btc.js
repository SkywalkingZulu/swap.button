APP.Actions.btc = {
	getBalance : function (callback) {
		const address = APP.CORE.services.auth.accounts.btc.getAddress();
		const url = `${config.api.bitpay}/addr/${address}`;
		$.ajax( {
			type : 'GET',
			url : url,
			complete : function (rv) {
				if (callback instanceof Function) {
					callback(rv.responseJSON.balance);
				}
			}
		} );
	}
}