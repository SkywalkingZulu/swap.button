import React, { Component } from 'react'
import { app } from '../swap'

import Orders from './Orders/Orders'
import Swap from './Swap/Swap'


export default class App extends Component {

  state = {
    activeOrderId: null,
  }

  handleSelectOrder = (orderId) => {
    this.setState({
      activeOrderId: orderId,
    })
  }

  render() {
    const { activeOrderId } = this.state
    const myPeer = app.storage.me.peer
    const { sellCurrencies, buyCurrencies } = this.props

    console.log ('=============',sellCurrencies, buyCurrencies)
 
    
    return (
      <div className="content">
        <Orders
          myPeer={myPeer}
          activeOrderId={activeOrderId}
          onOrderSelect={this.handleSelectOrder}
          sellCurrencies={sellCurrencies}
          buyCurrencies={buyCurrencies}
        />
        <Swap orderId={activeOrderId} />
      </div>
    )
  }
}
