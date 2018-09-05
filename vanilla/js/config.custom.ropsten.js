const config = {
	network : 'testnet',
	services: {
		web3: {
			provider: 'https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl',
			rate: 0.1,
			gas: 2e6,
			gasPrice: '20000000000',
		},
		eos: {
			chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
			httpEndpoint: 'https://jungle.eosio.cr',
		},
	},
	ipfs: {
		swarm: [
			'/dns4/discovery.libp2p.array.io/tcp/9091/wss/p2p-websocket-star/',
		],
		server: 'discovery.libp2p.array.io',
	},
	token: {
		contract: '0xcb11573fc41600841F471916Adb5Cec53f6C11EF',//'0xc87C2668F05803F60EF75b176eea0CCE80D0009C',
	},
	eth: {
		contract : '0xdae019fada74fbb6015028271d4bb4a8da96afb0',//'0x4356152f044e3a1ce1a57566b2e0bee57949c1b2', // 0xdbC2395f753968a93465487022B0e5D8730633Ec
	},
	eos: {
		contract: 'swaponline42',
	},
	tokens: {
		/*
		swap: {
			address: '0xbaa3fa2ed111f3e8488c21861ea7b7dbb5a7b121',
			decimals: 18,
		},
		noxon: {
			address: '0x60c205722c6c797c725a996cf9cca11291f90749',
			decimals: 0,
		},
		jot: {
			address: '0x9070e2fDb61887c234D841c95D1709288EBbB9a0',
			decimals: 18,
		},
		*/
		syc2: {
			address: '0x49feef410293261c04f1d14600ba427f8eed8723',
			decimals: 2,
			erc20: true
		}
	},
	link: {
		bitpay: 'https://test-insight.swap.online/insight',
		etherscan: 'https://ropsten.etherscan.io',
		eos: 'http://jungle.cryptolions.io/#accountInfo',
	},
	api: {
		blocktrail: 'https://api.blocktrail.com/v1/tBTC',
		bitpay: 'https://test-insight.swap.online/insight-api',//'https://test-insight.bitpay.com/api',
		etherscan: 'https://ropsten.etherscan.io/api',
	},
	apiKeys: {
		etherscan: 'RHHFPNMAZMD6I4ZWBZBF6FA11CMW9AXZNM',
		blocktrail: '1835368c0fa8e71907ca26f3c978ab742a7db42e',
	},
	currencies : [ "BTC", "ETH", "SWAP", "NOXON" ],
	filter : {
		buy : [ "ALL" ],
		sell : [ "ALL" ]
	}
};