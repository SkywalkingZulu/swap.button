import bitcoinJsLib from 'bitcoinjs-lib'
import { SwapApp, setupEnv } from './swap/index'
import { web3 } from './instances/ethereum'
import { ethereumInstance, bitcoinInstance } from './instances'

// // Chrome
// localStorage.setItem('ethPrivateKey', '0xa6316e9e231fa70f2f41ce755f3846b74af10e8c5def8d333ec89af3b9b4193b')
// localStorage.setItem('btcPrivateKey', 'cUSH65TpCkU5rsMem8WND5itr3SVF192EAKA8E5ipqs15fTJiRbc')

// // Yandex
// localStorage.setItem('ethPrivateKey', '0xe32a5cb068a13836b6bc80f54585bbfcc2d5d9089f0c5381b27d039b6d2404ec')
// localStorage.setItem('btcPrivateKey', 'cRF7Az481ffsuhhZ28x32Xk4ZvPh98zhKv7hCi1pKjifqvv7AcuX')


console.log ('on entry: -----------------------------', localStorage.getItem('myOrders' ) )

var ethTest = localStorage.getItem('ethTest')
var btcTest = localStorage.getItem('btcTest')

if (!ethTest) {
  ethTest = "(тестовый)"
}

if (!btcTest) {
  btcTest = "(тестовый)" 
}

const ethPrivateKey = localStorage.getItem('ethPrivateKey')
const btcPrivateKey = localStorage.getItem('btcPrivateKey')

const ethAccount = ethereumInstance.login(ethPrivateKey)
const btcAccount = bitcoinInstance.login(btcPrivateKey)

localStorage.setItem('ethPrivateKey', ethAccount.privateKey)
localStorage.setItem('btcPrivateKey', btcAccount.getPrivateKey())

const localClear = localStorage.clear.bind(localStorage)

global.clear = localStorage.clear = () => {
  localClear()
  localStorage.setItem('ethPrivateKey', ethAccount.privateKey)
  localStorage.setItem('btcPrivateKey', btcAccount.getPrivateKey())
  localStorage.setItem('ethTest', ethTest )
  localStorage.setItem('btcTest', btcTest )
}


setupEnv({
  web3,
  bitcoinJs: bitcoinJsLib,
  Ipfs: global.Ipfs,
  IpfsRoom: global.IpfsRoom,
})

var url = window.location.href
console.log('url', url)
var captured = decodeURIComponent(url.split('param=')[1])
console.log('captured', captured)
var result = captured ? JSON.parse(captured) : [['BTC','ETH','ETHTOKEN'],['ETH','BTC','ETHTOKEN']]

const app = window.app = new SwapApp({
  me: {
    reputation: 10,
    exchangeRate: 200,
    sellAmount: 1,
    sellAmountMax: 5,
    sellCurrency: result[0][0], 
    buyCurrency: result[1][0], 
    filterBuyCurrency: "-all-",
    filterSellCurrency: "-all-",
    filterBuyAmount: 0,
    orderBy: 'date',
    eth: {
      address: ethAccount.address,
      publicKey: ethAccount.publicKey,
      test: ethTest,
    },
    btc: {
      address: btcAccount.getAddress(),
      publicKey: btcAccount.getPublicKeyBuffer().toString('hex'),
      test: btcTest,
    },
  },
  config: {
    ipfs: {
      EXPERIMENTAL: {
        pubsub: true,
      },
      config: {
        Addresses: {
          Swarm: [
            // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
            '/dns4/star.wpmix.net/tcp/443/wss/p2p-websocket-star',
          ],
        },
      }
    },
  },
})

app.on('ready', () => {
  console.log('swapApp ready')
  console.log('initial orders', app.getOrders())
})

app.on('user online', (peer) => {
  console.log('user online', peer)
})

app.on('user offline', (peer) => {
  console.log('user offline', peer)
})

app.on('new orders', (swaps) => {
  console.log('new orders', swaps)
})

app.on('new order', (swap) => {
  console.log('new order', swap)
})

app.on('remove order', (swap) => {
  console.log('remove order', swap)
})

app.on('new order request', ({ swapId, participant }) => {
  console.error(`user ${participant.user.peer} requesting swap`, {
    swap: app.orderCollection.getByKey(swapId),
    participant,
  })
})


export {
  app,
  web3,
  bitcoinJsLib,
  ethAccount,
  btcAccount,
}
