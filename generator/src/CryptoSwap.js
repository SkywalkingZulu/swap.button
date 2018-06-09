import React, { Component } from 'react';
import './CryptoSwap.css';

class CryptoSwap extends Component {
	constructor(props) {
		super(props);
		this.RootApp = props.App;
		this.onClick = this.onClick.bind(this);
	}
	onClick() {
		this.RootApp.swapCrypto();
	}
	render() {
		return (
			<div className="-swap-button-generator-crypto-swap" onClick={this.onClick}>Swap Crypto type</div>
		);
	}
}

export default CryptoSwap;
