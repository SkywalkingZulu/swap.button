import { events } from './Events'
import { storage } from './Storage'
import room from './room'


const getUniqueId = (() => {
  let id = Date.now()

  return () => `${storage.me.peer}-${++id}`
})()

class Order {

  /**
   *
   * @param {object}  collection
   * @param {object}  data
   * @param {string}  data.id
   * @param {object}  data.owner
   * @param {string}  data.owner.peer
   * @param {number}  data.owner.reputation
   * @param {object}  data.owner.<currency>
   * @param {string}  data.owner.<currency>.address
   * @param {string}  data.owner.<currency>.publicKey
   * @param {string}  data.buyCurrency
   * @param {string}  data.sellCurrency
   * @param {number}  data.buyAmount
   * @param {number}  data.sellAmount
   * @param {number}  data.buyAmountMax
   * @param {number}  data.sellAmountMax
   * @param {number}  data.exchangeRate
   */
  constructor({ collection, data }) {
    this.id             = data.id || getUniqueId()
    this.isMy           = null
    this.owner          = null
    this.participant    = null
    this.buyCurrency    = null
    this.sellCurrency   = null
    this.buyAmount      = null
    this.buyAmountMax   = null
    this.sellAmount     = null
    this.buyRequestAmount     = null
    this.sellAmountMax  = null
    this.exchangeRate   = null
    this.createDateTime = null
    this.createDT       = null

    this.collection     = collection
    this.requests       = [] // income requests
    this.isRequested    = false // outcome request status
    this.isProcessing   = false // if swap isProcessing

    this._update({
      ...data,
      isMy: data.owner.peer === storage.me.peer,
    })

    this._onMount()
  }

  _onMount() {
    // Someone wants to start swap with you
    room.subscribe('request swap', ({ swapId, participant }) => {
      if (swapId === this.id && !this.requests.find(({ peer }) => peer === participant.user.peer)) {
        this.requests.push(participant)
        this.isRequested = true

        events.dispatch('new order request', {
          swapId,
          participant,
        })
      }
      this.collection._saveMyOrders()
    })
  }

  _update(values) {
    Object.keys(values).forEach((key) => {
      this[key] = values[key]
    })
  }

  update(values) {
    this._update(values)
    this.collection._saveMyOrders()

    events.dispatch('swap update', this, values)
  }

  /**
   *
   * @param callback - awaiting for response - accept / decline
   */
  sendRequest(callback) {
    const self = this

    if (storage.me.peer === this.owner.peer) {
      console.warn('You are the owner of this Order. You can\'t send request to yourself.')
      return
    }

    if (this.isRequested) {
      console.warn('You have already requested this swap.')
      console.log(this.requests)
      return
    }

    this.update({
      isRequested: true,
    })
    
    this.requests.push({ user: storage.me, swapRequestAmount: this.buyRequestAmount, })
    
    this.collection._saveMyOrders()

    room.sendMessage(this.owner.peer, [
      {
        event: 'request swap',
        data: {
          swapId: this.id,
          participant: { user: storage.me, swapRequestAmount: this.buyRequestAmount, },
        },
      },
    ])

    room.subscribe('accept swap request', function ({ swapId }) {
      if (swapId === self.id) {
        this.unsubscribe()

        self.update({
          isProcessing: true,
          isRequested: false,
        })

        callback(true)
      }
    })

    room.subscribe('decline swap request', function ({ swapId }) {
      if (swapId === self.id) {
        this.unsubscribe()

        self.update({
          isRequested: false,
        })

        // TODO think about preventing user from sent requests every N seconds
        callback(false)
      }
    })
  }

  acceptRequest(participantPeer) {
    const participant = this.requests.find(({ user }) => user.peer === participantPeer)

    room.sendMessage(participantPeer, [
      {
        event: 'accept swap request',
        data: {
          swapId: this.id,
        },
      },
    ])
    
    
    this.requests.map( function ({user}) {
    
      if ( user.peer !== participantPeer ) {
    
        room.sendMessage(user.peer, [
         {
            event: 'decline swap request',
            data: {
              swapId: this.id,
            },
         },
        ])
      }
    })
    
    this.update({
      isRequested: false,
      isProcessing: true,
      participant:participant,
      requests: [],
    })
    
  }
  
  setBuyRequestAmount (value) {
    this.buyRequestAmount = value
  }
  
  getBuyRequestAmount () {
    return this.buyRequestAmount
  }

  declineRequest(participantPeer) {
    let index

    this.requests.some(({ user }, _index) => {
      if (user.peer === participantPeer) {
        index = _index
      }
      return index !== undefined
    })

    const requests = [
      ...this.requests.slice(0, index),
      ...this.requests.slice(index + 1)
    ]

    this.update({
      isRequested: requests.length? true:false,
      requests,
    })

    room.sendMessage(participantPeer, [
      {
        event: 'decline swap request',
        data: {
          swapId: this.id,
        },
      },
    ])
  }
}


export default Order
