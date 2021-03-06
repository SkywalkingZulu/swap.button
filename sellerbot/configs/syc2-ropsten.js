module.exports = {
  auth : {
    eth : '0x7be2eed813eeeb7f6422b932962810039ee6866c8dc9d0bc0b31d5d085cb66d1'
  },
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
		/* contract with set target and withdraw when no money for gas */
		contract: '0x30f85eBCFAc9f6Dd69503955e95ab7F55Fa3fDeC',
		abi : [{"constant":false,"inputs":[{"name":"_secret","type":"bytes32"},{"name":"_ownerAddress","type":"address"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_participantAddress","type":"address"}],"name":"getSecret","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_secretHash","type":"bytes20"},{"name":"_participantAddress","type":"address"},{"name":"_targetWallet","type":"address"},{"name":"_value","type":"uint256"},{"name":"_token","type":"address"}],"name":"createSwapTarget","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_secret","type":"bytes32"},{"name":"participantAddress","type":"address"}],"name":"withdrawNoMoney","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"swaps","outputs":[{"name":"token","type":"address"},{"name":"targetWallet","type":"address"},{"name":"secret","type":"bytes32"},{"name":"secretHash","type":"bytes20"},{"name":"createdAt","type":"uint256"},{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_secretHash","type":"bytes20"},{"name":"_participantAddress","type":"address"},{"name":"_value","type":"uint256"},{"name":"_token","type":"address"}],"name":"createSwap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tokenOwnerAddress","type":"address"}],"name":"getTargetWallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_ownerAddress","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_participantAddress","type":"address"}],"name":"refund","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"createdAt","type":"uint256"}],"name":"CreateSwap","type":"event"},{"anonymous":false,"inputs":[],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[],"name":"Refund","type":"event"}]
	},
	eth: {
		contract : '0xdae019fada74fbb6015028271d4bb4a8da96afb0',//'0x4356152f044e3a1ce1a57566b2e0bee57949c1b2', // 0xdbC2395f753968a93465487022B0e5D8730633Ec
	},
	eos: {
		contract: 'swaponline42',
	},
	tokens: {
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
	},
  tokensRates : {
    SYC2 : 1000
  }
};