import React, { Component } from 'react';

import './dropdown.css';
import CryptoSelectItem from './CryptoSelectItem';

class CryptoSelect extends Component {
	constructor(props) {
		super(props);
		this.RootApp = props.App;
		this.props = props;
		this.state = {
			active : (this.props.side==='from') ? this.RootApp.state.crypto_from : this.RootApp.state.crypto_to,
			opened : false,
			error : false
		}
		this.cfg = window.swap_button_generator_cfg;
		this.toggleDroplist = this.toggleDroplist.bind(this);
	}
	getCryptoItem(crypto,selected) {
		return <CryptoSelectItem App={this.RootApp} parent={this} key={crypto.id} side={this.props.side} id={crypto.id} title={crypto.title} selected={selected} />
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
		for (var k in this.cfg.cryptos) {
			cryptos.push( this.getCryptoItem(this.cfg.cryptos[k]) );
		}
		var className = [];
		className.push("w3-dropdown");
		className.push("w3-dropdown-input");
		if (this.state.error) className.push("w3-red");
		if (this.state.opened) className.push("w3-dropdown-input-opened");
		className = className.join(" ");
		return (
			<div className={className}>
				<b onClick={this.toggleDroplist}></b>
				<div className="w3-input w3-btn w3-border" onClick={this.toggleDroplist}>
					{this.getCryptoItem(this.RootApp.getCryptoByID(this.state.active),true)}
					</div>
				<div className="w3-dropdown-content w3-border">{cryptos}</div>
			</div>
		);
	}
}

export default CryptoSelect;
