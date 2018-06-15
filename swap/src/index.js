import React from 'react'
import ReactDOM from 'react-dom'
import App from './App/App'
import { app } from './swap'
import { ethereumInstance, bitcoinInstance } from './instances'


function btcLogin(e) {
  const btcAccount = bitcoinInstance.login(e.target.value)
  localStorage.setItem('btcPrivateKey', btcAccount.getPrivateKey())  
  
  if ( e.target.value === "") {
    app.storage.me.btc.test = "(тестовый)"
    localStorage.setItem('btcTest', "(тестовый)" )
  } else {
    app.storage.me.btc.test = ""
    localStorage.setItem('btcTest', "" )
  }
  
  app.storage.me.btc.address = btcAccount.address
  
  document.getElementById("btcWallet").innerHTML =  "Bitcoin " + app.storage.me.btc.test + " " + app.storage.me.btc.address
}

function ethLogin(e) {
  const ethAccount = ethereumInstance.login(e.target.value)
  localStorage.setItem('ethPrivateKey', ethAccount.privateKey)  
  
  if ( e.target.value === "") {
    app.storage.me.eth.test = "(тестовый)"
    localStorage.setItem('ethTest', "(тестовый)" )
  } else {
    app.storage.me.eth.test = ""
    localStorage.setItem('ethTest', "" )
  }
  
  app.storage.me.eth.address = ethAccount.address
  
  document.getElementById("ethWallet").innerHTML =  "Ethereum " + app.storage.me.eth.test + " " + app.storage.me.eth.address
}


ReactDOM.render(<div>loading...</div>, document.getElementById('root'))

var url = window.location.href
console.log('url', url)
var captured = decodeURIComponent(url.split('param=')[1])
console.log('captured', captured)
var result = captured ? JSON.parse(captured) : [['BTC','ETH','ETHTOKEN'],['ETH','BTC','ETHTOKEN']]

const sellCurrencies = result[0]
const buyCurrencies = result[1]

app.on('ready', () => {

  console.log(app)

  ReactDOM.render(
     <div>
       <div>Введите данные Ethereum кошелька <input type="text" onChange={ethLogin} name="ethPrivateKey" /> </div>
       <div>Введите данные Bitcoin кошелька <input type="text" onChange={btcLogin} name="btcPrivateKey" /> </div>
     </div>
  , document.getElementById('login')) 
  
  ReactDOM.render(
    <App 
        sellCurrencies={sellCurrencies}
        buyCurrencies={buyCurrencies}
    />, 
    document.getElementById('root')
    )
/*     
  setInterval (
    function() { ReactDOM.render(
       <App
        sellCurrencies={sellCurrencies}
        buyCurrencies={buyCurrencies}
       />, 
       document.getElementById('root')) },
    10000
  )
*/
})
