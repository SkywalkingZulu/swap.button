const swap = require('swap.core');

const waitParticipant = (orderId, needPeer, callback) => {
  console.log("Wait Participant",orderId);
  const processor = () => {
    const order = swap.app.services.orders.getByKey(orderId);
    if (order.participant
      && order.participant.eth
      && order.participant.btc
      && (order.participant.eth == needPeer.eth)
      && (order.participant.btc == needPeer.btc)
    ) {
      if (callback instanceof Function) {
        callback()
      }
    } else {
      setTimeout( processor, 1000 );
    }
  }
  setTimeout( processor , 1000 );
}

module.exports = waitParticipant;