const swap = require('swap.core');

const waitRequests = (orderId, needReq, callback) => {
  console.log("Wait Request data ",orderId);
  const processor = () => {
    const order = swap.app.services.orders.getByKey(orderId);
    
    let founded = false;
    for (let i in order.requests) {
      if (order.requests[i]
        && order.requests[i].eth
        && order.requests[i].btc
        && order.requests[i].peer
        && (order.requests[i].peer == needReq.peer)
        && (order.requests[i].eth == needReq.eth)
        && (order.requests[i].btc == needReq.btc)
      ) {
        founded = true;
        if (callback instanceof Function) {
          callback()
        }
      }
    }
    if (!founded) {
      setTimeout( processor, 1000 );
    }
  }
  setTimeout( processor , 1000 );
}

module.exports = waitRequests;