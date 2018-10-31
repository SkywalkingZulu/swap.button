const config = require('../config');
const app = require('./app.init');
const swapLogic = require('./swap');

const swap = require('swap.core');
const tokensRates = config.tokensRates;
const ordersTargetWallets = require('./targetWallets');
const waitParticipant = require('../helpers/waitParticipant');
const waitRequests = require('../helpers/waitRequests');
const tokensHelper = require('../helpers/tokens');
const ordersForUsers = {};

const worker = async function () {
  console.log("Init configuration....");
  app.createSwapApp();
  /* subscribe on incoming requests */
  /* ---- */
  swap.app.services.room.on('request swap', function (data) { 
    console.log("Request swap");
    console.log(data);
    /* Check - this is order for this user ? */
    if (ordersForUsers[data.fromPeer]) {
      if (ordersForUsers[data.fromPeer].indexOf(data.orderId)!==-1) {
        /* this is our user */
        console.log("Incoming request. Accept him. Wait core for init order data");
        const order = swap.app.services.orders.getByKey(data.orderId);
				if (order!==null && order.isMy) {
          if (data.participant.peer==data.fromPeer) {
            waitRequests( order.id , data.participant , () => {
              order.acceptRequest(data.participant.peer);
              waitParticipant( order.id , data.participant, () => {
                console.log("Begin swap");
                new swapLogic( order.id );
              } );
            } );
          }
          /*
					order.acceptRequest(data.participant);
          console.log("Begin swap");
          new swapLogic( order.id );
					*/
				}
      }
    }
  } );
  
  /* catch request for buy tokens */
  swap.app.services.room.on( 'bot.request.createOrder' , async function (data) {
    console.log('Incoming buy request');
    console.log(data);

    if (swap.app.env.web3.currentProvider.host != data.network) {
      console.log('not our network');
      return;
    }
    /* Incoming request */
    if ((tokensRates[data.currency]===undefined)) {
      /* Not supported token | We are not sell this token */
      /*
        // Not actual in multi-thread mode 
      swap.app.services.room.sendMessagePeer(
        data.fromPeer,
        {
          event : 'bot.request.declime',
          data : {
            message : 'not supported currency'
          }
        }
      );
      */
      return;
    };
    /* Check balance of tokens */
    let aviableBalance = await tokensHelper.fetchBalance(
      swap.app.services.auth.accounts.eth.address,
      config.tokens[data.currency.toLowerCase()].address,
      config.tokens[data.currency.toLowerCase()].decimals
    );
    console.log("Aviable balance: ",aviableBalance);
    if (aviableBalance<data.amount && !data.sell) {
      /*
        // Not actual in multi-thread mode
      swap.app.services.room.sendMessagePeer(
        data.fromPeer,
        {
          event : 'bot.request.declime',
          data : {
            message : 'no token yet',
            amount: aviableBalance
          }
        }
      );
      */
      return;
    };
    
    /* user sell btc - calc amount of tokens */
    
    let orderForUser = null;
    
    if (data.sell) {
      let tokenAmount = data.amount * tokensRates[data.currency];
      /* round to number */
      console.log(tokenAmount);
      tokenAmount = parseInt(tokenAmount,10);
      console.log("Token amount:", tokenAmount);
      const btcAmount =  Math.round(tokenAmount / tokensRates[data.currency] * Math.pow(10, 5)) / Math.pow(10, 5);
      console.log("Rounded btc price:",btcAmount);
      if (aviableBalance<tokenAmount) {
        console.log("Skip");
        return;
      };
      const orderData = {
        buyCurrency: "BTC",
        sellCurrency: data.currency,
        buyAmount: Number(btcAmount),
        sellAmount: Number(tokenAmount),
        exchangeRate: Number(tokensRates[data.currency]),
      };
      console.log(orderData);
      orderForUser = swap.app.services.orders.create(orderData);
    } else {
      let btcAmount = data.amount / tokensRates[data.currency];
      console.log("BTC cost:", btcAmount);
      /*
        Create order for user
      */
      const orderData = {
        buyCurrency: "BTC",
        sellCurrency: data.currency,
        buyAmount: Number(btcAmount),
        sellAmount: Number(data.amount),
        exchangeRate: Number(tokensRates[data.currency]),
      };
      orderForUser = swap.app.services.orders.create(orderData);
      
    }
    if (orderForUser) {
      ordersForUsers[data.fromPeer] = ordersForUsers[data.fromPeer] || new Array();
      ordersForUsers[data.fromPeer].push(orderForUser.id);
      
      /* Save target address for tokens */
      ordersTargetWallets[orderForUser.id] = data.wallet;
      /*
        Send order id to user
      */
      swap.app.services.room.sendMessagePeer(
        data.fromPeer,
        {
          event : 'bot.request.accept',
          data : {
            orderID : orderForUser.id
          }
        }
      );
      
      swap.app.services.room.sendMessagePeer(
        data.fromPeer,
        {
          event : 'bot.request.incoming',
          data : {
            orderID : orderForUser.id
          }
        }
      );
    }
    
  } );
  
  /*
  infinity loop for console run
  */
  const infinity_loop = function () {
    setTimeout( infinity_loop , 1000 );
  }
  infinity_loop();
}

module.exports = worker;