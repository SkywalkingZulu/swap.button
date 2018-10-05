module.exports = {
	network : 'testnet',
	services: {
		web3: {
			provider: 'https://rinkeby.infura.io/JCnK5ifEPH9qcQkX0Ahl',
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
		contract: '0x53A84ad4e3bb67806C2Edf1AC8238d8b1b452B43',
		abi : [{"constant":false,"inputs":[{"name":"_secret","type":"bytes32"},{"name":"_ownerAddress","type":"address"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_participantAddress","type":"address"}],"name":"getSecret","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"participantAddress","type":"address"},{"name":"newTargetWallet","type":"address"}],"name":"setTargetWallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_secret","type":"bytes32"},{"name":"participantAddress","type":"address"}],"name":"withdrawNoMoney","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"swaps","outputs":[{"name":"token","type":"address"},{"name":"targetWallet","type":"address"},{"name":"secret","type":"bytes32"},{"name":"secretHash","type":"bytes20"},{"name":"createdAt","type":"uint256"},{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_secretHash","type":"bytes20"},{"name":"_participantAddress","type":"address"},{"name":"_value","type":"uint256"},{"name":"_token","type":"address"}],"name":"createSwap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_ownerAddress","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_participantAddress","type":"address"}],"name":"refund","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"createdAt","type":"uint256"}],"name":"CreateSwap","type":"event"},{"anonymous":false,"inputs":[],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[],"name":"Refund","type":"event"}]
	},
	eth: {
		contract : '0x4356152f044e3a1ce1a57566b2e0bee57949c1b2', // 0xdbC2395f753968a93465487022B0e5D8730633Ec
	},
	eos: {
		contract: 'swaponline42',
	},
	tokens: {
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
		}
	},
	link: {
		bitpay: 'https://test-insight.swap.online/insight',
		etherscan: 'https://rinkeby.etherscan.io',
		eos: 'http://jungle.cryptolions.io/#accountInfo',
	},
	api: {
		blocktrail: 'https://api.blocktrail.com/v1/tBTC',
		bitpay: 'https://test-insight.bitpay.com/api',//'https://test-insight.swap.online/insight-api',//'https://test-insight.bitpay.com/api',
		etherscan: 'https://rinkeby.etherscan.io/api',
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
    SWAP : 1000
  }
};