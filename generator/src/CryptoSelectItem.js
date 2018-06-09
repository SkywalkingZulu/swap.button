import React, { Component } from 'react';

class CryptoSelectItem extends Component {
	constructor(props) {
		super(props);
		this.RootApp = props.App;
		this.parent = props.parent;
		this.props = props;
		this.state = this.props;
		this.id = props.id;
		this.cfg = this.RootApp.getConfig();
		this.onClick = this.onClick.bind(this);
	}
	onClick() {
		if (this.props.selected) return;
		this.RootApp.updateCrypto( this.id , this.props.side );
		
		this.parent.setState( { 
			opened : false
		});
	}
	render() {
		return (
			<div onClick={this.onClick}>{this.state.title}</div>
		);
	}
}

export default CryptoSelectItem;
