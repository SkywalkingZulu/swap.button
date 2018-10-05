const SwapCore = require('swap.core');

const waitWEB3 = (callback) => {
  console.log("Wait Web3JS");
  const processor = () => {
    if (SwapCore
      && SwapCore.app
      && SwapCore.app.env
      && SwapCore.app.env.web3
      && SwapCore.app.env.web3.eth
    ) {
      if (callback instanceof Function) {
        callback();
      }
    } else {
      setTimeout( processor, 1000 );
    }
  }
  setTimeout( processor , 1000 );
}

module.exports = waitWEB3;