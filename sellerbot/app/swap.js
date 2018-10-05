const swapcore = require('swap.core');
const ordersTargetWallets = require('../app/targetWallets');
const waitBTCScript = require('../helpers/waitBTCScript');

const swapLogic = function (orderID) {
  
  const order = swapcore.app.services.orders.getByKey(orderID);

  const flowType = (!order.isMy) ? 
    order.buyCurrency+"2"+order.sellCurrency : 
    order.sellCurrency+"2"+order.buyCurrency;
  
  const validOrderData = {
    sellCurrency : (order.isMy) ? order.sellCurrency : order.buyCurrency,
    buyCurrency : (order.isMy) ? order.buyCurrency : order.sellCurrency,
    sellAmount : (order.isMy) ? order.sellAmount : order.buyAmount,
    buyAmount : (order.isMy) ? order.buyAmount : order.sellAmount
  };
  
  /* Begin */
  const swap = new swapcore.Swap(orderID);
  
  if (ordersTargetWallets[orderID]!==undefined) {
    //swap.flow.setEthAddress(window.testOrderTargetWallets[orderID]);
  };
  
  const swap_state_update = function (values) {
    const step = swap.flow.state.step;
    const flow = swap.flow;
    console.log("Step ",step);
    /* TOKEN TO BTC ONLY */
    try {
      if ( step == 1 ) {
        setTimeout( () => {
          swap.flow.sign()
        } , 5*1000);
      }
      if ( step == 3 ) {
        waitBTCScript( swap.flow, () => {
          swap.flow.verifyBtcScript()
        } );
      }

      if ( step + 1 === swap.flow.steps.length ) {
        console.log('[FINISHED]')
        if (!swap.flow.state.isBtcWithdrawn) {
          console.log("BTC not withdrawed");
          console.log("May be secret go to us too late.... retry");
          if (swap.flow.state.secret) {
            swap.flow.setState( { step : 7 } );
            swap.flow.goStep(7);
          }
        }
        //console.log( swap.flow.state );
      }
    } catch (e) {
      //console.log(e.message);
    }
  };
  
  swap.on('state update', swap_state_update);
  
}
module.exports = swapLogic;