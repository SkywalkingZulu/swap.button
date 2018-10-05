const SwapCore = require('swap.core');

const ethHelper = {
  fetchBalanceAsync : (address) =>
			SwapCore.app.env.web3.eth.getBalance(address)
				.then(result => Number(SwapCore.app.env.web3.utils.fromWei(result)))
				.catch((e) => {
					console.log('Web3 doesn\'t work please again later ', e.error)
				})
}

module.exports = ethHelper;