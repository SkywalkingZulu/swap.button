/***
	Инстория сделок
***/
PM.depend("js/app", function () {
	APP.SwapHistory = {
		_p : {
			inited : false,
			eventInited : false,
			history : { 
				ids : [],
				data : {}
			},
		},
		init : function () {
			console.info( "APP.SwapHistory - init" );
			if (!this._p.inited) {
				/* load history */
				this.loadHistory();
				/* init events */
				this.initEvents();
				console.info( "APP.SwapHistory - inited ");
				this._p.inited = true;
			} else {
				console.info( "APP.SwapHistory - already inited" );
			}
		},
		_trashBox : function () {
			const newData = {};
			for (let orderID in this._p.history.data) {
				if (this._p.history.data[orderID]!==undefined) {
					newData[orderID] = this._p.history.data[orderID];
				}
			};
			this._p.history.data = newData;
		},
		_getSwapData : function (swap) {
			const data = {
				id : swap.id,
				isMy : swap.isMy,
				buyAmount : swap.buyAmount,
				buyCurrency : swap.buyCurrency,
				sellAmount : swap.sellAmount,
				sellCurrency : swap.sellCurrency,
				flow : {
					myBtcAddress : swap.flow.myBtcAddress,
					myEthAddress : swap.flow.myEthAddress,
					state : swap.flow.state,
					_flowName : swap.flow._flowName
				},
				owner : swap.owner,
				participant : swap.participant,
				room : swap.room,
			};
			return data;
		},
		clearHistory : function () {
			this._p.history = {
				ids : [],
				data : {}
			};
			this.saveHistory();
		},
		add : function (orderID, data) {
			if (this._p.history.ids.indexOf(orderID)===-1) {
				this._p.history.data[orderID] = {
					orderID : orderID,
					swap : this._getSwapData(data.swap),
					status : 'PENDING'
				};
				this._p.history.ids.push(orderID);
				this.saveHistory();
			} else {
				console.error("APP.SwapHistory - add - already exists "+orderID);
				console.log(data);
				console.error("-----------------------------------------------");
			}
		},
		del : function (orderID) {
			const orderIndex = this._p.history.ids.indexOf(orderID);
			if (_orderIndex!==-1) {
				this._p.history.ids.splice( orderIndex, 1 );
				this._p.history.data[orderID] = undefined;
				this.saveHistory();
			};
		},
		get : function (orderID) {
			if (this._p.history.ids.indexOf(orderID)!==-1) {
				return this._p.history.data[orderID];
			}
		},
		has : function (orderID) {
			return (this._p.history.ids.indexOf(orderID)!==-1) ? true : false;
		},
		ids : function () {
			return this._p.history.ids;
		},
		list : function () {
			return this._p.history.data;
		},
		setStatus : function (orderID, newStatus, newData) {
			if (this._p.history.data[orderID]!==undefined) {
				this._p.history.data[orderID].status = newStatus;
				if (newData!==undefined) {
					this._p.history.data[orderID].swap = this._getSwapData(newData.swap);
				};
				this.saveHistory();
			}
		},
		saveHistory : function () {
			this._trashBox();
			localStorage.setItem("swaps:history", JSON.stringify( this._p.history ) );
		},
		loadHistory : function () {
			if (localStorage.getItem("swaps:history")) {
				try {
					let tempHistory = JSON.parse( localStorage.getItem("swaps:history") );
					if (tempHistory
						&& (tempHistory.ids!==undefined)
						&& (tempHistory.data!==undefined)
					) {
						this._p.history = tempHistory;
					} else {
						console.error("APP.SwapHistory loadHistory fail - bad data - use default data -> clearHistory" );
						this.clearHistory();
					}
				} catch (e) {
					console.error( "APP.SwapHistory loadHistory fail - use default data -> clearHistory" );
					this.clearHistory();
				}
			} else {
				console.warn( "APP.SwapHistory loadHistory - no data - use default data -> clearHistory")
				this.clearHistory();
			}
		},
		initEvents : function () {
			if (!this._p.eventInited) {
				const _this = this;
				this._p.eventInited = true;
				$(window).bind('SWAP>BEGIN', function (e,data) {
					console.log("APP.SwapHistory begin swap");
					_this.add( data.orderID , data );
				} );
				$(window).bind('SWAP>UPDATE', function (e,data) {
					console.log("APP.SwapHistory update swap status");
					_this.setStatus( data.orderID, data.status, data );
				} );
				$(window).bind('SWAP>RESTORY', function (e,data) {
					console.log("APP.SwapHistory swap restory");
				} );
				$(window).bind('SWAP>FINISHED', function (e,data) {
					console.log("APP.SwapHistory swap finished");
					_this.setStatus( data.orderID, "FINISHED" , data );
				} );
			}
		},
		updateAllStatus : async function () {
			/* async update status */
			new Promise((callback, onerror) => {
				for (let i in this._p.history.ids) {
					let orderID = this._p.history.ids[i];
					let order = APP.CORE.services.orders.getByKey(orderID);
					if (order===undefined) {
						this._p.history.data[orderID].status = "DELETED";
					} else {
						
					}
				};
				this.saveHistory();
				callback("READY");
			} );
		}
	};
	APP.AfterInitCall ( function () {
		APP.SwapHistory.init();
		APP.SwapHistory.updateAllStatus();
	} );
	/*{#PM-READY#}*/
} );