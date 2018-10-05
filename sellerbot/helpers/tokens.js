import abi from 'human-standard-token-abi';
import { BigNumber } from 'bignumber.js'
const SwapCore = require('swap.core');
const config = require('../config');

const tokensHelper = {
  fetchBalance : async (address, contractAddress, decimals) => {
    const ERC20 = new SwapCore.app.env.web3.eth.Contract(abi, contractAddress)
    const result = await ERC20.methods.balanceOf(address).call()

    const amount = new BigNumber(String(result)).dividedBy(new BigNumber(String(10)).pow(decimals)).toNumber()
    return amount
  }
}

module.exports = tokensHelper;