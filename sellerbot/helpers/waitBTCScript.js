
const waitBTCScript = (flow, callback) => {
  console.log("Wait BTC Script...");
  const processor = () => {
    if (flow.state.btcScriptValues) {
      if (callback instanceof Function) {
        callback();
      }
    } else {
      setTimeout( processor, 1000 );
    }
  }
  setTimeout( processor , 1000 );
}

module.exports = waitBTCScript;