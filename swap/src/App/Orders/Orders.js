import React, { Fragment, Component } from 'react'
import { app } from '../../swap'


export default class Orders extends Component {

  constructor() {
    super()

    this.state = {
      orders: app.orderCollection.items,
    }
  }

  componentWillMount() {
    app.on('new orders', this.updateOrders)
    app.on('new order', this.updateOrders)
    app.on('remove order', this.updateOrders)
    app.on('order update', this.updateOrders)
    app.on('new order request', this.handleRequest)
  }

  componentWillUnmount() {
    app.off('new orders', this.updateOrders)
    app.off('new order', this.updateOrders)
    app.off('remove order', this.updateOrders)
    app.off('order update', this.updateOrders)
    app.off('new order request', this.handleRequest)
  }

  updateOrders = () => {
    this.setState({
      orders: app.orderCollection.items,
    })
  }

  handleRequest = ({ orderId, participant }) => {
    this.updateOrders()
  }
  
  
  createOrder = () => {
    const curExchangeRate = app.storage.me.exchangeRate
    const curSellAmount = app.storage.me.sellAmount
    const curSellAmountMax = app.storage.me.sellAmountMax
    const sellCurrency = app.storage.me.sellCurrency
    const buyCurrency = app.storage.me.buyCurrency
    const createDT = new Date()
    const createDateTime = createDT.toLocaleString('ru-RU')

    const data = {
      buyCurrency: buyCurrency,
      sellCurrency: sellCurrency,
      buyAmount: curSellAmount*curExchangeRate,
      buyAmountMax: curSellAmountMax*curExchangeRate,
      sellAmount: curSellAmount,
      sellAmountMax: curSellAmountMax,
      exchangeRate: curExchangeRate,
      createDateTime: createDateTime,
      createDT:createDT,
    }

    app.createOrder(data)
    this.updateOrders()
  }
  
  changeExchangeRate = (e) => {
    if (e.target.value !== "") {
      app.storage.me.exchangeRate = e.target.value 
    }
  }
  
  changeSellAmount = (e) => {
    if (e.target.value !== "") {
      app.storage.me.sellAmount = e.target.value
    }
    if ( app.storage.me.sellAmountMax < app.storage.me.sellAmount ) {
      app.storage.me.sellAmountMax = app.storage.me.sellAmount
    }
  }
  
  changeSellAmountMax = (e) => {
    if ( e.target.value !== "" ) {
      app.storage.me.sellAmountMax = e.target.value
    }
    if ( app.storage.me.sellAmount > app.storage.me.sellAmountMax ) {
      app.storage.me.sellAmount = app.storage.me.sellAmountMax
    }
    
  }
  
  changeSellCurrency = (e) => {  
      app.storage.me.sellCurrency = e.target.value
  }
  
  changeBuyCurrency = (e) => {  
      app.storage.me.buyCurrency = e.target.value
  }
  
  filterSellCurrency = (e) => {  
      app.storage.me.filterSellCurrency = e.target.value
      this.updateOrders()
  }
  
  IMSeller = () => {  
      document.getElementById('IMSeller').style.display = 'block'
      document.getElementById('IMBuyer').style.display = 'none'
      const allElem = document.getElementsByClassName('filter')
      for(var i = 0; i < allElem.length; i++){
        allElem[i].style.display = 'block'
        allElem[i].options[0].selected=true
      }
      app.storage.me.filterSellCurrency = '-all-'
      app.storage.me.filterBuyCurrency = '-all-'
      this.updateOrders()
  }
  
  IMBuyer = () => {  
      document.getElementById('IMBuyer').style.display = 'block'
      document.getElementById('IMSeller').style.display = 'none'
      var allElem = document.getElementsByClassName('filter')
      for(var i = 0; i < allElem.length; i++){
        allElem[i].style.display = 'none'
      }
      allElem = document.getElementsByClassName('tfilter')
      for(i = 0; i < allElem.length; i++){
        allElem[i].options[0].selected=true
      }
      app.storage.me.filterSellCurrency = '-all-'
      app.storage.me.filterBuyCurrency = '-all-'
      this.updateOrders()
  }
  
  filterBuyCurrency = (e) => {  
      app.storage.me.filterBuyCurrency = e.target.value
      this.updateOrders()
  }  
  
  filterBuyAmount = (e) => {  
      app.storage.me.filterBuyAmount = e.target.value*1
      this.updateOrders()
  }  
  
  orderByRateAsc = () => {  
      app.storage.me.orderBy = 'rateasc'
      this.updateOrders()
  }
  orderByRateDesc = () => {  
      app.storage.me.orderBy = 'ratedesc'
      this.updateOrders()
  } 

  orderByRepAsc = () => {  
      app.storage.me.orderBy = 'repasc'
      this.updateOrders()
  } 
  orderByRepDesc = () => {  
      app.storage.me.orderBy = 'repdesc'
      this.updateOrders()
  } 
  
  changeBuyRequestAmount = (orderId) => {
  
   const el = document.getElementById('changeBuyRequestAmount_' + orderId)
   const value = el.value*1
   const order = app.orderCollection.getByKey(orderId)
      
    if ( value !== 0 && value >= order.sellAmount && value<= order.sellAmountMax) {
      order.setBuyRequestAmount (value)
      el.style.border = "2px solid lightgrey"
      this.updateOrders()
    } else {
      el.style.border = "2px solid red"
    }
  }
  

  removeOrder = (orderId) => {
    app.removeOrder(orderId)
    this.updateOrders()
  }

  sendRequest = (orderId) => {
    const order = app.orderCollection.getByKey(orderId)
    
    if (order.getBuyRequestAmount) {

      order.sendRequest((isAccepted) => {
        console.log(`user ${order.owner.peer} ${isAccepted ? 'accepted' : 'declined'} your request`)

        this.handleOrderSelect(orderId)
      })
      this.updateOrders()
    } else {
      document.getElementById('changeBuyRequestAmount_'+orderId).style.border = "2px solid red"
    }
  }

  acceptRequest = (orderId, participantPeer, swapRequestAmount) => {
    const order = app.orderCollection.getByKey(orderId)
  
    order.setBuyRequestAmount (swapRequestAmount)
      
    order.acceptRequest(participantPeer)
    this.handleOrderSelect(orderId)
    this.updateOrders()
  }

  declineRequest = (orderId, participantPeer) => {
    const order = app.orderCollection.getByKey(orderId)

    order.declineRequest(participantPeer)
    this.updateOrders()
  }

  handleOrderSelect = (swapId) => {
    const { onOrderSelect } = this.props

    onOrderSelect(swapId)
  }

  render() {
    var { orders } = this.state
    const { myPeer, activeOrderId, sellCurrencies, buyCurrencies } = this.props
    
    //console.log ('app.storage.me.orderBy:', app.storage.me.orderBy)
    
    if ( app.storage.me.orderBy === 'rateasc' ) {
      orders.sort(function(a,b){
        return a.exchangeRate - b.exchangeRate
      })
    }
    if ( app.storage.me.orderBy === 'ratedesc' ) {
      orders.sort(function(a,b){
        return b.exchangeRate - a.exchangeRate
      })
    }
    if ( app.storage.me.orderBy === 'repasc' ) {
      orders.sort(function(a,b){
        return a.owner.reputation-b.owner.reputation
      })
    }
    if ( app.storage.me.orderBy === 'repdesc' ) {
      orders.sort(function(a,b){
        return b.owner.reputation-a.owner.reputation
      })
    }
    
    return (
      <div>
        <div id='Wallets'> 
           <div>Подключеные в данный момент кошельки:</div>
           <div id="ethWallet">Ethereum {app.storage.me.eth.test} {app.storage.me.eth.address}</div>
           <div id="btcWallet">Bitcoin {app.storage.me.btc.test} {app.storage.me.btc.address} </div>
        </div>
        <br />
        <br />
        <br />
        <span onClick={this.IMSeller} className='button'> ХОЧУ ПРОДАТЬ</span><span onClick={this.IMBuyer} className='button'> ХОЧУ КУПИТЬ</span>
        <br />
        <div id="IMSeller">
        <h2>Создание заявки на продажу</h2>
        Выбор валютной пары <select onChange={this.changeSellCurrency}>
          {
                  sellCurrencies.map((cur) => {
                    return ( 
                      <option>{cur}</option>
                      )
                  })
          }
                            </select> -> 
                            <select onChange={this.changeBuyCurrency}>
          {
                  buyCurrencies.map((cur) => {
                    return ( 
                      <option>{cur}</option>
                      )
                  })
          }                            
                            </select>
        <br /><br />
        Диапазон обмена в валюте продажи <input type="text" onChange={this.changeSellAmount} placeholder="input sell min amount"  /> - 
                                         <input type="text" onChange={this.changeSellAmountMax } placeholder="input sell max amount"  />
        <br /><br />
        Курс обмена <input type="text" onChange={this.changeExchangeRate} placeholder="input exchange rate"   /><br />
        <button onClick={this.createOrder}>Create Order</button>
        </div>
        <div id="IMBuyer">
        <h2>Подбор заявки для покупки</h2>
        Хочу купить <select className='tfilter' onChange={this.filterSellCurrency}><option>-all-</option>
          {
                  sellCurrencies.map((cur) => {
                    return ( 
                      <option>{cur}</option>
                      )
                  })
          }             
             </select>,
        готов рассчитаться <select className='tfilter' onChange={this.filterBuyCurrency}><option>-all-</option>
          {
                  buyCurrencies.map((cur) => {
                    return ( 
                      <option>{cur}</option>
                      )
                  })
          }          
        </select>
        <br /><br />
        Сколько хотите купить <input type="text" onChange={this.filterBuyAmount} />
        </div>
        <br /><br /><br />
        {
          Boolean(orders && orders.length) && (
            <table>
              <thead>
                <tr>
                  <th>Курс обмена
                     <br /><span style={{cursor:'pointer'}} onClick={this.orderByRateAsc}>&darr;</span>
                     <span style={{cursor:'pointer'}} onClick={this.orderByRateDesc}>&uarr;</span></th>
                  <th>Создан</th>
                  <th>Репутация пользователя
                     <br /><span style={{cursor:'pointer'}} onClick={this.orderByRepAsc}>&darr;</span>
                     <span style={{cursor:'pointer'}} onClick={this.orderByRepDesc}>&uarr;</span>
                  </th>
                  <th>Продаю от</th>
                  <th>Продаю до</th>
                  <th>Валюта продажи<br /><select className='filter' onChange={this.filterSellCurrency}><option>-all-</option>
          {
                  sellCurrencies.map((cur) => {
                    return ( 
                      <option>{cur}</option>
                      )
                  })
          }
                  </select></th>
                  <th>Покупаю от</th>
                  <th>Покупаю до</th>
                  <th>Валюта покупки<br /><select className='filter' onChange={this.filterBuyCurrency}><option>-all-</option>
          {
                  buyCurrencies.map((cur) => {
                    return ( 
                      <option>{cur}</option>
                      )
                  })
          } 
                  </select></th>
                  <th width="1%" colSpan="2" />
                </tr>
              </thead>
              <tbody>
                {
                  orders.map((swap) => {
                    const {
                      id, createDateTime, buyAmount, buyAmountMax, sellAmount, sellAmountMax, buyCurrency, sellCurrency, exchangeRate, requests, isProcessing,
                      owner: { peer: ownerPeer, reputation },
                    } = swap
                    
                    var isMyRequested = false
                    
                    requests.forEach( function(r) {  
                       if( r.user.peer === myPeer ) {
                        isMyRequested = true 
                       }
                    })
                    
                    console.log('swap: ', swap)
                    
                    if ( createDateTime != null && // отбрасываем старые
                         ( app.storage.me.filterBuyCurrency === '-all-' || buyCurrency === app.storage.me.filterBuyCurrency ) &&
                         ( buyCurrencies.indexOf(buyCurrency) !== -1 ) &&
                         ( app.storage.me.filterSellCurrency === '-all-' || sellCurrency === app.storage.me.filterSellCurrency ) &&
                         ( sellCurrencies.indexOf(sellCurrency) !== -1 ) &&
                         ( app.storage.me.filterBuyAmount === 0 || ( app.storage.me.filterBuyAmount >= sellAmount &&  app.storage.me.filterBuyAmount <= sellAmountMax ) )
                         //&& ( !isProcessing || ( isProcessing && ( myPeer === ownerPeer || myPeer === swap.participant.peer ) ) )
                        ) {

                    return (
                      <tr key={id} style={{ backgroundColor: myPeer === ownerPeer ? '#fff4d5' : '' }}>
                        <td>{exchangeRate}</td>
                        <td>{createDateTime}</td>
                        <td>{reputation}</td>
                        <td>{sellAmount}</td>
                        <td>{sellAmountMax}</td>
                        <td>{sellCurrency}</td>
                        <td>{buyAmount}</td>
                        <td>{buyAmountMax}</td>
                        <td>{buyCurrency}</td>
                        {
                          isProcessing ? (
                            <td>
                              <div style={{ color: 'red' }}>PROCESSING</div>
                              {
                                activeOrderId !== id && (
                                  <button onClick={() => this.handleOrderSelect(id)}>OPEN</button>
                                )
                              }
                            </td>
                          ) : (
                            <td>
                              {
                                myPeer === ownerPeer ? (
                                  <Fragment>
                                    {
                                      Boolean(requests && requests.length) ? (
                                        <Fragment>
                                          {
                                            requests.map(({ user, swapRequestAmount }) => (
                                              <div key={user.peer}>
                                                User {user.peer} with <b>{user.reputation}</b> reputation<br />wants to swap {swapRequestAmount} {sellCurrency}.<br />
                                                <button onClick={() => this.acceptRequest(id, user.peer, swapRequestAmount)}>ACCEPT</button>
                                                <button onClick={() => this.declineRequest(id, user.peer)}>DECLINE</button>
                                              </div>
                                            ))
                                          }
                                        </Fragment>
                                      ) : (
                                        <button onClick={() => this.removeOrder(id)}>REMOVE</button>
                                      )
                                    }
                                  </Fragment>
                                ) : (
                                  <Fragment>
                                    {
                                      isMyRequested ? (
                                        <div style={{ color: 'red' }}>REQUESTING</div>
                                      ) : (
                                        <div>
                                        <input id={'changeBuyRequestAmount_'+id} type='text' placeholder='сколько?' style={{width:'60px'}} onChange={() => this.changeBuyRequestAmount(id)} /> 
                                        <button onClick={() => this.sendRequest(id)}>BUY</button>
                                        </div>
                                      )
                                    }
                                  </Fragment>
                                )
                              }
                            </td>
                          )
                        }
                      </tr>
                    )
                    } else {
                      return false
                    }
                  })
                }
              </tbody>
            </table>
          )
        }
      </div>
    )
  }
}
