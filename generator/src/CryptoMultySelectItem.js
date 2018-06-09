import React, { Component } from 'react';

class CryptoMultySelectItem extends Component {
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
		if (this.props.selected) {
			if (this.props.id) {
				this.parent.delCrypto( this.props.id );
			}
			return;
		}
		//this.RootApp.updateCrypto( this.id , this.props.side );
		this.parent.addCrypto( this.props.id );
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

export default CryptoMultySelectItem;
