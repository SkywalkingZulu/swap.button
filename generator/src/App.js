import React, { Component } from 'react';

import SelectButtonStyle from './SelectButtonStyle';
import SelectTheme from './SelectTheme';
import GenerateCode from './GenerateCode';
import CryptoMultySelect from './CryptoMultySelect';
import SelectNetwork from './SelectNetwork';
import ShowDebug from './ShowDebug';
import SelectMode from './SelectMode';

class App extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.cryptos_from = React.createRef();
		this.cryptos_to = React.createRef();
		this.network = React.createRef();
		this.debug = React.createRef();
    this.mode = React.createRef();
		
		this.cfg = window.swap_button_generator_cfg;
		
		this.state = {
			buttonStyle : 1,
			themeStyle : 1,
			network : 0,
			debug : 1,
			crypto_from : 0,
			crypto_to : 0,
			cryptos_from : this.cfg.default_pay,
			cryptos_to : this.cfg.default_recive,
      mode : 'orderbook'
		}
		
	}
	swapCrypto() {
		var _from = this.state.crypto_to;
		var _to = this.state.crypto_from;
		if (_from===_to) _from = 0;
		this.crypto_from.current.setState( { active : _from } );
		this.crypto_to.current.setState( { active : _to } );
		this.setState( {
			crypto_from : _from,
			crypto_to : _to
		} );
	}
	checkErrors() {
		if (!this.state.cryptos_from.length) {
			this.cryptos_from.current.setState( { error : true } );
			return true;
		}
		if (!this.state.cryptos_to.length) {
			this.cryptos_to.current.setState( { error : true } );
			return true;
		}
		if (!this.state.network) {
			this.network.current.setState( { error : true } );
			return true;
		}
    if (!this.state.mode) {
      this.mode.current.setState( { error : true } );
    }
		return false;
	}
	addCrypto(side,key) {
		if (key===-1) {
			this.setState( function (prevstate) {
				var all_ids = [];
				
				
				for (var i = 0 ; i<this.cfg.cryptos.length; i++) {
					all_ids.push( this.cfg.cryptos[i].id );
				}
				prevstate[(side==='from') ? 'cryptos_from' : 'cryptos_to'] = all_ids;
				this[[(side==='from') ? 'cryptos_from' : 'cryptos_to']].current.setState( {
					active : prevstate[(side==='from') ? 'cryptos_from' : 'cryptos_to']
				} );
				return prevstate;
			});
		} else {
			if (this.state[(side==='from') ? 'cryptos_from' : 'cryptos_to'].indexOf(key)===-1) {
				this.setState( function (prevstate) {
					var indexAll = prevstate[(side==='from') ? 'cryptos_from' : 'cryptos_to'].indexOf(-1);
					if (indexAll !== -1) prevstate[(side==='from') ? 'cryptos_from' : 'cryptos_to'].splice(indexAll, 1);
					prevstate[(side==='from') ? 'cryptos_from' : 'cryptos_to'].push( key );
					this[[(side==='from') ? 'cryptos_from' : 'cryptos_to']].current.setState( {
						active : prevstate[(side==='from') ? 'cryptos_from' : 'cryptos_to']
					} );
					return prevstate;
				} );
			}
		}
	}
	delCrypto(side,key) {
		if (key!==-1) {
			this.setState( function (prevstate) {
				var index = prevstate[(side==='from') ? 'cryptos_from' : 'cryptos_to'].indexOf(key);
				if (index !== -1) prevstate[(side==='from') ? 'cryptos_from' : 'cryptos_to'].splice(index, 1);
				this[[(side==='from') ? 'cryptos_from' : 'cryptos_to']].current.setState( {
					active : prevstate[(side==='from') ? 'cryptos_from' : 'cryptos_to']
				} );
				return prevstate;
			} );
		} else {
			this.setState( function (prevstate) {
				prevstate[(side==='from') ? 'cryptos_from' : 'cryptos_to'] = [];
				this[[(side==='from') ? 'cryptos_from' : 'cryptos_to']].current.setState( {
					active : []
				} );
				return prevstate;
			} );
		}
	}
	updateCrypto(id,side) {
		if (side==='from') {
			if (id===this.crypto_to.current.state.active) {
				this.crypto_to.current.setState( { active : this.state.crypto_from } );
			}
			this.crypto_from.current.setState( { active : id } );
			this.setState( { crypto_from : id } );
		} else {
			if (id===this.crypto_from.current.state.active) {
				this.crypto_from.current.setState( { active : this.state.crypto_to } );
			}
			this.crypto_to.current.setState( { active : id } );
			this.setState( { crypto_to : id } );
		}
	}
	getConfig() {
		return this.cfg;
	}
	getCryptoByID(id) {
		if (!id) {
			return {
				id : 0,
				title : 'Select crypto'
			}
		}
		for (var k in this.cfg.cryptos) {
			if (this.cfg.cryptos[k].id===id) return this.cfg.cryptos[k];
		}
		
	}
	render() {
		return (
			<div>
				<div className="w3-container">
					<h2>Swap Button Generator</h2>
				</div>
				<div className="w3-row">
					<div className="w3-container w3-padding-16 w3-half">
						<label>Users pay</label>
						<CryptoMultySelect ref={this.cryptos_from} side="from" App={this} />
					</div>
					<div className="w3-container w3-padding-16 w3-half">
						<label>Users recive</label>
						<CryptoMultySelect ref={this.cryptos_to} side="to" App={this} />
					</div>
				</div>
				<div className="w3-row">
					<div className="w3-container w3-padding-16 w3-half">
						<label>Select button style</label>
						<SelectButtonStyle App={this} />
					</div>
					<div className="w3-container w3-padding-16 w3-half">
						<label>Select popup window theme</label>
						<SelectTheme App={this} />
					</div>
				</div>
				<div className="w3-row">
					<div className="w3-container w3-padding-16 w3-half">
						<label>Select network</label>
						<SelectNetwork ref={this.network} App={this} />
					</div>
					<div className="w3-container w3-padding-16 w3-half">
						<label>Show debug panel</label>
						<ShowDebug ref={this.debug} App={this} />
					</div>
				</div>
        <div className="w3-row">
          <div className="w3-container w3-padding-16 w3-half">
            <label>Select mode</label>
            <SelectMode ref={this.mode} App={this} />
          </div>
        </div>
				<GenerateCode App={this} />
			</div>
		);
	}
}

export default App;
