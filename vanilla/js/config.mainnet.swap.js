const config = {
	network : 'mainnet',
	services: {
		web3: {
			provider: 'https://mainnet.infura.io/5lcMmHUURYg8F20GLGSr',
			rate: 0.1,
			gas: 1e5,
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
		contract : '0x843FcaAeb0Cce5FFaf272F5F2ddFFf3603F9c2A0',
	},
	eos: {
		contract: 'swaponline42',
	},
	tokens: {
		swap: {
			address: '0x14a52cf6B4F68431bd5D9524E4fcD6F41ce4ADe9',
			decimals: 18,
		}
	},
	link: {
		bitpay: 'https://insight.bitpay.com',
		etherscan: 'https://etherscan.io',
		eos: '',
		omniexplorer: 'https://www.omniexplorer.info',
	},
	api: {
		blocktrail: 'https://api.blocktrail.com/v1/BTC',
		bitpay: 'https://insight.bitpay.com/api',
		etherscan: 'https://api.etherscan.io/api',
	},
	apiKeys: {
		etherscan: 'RHHFPNMAZMD6I4ZWBZBF6FA11CMW9AXZNM',
		blocktrail: '1835368c0fa8e71907ca26f3c978ab742a7db42e',
	},
	currencies : [ "BTC", "ETH", "SWAP" ],
	filter : {
		buy : [ "ALL" ],
		sell : [ "ALL" ]
	}
};