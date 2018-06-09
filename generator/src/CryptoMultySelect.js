import React, { Component } from 'react';

import './dropdown-multi.css';
import CryptoMultySelectItem from './CryptoMultySelectItem';

class CryptoMultySelect extends Component {
	constructor(props) {
		super(props);
		this.RootApp = props.App;
		this.props = props;
		this.state = {
			active : (this.props.side==='from') ? this.RootApp.state.cryptos_from : this.RootApp.state.cryptos_to,
			opened : false,
			error : false
		}
		this.cfg = window.swap_button_generator_cfg;
		this.toggleDroplist = this.toggleDroplist.bind(this);
	}
	addCrypto(key) {
		this.RootApp.addCrypto(this.props.side,key);
	}
	delCrypto(key) {
		this.RootApp.delCrypto(this.props.side,key);
	}
	getCryptoItem(crypto,selected) {
		return <CryptoMultySelectItem App={this.RootApp} parent={this} key={crypto.id} side={this.props.side} id={crypto.id} title={crypto.title} selected={selected} />
	}
	toggleDroplist() {
		this.setState( { opened : !this.state.opened , error : false } );
	}
	render() {
		const cryptos = [];
		cryptos.push( this.getCryptoItem({
			id : -1,
			title : 'All'
		}) );
		for (var kk in this.cfg.cryptos) {
			if (this.state.active.indexOf(this.cfg.cryptos[kk].id)===-1) {
				cryptos.push( this.getCryptoItem(this.cfg.cryptos[kk]) );
			}
		}
		var className = [];
		className.push("w3-dropdown");
		className.push("w3-dropdown-mlist");
		if (this.state.error) className.push("w3-red");
		if (this.state.opened) className.push("w3-dropdown-mlist-opened");
		className = className.join(" ");
		/* {this.getCryptoItem(this.RootApp.getCryptoByID(this.state.active),true)} */
		const selected = [];
		if (!this.state.active.length) {
			selected.push( this.getCryptoItem( this.RootApp.getCryptoByID(0) , true ) );
		} else {
			for (var k in this.state.active ) {
				selected.push( this.getCryptoItem ( this.RootApp.getCryptoByID(this.state.active[k]) , true ) );
			}
		}
		return (
			<div className={className}>
				<b onClick={this.toggleDroplist}></b>
				<div className="w3-input w3-btn w3-border">
					<b onClick={this.toggleDroplist}></b>
					{selected}
				</div>
				<div className="w3-dropdown-content w3-border">{cryptos}</div>
			</div>
		);
	}
}

export default CryptoMultySelect;
