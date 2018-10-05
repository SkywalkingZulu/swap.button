const SwapCore = require('swap.core');
const bitcoin = require('bitcoinjs-lib')
const request = require('request-promise-native')
const BigNumber = require('bignumber.js')
const config = require('../config');

const btcHelper = {
  fetchBalance(address) {
    return request.get(`${config.api.bitpay}/addr/${address}`)
      .then(( json ) => {
        const balance = JSON.parse(json).balance
        return balance
      })
      .catch(error => filterError(error))
  },
  fetchUnspents(address) {
    return request
      .get(`${config.api.bitpay}/addr/${address}/utxo`)
      .then(json => JSON.parse(json))
      .catch(error => filterError(error))
  },
  broadcastTx(txRaw) {
    return request.post(`${config.api.bitpay}/tx/send`, {
      json: true,
      body: {
        rawtx: txRaw,
      },
    })
    .catch(error => filterError(error))
  }
}

module.exports = btcHelper;