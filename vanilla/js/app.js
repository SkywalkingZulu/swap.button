const APP = {};
APP.log = console.log;
const localClear = localStorage.clear.bind(localStorage);

PM.depend([
	"js/swap.core"
], function () {
	/* configuration load */
	console.info("Swap.Core loaded - init main configuration");
	let config_file = "js/config";
	let cfg_params = [
		["ALL"],	/* buy */
		["ALL"],	/* sell */
		1,			/* style */
		"debug",	/* network */
		1			/* debug panel */
	];
	/* Init filter and other params from generator */
	if (document.location.search) {
		try {
			cfg_params = document.location.search.split("?")[1];
			cfg_params = JSON.parse(decodeURIComponent(cfg_params));
			if ((cfg_params instanceof Array) 
				&& (cfg_params.length==5)
				&& (cfg_params[0] instanceof Array)
				&& (cfg_params[0].length>0)
				&& (cfg_params[1] instanceof Array)
				&& (cfg_params[1].length>0)
			) {
				
				if (cfg_params[3]=='testnet') {
					config_file = "js/config.testnet";
				};
				if (cfg_params[3]=='mainnet') {
					config_file = "js/config.mainnet";
				};
				if (cfg_params[3].indexOf("custom.")!==false) {
					config_file = "js/config."+cfg_params[3];
				}
			}
		} catch (e) {
			console.log(e);
		}
	};
	console.info("Use configuration "+config_file);
	PM.depend( config_file, function () {
		
		config.filter.buy = cfg_params[0];
		config.filter.sell = cfg_params[1];
		
		APP._p = {};
		APP._p.DependWorkModules = [
			"js/help.templ",
			"js/actions",
			"js/swap",
			"js/swap.views",
			"js/swap.history"
		];
		APP._p.AfterInitFuncs = [];
		APP._p.AppIsInitedAndStarted = false;
		APP.AfterInitCall = function (func) {
			if (APP._p.AppIsInitedAndStarted) {
				if (func instanceof Function) {
					func();
				}
			} else {
				APP._p.AfterInitFuncs.push(func);
			}
		}
		APP._p.getKeys = function(obj) {
			if (obj instanceof Object) {
				var _ret = [];
				for(var k in obj) {
					_ret.push(k);
				};
				return _ret;
			};
			return [];
		};
		APP.Keys = {};
		APP.Keys.BTCPrivateKey = config.network+':btc:PrivateKey';
		APP.Keys.ETHPrivateKey = config.network+':eth:PrivateKey';
		
		window.clear = localStorage.clear = () => {
			const testnetEthPrivateKey = localStorage.getItem('testnet:eth:PrivateKey')
			const testnetBtcPrivateKey = localStorage.getItem('testnet:btc:PrivateKey')
			const mainnetEthPrivateKey = localStorage.getItem('mainnet:eth:PrivateKey')
			const mainnetBtcPrivateKey = localStorage.getItem('mainnet:btc:PrivateKey')

			localClear()

			localStorage.getItem('testnet:eth:PrivateKey', testnetEthPrivateKey)
			localStorage.getItem('testnet:btc:PrivateKey', testnetBtcPrivateKey)
			localStorage.getItem('mainnet:eth:PrivateKey', mainnetEthPrivateKey)
			localStorage.getItem('mainnet:btc:PrivateKey', mainnetBtcPrivateKey)
		};
		if (!localStorage.getItem(config.network+":eth:PrivateKey")) {
			localStorage.setItem(config.network+":eth:PrivateKey","0xe8e73c3f411bce5ea0fe7fdd5da0b456488aa763f4bc638ca5f4a7d5ff55c01f");
		};
		if (!localStorage.getItem(config.network+":btc:PrivateKey")) {
			if (config.network==="testnet") {
				localStorage.setItem(config.network+":btc:PrivateKey","cTD1xQMqG19968ZLetmHb9NJr5oaJBotbcRwvcaYZuJThvYEDEr9");
			} else {
				localStorage.setItem(config.network+":btc:PrivateKey","L4oYfTEKWpACTXJy6yWv4fUK6maH4o3vgUiyTrxaoimvyUa9QK5r");
			}
		};

		// Init Swap Core ------------------------------------------------------ /
		APP.Start = function () {
			console.info("Load depend modules");
			PM.depend(APP._p.DependWorkModules, function () {
				console.info("Init Swap.Core");
				window._web3 = new Web3(
					new Web3.providers.HttpProvider(
						config.services.web3.provider
						)
					);
				console.log('Web3 inited');
				/* Initial swaps */
				const swaps = [
					new window.swap.core.swaps.EthSwap({
						address: config.eth.contract,
						gasLimit: 1e5,
						abi: [{ 'constant':false, 'inputs':[{ 'name':'val', 'type':'uint256' }], 'name':'testnetWithdrawn', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_secret', 'type':'bytes32' }, { 'name':'_ownerAddress', 'type':'address' }], 'name':'withdraw', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'_participantAddress', 'type':'address' }], 'name':'getSecret', 'outputs':[{ 'name':'', 'type':'bytes32' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'', 'type':'address' }, { 'name':'', 'type':'address' }], 'name':'participantSigns', 'outputs':[{ 'name':'', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'owner', 'outputs':[{ 'name':'', 'type':'address' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'', 'type':'address' }, { 'name':'', 'type':'address' }], 'name':'swaps', 'outputs':[{ 'name':'secret', 'type':'bytes32' }, { 'name':'secretHash', 'type':'bytes20' }, { 'name':'createdAt', 'type':'uint256' }, { 'name':'balance', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_secretHash', 'type':'bytes20' }, { 'name':'_participantAddress', 'type':'address' }], 'name':'createSwap', 'outputs':[], 'payable':true, 'stateMutability':'payable', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'ratingContractAddress', 'outputs':[{ 'name':'', 'type':'address' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'_ownerAddress', 'type':'address' }], 'name':'getBalance', 'outputs':[{ 'name':'', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_participantAddress', 'type':'address' }], 'name':'refund', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'constructor' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'name':'createdAt', 'type':'uint256' }], 'name':'CreateSwap', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'name':'_secret', 'type':'bytes32' }, { 'indexed':false, 'name':'addr', 'type':'address' }, { 'indexed':false, 'name':'amount', 'type':'uint256' }], 'name':'Withdraw', 'type':'event' }, { 'anonymous':false, 'inputs':[], 'name':'Close', 'type':'event' }, { 'anonymous':false, 'inputs':[], 'name':'Refund', 'type':'event' }],
						fetchBalance: (address) => APP.Actions.eth.fetchBalanceAsync(address),
					}),
					new window.swap.core.swaps.BtcSwap({
						fetchBalance: (address) => APP.Actions.btc.fetchBalanceAsync(address),
						fetchUnspents: (scriptAddress) => APP.Actions.btc.fetchUnspentsAsync(scriptAddress),
						broadcastTx: (txRaw) => APP.Actions.btc.broadcastTxAsync(txRaw),
					})
				];
				/* Initial flows */
				const flows = [
					window.swap.core.flows.ETH2BTC,
					window.swap.core.flows.BTC2ETH
				];
				/* Add swaps and flows from config for tokens */
				for (let tokenName in config.tokens) {
					if (config.tokens[tokenName].erc20) {
						/* auto add this token to core */
						window.swap.core.constants.COINS[tokenName] = tokenName.toUpperCase();
					};
					if (window.swap.core.constants.COINS[tokenName]!==undefined) {
						
						/* swap */
						swaps.push(
							new window.swap.core.swaps.EthTokenSwap({
								name: window.swap.core.constants.COINS[tokenName],
								address: (config.tokens[tokenName].contract!==undefined) ? config.tokens[tokenName].contract : config.token.contract,
								decimals: config.tokens[tokenName].decimals,
								abi: [{ 'constant':false, 'inputs':[{ 'name':'_secret', 'type':'bytes32' }, { 'name':'_ownerAddress', 'type':'address' }], 'name':'withdraw', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'_participantAddress', 'type':'address' }], 'name':'getSecret', 'outputs':[{ 'name':'', 'type':'bytes32' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_ratingContractAddress', 'type':'address' }], 'name':'setReputationAddress', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'', 'type':'address' }, { 'name':'', 'type':'address' }], 'name':'participantSigns', 'outputs':[{ 'name':'', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'owner', 'outputs':[{ 'name':'', 'type':'address' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_ownerAddress', 'type':'address' }], 'name':'abort', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'', 'type':'address' }, { 'name':'', 'type':'address' }], 'name':'swaps', 'outputs':[{ 'name':'token', 'type':'address' }, { 'name':'secret', 'type':'bytes32' }, { 'name':'secretHash', 'type':'bytes20' }, { 'name':'createdAt', 'type':'uint256' }, { 'name':'balance', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_secretHash', 'type':'bytes20' }, { 'name':'_participantAddress', 'type':'address' }, { 'name':'_value', 'type':'uint256' }, { 'name':'_token', 'type':'address' }], 'name':'createSwap', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'_ownerAddress', 'type':'address' }], 'name':'checkSign', 'outputs':[{ 'name':'', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_participantAddress', 'type':'address' }], 'name':'close', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'ratingContractAddress', 'outputs':[{ 'name':'', 'type':'address' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_participantAddress', 'type':'address' }], 'name':'sign', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'_ownerAddress', 'type':'address' }], 'name':'getBalance', 'outputs':[{ 'name':'', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_participantAddress', 'type':'address' }], 'name':'refund', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'constructor' }, { 'anonymous':false, 'inputs':[], 'name':'Sign', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'name':'createdAt', 'type':'uint256' }], 'name':'CreateSwap', 'type':'event' }, { 'anonymous':false, 'inputs':[], 'name':'Withdraw', 'type':'event' }, { 'anonymous':false, 'inputs':[], 'name':'Close', 'type':'event' }, { 'anonymous':false, 'inputs':[], 'name':'Refund', 'type':'event' }, { 'anonymous':false, 'inputs':[], 'name':'Abort', 'type':'event' }],
								tokenAddress: config.tokens[tokenName].address,
								tokenAbi: [{ 'constant':true, 'inputs':[], 'name':'name', 'outputs':[{ 'name':'', 'type':'string' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_spender', 'type':'address' }, { 'name':'_amount', 'type':'uint256' }], 'name':'approve', 'outputs':[{ 'name':'success', 'type':'bool' }], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'totalSupply', 'outputs':[{ 'name':'', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_from', 'type':'address' }, { 'name':'_to', 'type':'address' }, { 'name':'_amount', 'type':'uint256' }], 'name':'transferFrom', 'outputs':[{ 'name':'success', 'type':'bool' }], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':false, 'inputs':[], 'name':'getBurnPrice', 'outputs':[{ 'name':'', 'type':'uint256' }], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'decimals', 'outputs':[{ 'name':'', 'type':'uint8' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'manager', 'outputs':[{ 'name':'', 'type':'address' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[], 'name':'unlockEmission', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'_owner', 'type':'address' }], 'name':'balanceOf', 'outputs':[{ 'name':'balance', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'emissionlocked', 'outputs':[{ 'name':'', 'type':'bool' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[], 'name':'acceptOwnership', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':false, 'inputs':[], 'name':'lockEmission', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'owner', 'outputs':[{ 'name':'', 'type':'address' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'symbol', 'outputs':[{ 'name':'', 'type':'string' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[], 'name':'burnAll', 'outputs':[{ 'name':'', 'type':'bool' }], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_newManager', 'type':'address' }], 'name':'changeManager', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_newOwner', 'type':'address' }], 'name':'changeOwner', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'_to', 'type':'address' }, { 'name':'_amount', 'type':'uint256' }], 'name':'transfer', 'outputs':[{ 'name':'success', 'type':'bool' }], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'emissionPrice', 'outputs':[{ 'name':'', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[], 'name':'addToReserve', 'outputs':[{ 'name':'', 'type':'bool' }], 'payable':true, 'stateMutability':'payable', 'type':'function' }, { 'constant':true, 'inputs':[], 'name':'burnPrice', 'outputs':[{ 'name':'', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[{ 'name':'tokenAddress', 'type':'address' }, { 'name':'amount', 'type':'uint256' }], 'name':'transferAnyERC20Token', 'outputs':[{ 'name':'success', 'type':'bool' }], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'constant':true, 'inputs':[{ 'name':'_owner', 'type':'address' }, { 'name':'_spender', 'type':'address' }], 'name':'allowance', 'outputs':[{ 'name':'remaining', 'type':'uint256' }], 'payable':false, 'stateMutability':'view', 'type':'function' }, { 'constant':false, 'inputs':[], 'name':'NoxonInit', 'outputs':[{ 'name':'', 'type':'bool' }], 'payable':true, 'stateMutability':'payable', 'type':'function' }, { 'constant':false, 'inputs':[], 'name':'acceptManagership', 'outputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[], 'payable':false, 'stateMutability':'nonpayable', 'type':'constructor' }, { 'payable':true, 'stateMutability':'payable', 'type':'fallback' }, { 'anonymous':false, 'inputs':[{ 'indexed':true, 'name':'buyer', 'type':'address' }, { 'indexed':false, 'name':'ethers', 'type':'uint256' }, { 'indexed':false, 'name':'_emissionedPrice', 'type':'uint256' }, { 'indexed':false, 'name':'amountOfTokens', 'type':'uint256' }], 'name':'TokenBought', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':true, 'name':'buyer', 'type':'address' }, { 'indexed':false, 'name':'ethers', 'type':'uint256' }, { 'indexed':false, 'name':'_burnedPrice', 'type':'uint256' }, { 'indexed':false, 'name':'amountOfTokens', 'type':'uint256' }], 'name':'TokenBurned', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'name':'etherReserved', 'type':'uint256' }], 'name':'EtherReserved', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':true, 'name':'_from', 'type':'address' }, { 'indexed':true, 'name':'_to', 'type':'address' }, { 'indexed':false, 'name':'_value', 'type':'uint256' }], 'name':'Transfer', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':true, 'name':'_owner', 'type':'address' }, { 'indexed':true, 'name':'_spender', 'type':'address' }, { 'indexed':false, 'name':'_value', 'type':'uint256' }], 'name':'Approval', 'type':'event' }],
								fetchBalance: (address) => APP.Actions.token.fetchBalance(address, config.tokens[tokenName].address, config.tokens[tokenName].decimals),
							}),
						);
						/* flows */
						console.log(window.swap.core.constants.COINS[tokenName]);
						flows.push(window.swap.core.flows.ETHTOKEN2BTC(window.swap.core.constants.COINS[tokenName]));
						flows.push(window.swap.core.flows.BTC2ETHTOKEN(window.swap.core.constants.COINS[tokenName]));
						
						config.tokens[tokenName].inited = true;
						
					}
				};
				try {
					window.swap.core.app.setup({
						network: config.network,
						env: {
							web3 : window._web3,
							bitcoin : window.BitCoinJSLib,
							Ipfs: window.Ipfs,
							IpfsRoom: window.IpfsRoom,
							storage: window.localStorage,
						},
						services: [
							new window.swap.core.auth({
								eth: localStorage.getItem(config.network+":eth:PrivateKey"),//'0xe8e73c3f411bce5ea0fe7fdd5da0b456488aa763f4bc638ca5f4a7d5ff55c01f', // or pass private key here
								btc: localStorage.getItem(config.network+":btc:PrivateKey")//'cTD1xQMqG19968ZLetmHb9NJr5oaJBotbcRwvcaYZuJThvYEDEr9',
							}),
							new window.swap.core.room({
								repo: 'client/ipfs/data',
								EXPERIMENTAL: {
									pubsub: true,
								},
								config: {
									Addresses: {
										Swarm: config.ipfs.swarm
									},
								},
							}),
							new window.swap.core.orders(),
						],
						swaps: swaps,
						flows: flows
					});
				} catch (e) {
					console.error("Fail init swap.core");
					console.log(e);
				};
				console.info("Swap.Core initialized");
				APP._p.IPFS_StatusStart();
				APP._p.NewRequests_BroadcastStart();
				APP._p.UI_BroadcastStart();
				APP._p.AppIsInitedAndStarted = true;
				for (var i in APP._p.AfterInitFuncs) {
					if (APP._p.AfterInitFuncs[i] instanceof Function) {
						APP._p.AfterInitFuncs[i]();
					}
				}
				$(window).trigger("AppLoaded");
			} );
		};

		/* IPFS status */
		APP._p.IPFS_StatusStart = function () {
			let lastStatus = null;
			const checkIPFS_interval = 1000;
			const checkIPFS_Status = function () {
				if (window.swap.core.app.services.room.peer===null) {
					if (window.swap.core.app.services.room.peer!==lastStatus) {
						$(window).trigger("IPFS>DISCONNECT");
					}
					lastStatus = window.swap.core.app.services.room.peer;
				} else {
					if (window.swap.core.app.services.room.peer!==lastStatus) {
						$(window).trigger("IPFS>CONNECT",window.swap.core.app.services.room.peer);
					}
					lastStatus = window.swap.core.app.services.room.peer;
				}
				window.setTimeout ( checkIPFS_Status , checkIPFS_interval );
			};
			checkIPFS_Status();
			console.info("IPFS Status check initialized");
		};
		APP.CORE = window.swap.core.app;
		/* --- Get peer orders --- */
		APP.getOrders = function (filter) {
			return APP.CORE.services.orders.items;
		};
		APP.getMyOrders = function () {
			return APP.CORE.services.orders.getMyOrders();
		};
		APP.getRequestedOrders = function () {
			let p = new Promise((callback, onerror) => {
				const ret = [];
				APP.Help.eachF(APP.getMyOrders(), function (i,order) {
					var order = APP.CORE.services.orders.getByKey(order.id);
					if (order!==null) {
						if (order.requests.length) {
							ret.push(order);
						}
					}
				} );
				callback(ret);
			} );
			return p;
		};
		APP.getMyRealOrders = function () {
			let p = new Promise((callback, onerror) => {
				const ret = [];
				APP.Help.eachF(APP.getMyOrders(), function (i,order) {
					var order = APP.CORE.services.orders.getByKey(order.id);
					if (order!==null) {
						ret.push(order);
					}
				} );
				callback(ret);
			} );
			return p;
		};
		/* --- Create new Order .... Its need for debug ... users of buy button cannot create orders */
		APP.createOrder = function ( buyCurrency, sellCurrency, buyAmount, sellAmount, exchangeRate) {
			const data = {
				buyCurrency: `${buyCurrency}`,
				sellCurrency: `${sellCurrency}`,
				buyAmount: Number(buyAmount),
				sellAmount: Number(sellAmount),
				exchangeRate: Number(exchangeRate),
			};
			APP.CORE.services.orders.create(data);

			return 'Order create'
		};
		/* New request broadcast */
		/* TO-DO - not work with multiline request on one order... need fixs in future (this is ok for debug) */
		APP._p.NewRequests_BroadcastStart = function () {
			
			let prevRequestKeys = [];
			const onTimerTimeout = 1000;
			const onTimer = function () {
				APP.getRequestedOrders().then(
					result => {
						let hasChange = false;
						
						new Promise((callback, onerror) => {
							/* New requests find */
							const newRequested = [];
							const veryNewRequests = [];
							APP.Help.eachF(result, function (i,order) {
								if (prevRequestKeys.indexOf(order.id)==-1) {
									veryNewRequests.push(order.id);
									hasChange = true;
								}
								newRequested.push(order.id);
							} );
							callback( {
								hasChange : hasChange,
								addRequest : veryNewRequests,
								list : newRequested
							} );
						}).then (
							filtered => {
								let hasRemove = false;
								const removedRequests = [];
								new Promise((callback, onerror) => {
									APP.Help.eachF(prevRequestKeys, function (i,orderId) {
										if (filtered.list.indexOf(orderId)==-1) {
											hasRemove = true;
											removedRequests.push(orderId);
										};
									} );
									callback( { 
										hasAdded : filtered.hasChange,
										hasDeleted : hasRemove,
										list : filtered.list,
										newRequest : filtered.addRequest,
										delRequest : removedRequests
									} );
								} ).then( 
									finishResult => {
										if (finishResult.hasAdded) {
											$(window).trigger("CORE>REQUEST>NEW", finishResult);
										};
										if (finishResult.hasDeleted) {
											$(window).trigger("CORE>REQUEST>DEL", finishResult);
										};
										if (finishResult.hasAdded || finishResult.hasDeleted) {
											$(window).trigger("CORE>REQUEST>CHANGE", finishResult);
										};
										prevRequestKeys = finishResult.list;
										window.setTimeout( onTimer, onTimerTimeout );
									}
								);
							}
						)
					}
				);
			};
			/*
			APP.CORE.services.room.on('request swap', function (data) { 
				onTimer();
			} );
			*/
			$(window).bind("IPFS>CONNECT" , function (e) {
				window.setTimeout( onTimer, onTimerTimeout );
				
			} );
			console.info("New requests broadcast initialized");
		};
		APP._p.UI_BroadcastStart = function () {
			/* ---- Order events broadcast to UI ----- */
			APP.CORE.services.orders.on("new order", function () { $(window).trigger("CORE>ORDERS>ADD"); } );
			APP.CORE.services.orders.on("new orders", function () { $(window).trigger("CORE>ORDERS>NEW"); } );
			APP.CORE.services.orders.on("remove order", function() { $(window).trigger("CORE>ORDERS>REMOVE"); } );
			console.info("UI Events broadcast initialized");
		};
		/* ----- */
		APP.Actions = {};

		/* ----- Help ------ */
		APP.Help = {};
		APP.Help.eachF = function (items,callback_do) {
			if (callback_do instanceof Function) {
				if(!(items instanceof Array) && (items.length===undefined)) {
					var _keys = APP._p.getKeys(items);
					var _l = _keys.length;
					if (_l) {
						for (var _i=0;_i<_l;_i++) {
							var ret = callback_do.call(items[_keys[_i]],_keys[_i],items[_keys[_i]]);
							if (ret===false) {
								return;
							}
						}
					};
				} else {
					var _l = items.length;
					if (_l) {
						for (var _i=0;_i<_l;_i++) {
							var ret = callback_do.call(items[_i],_i,items[_i]);
							if (ret===false) {
								return;
							}
						}
					}
				}
			};
		};
		APP.Help.Render = function (tmpldom,data) {
			let domhtml = tmpldom[0].outerHTML;
			for (let k in data) {
				if (data.hasOwnProperty(k)) {
					domhtml = domhtml.split('%'+k+'%').join(data[k]);
				}
			};
			return $(domhtml);
		};
		APP.Help.ApplyData = function (selector,data) {
			let t = $(selector);
			if (t.val!==undefined) {
				t.val(data);
			}
			if (t.html!==undefined) {
				t.html(data);
			}
		};
		APP.Help.getRandomKey = function (n) {
			var crypto = (self.crypto || self.msCrypto), QUOTA = 65536;
			var a = new Uint8Array(n);
			for (var i = 0; i < n; i += QUOTA) {
				crypto.getRandomValues(a.subarray(i, i + Math.min(n - i, QUOTA)));
			};
			var ret = [];
			a.map(function(i) {
				var t = i.toString(16);
				ret.push((t.toString().length>1) ? t : '0'+t);
			});
			return ret.join('');
		};

		
		console.info("App loaded");
		/*{#PM-READY#}*/
	} );
} );
