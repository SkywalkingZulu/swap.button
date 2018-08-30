import React, { Component } from 'react';

import './dropdown.css';
import SelectNetworkItem from './SelectNetworkItem';

class SelectNetwork extends Component {
	constructor(props) {
		super(props);
		this.RootApp = props.App;
		this.props = props;
		this.state = {
			active : this.RootApp.state.network,
			opened : false,
			error : false
		}
		this.cfg = this.RootApp.getConfig();
		this.toggleDroplist = this.toggleDroplist.bind(this);
	}
	getNetworkItem(network,selected) {
		return <SelectNetworkItem App={this.RootApp} parent={this} key={network.id} id={network.id} title={network.title} selected={selected} />
	}
	getNetworkByID(id) {
		if (id === 0 ) {
			return {
				id : 0,
				title : 'Select network'
			}
		}
		for (var k in this.cfg.networks) {
			if (this.cfg.networks[k].id===id) return this.cfg.networks[k];
		}
		
	}
	toggleDroplist() {
		this.setState( { opened : !this.state.opened } );
	}
	render() {
		const networks = [];
		
		for (var k in this.cfg.networks) {
			networks.push( this.getNetworkItem(this.cfg.networks[k]) );
		}
		var className = [];
		if (this.state.error) className.push("w3-red");
		className.push("w3-dropdown");
		className.push("w3-dropdown-input");
		if (this.state.opened) className.push("w3-dropdown-input-opened");
		className = className.join(" ");
		return (
			<div className={className}>
				<b onClick={this.toggleDroplist}></b>
				<div className="w3-input w3-btn w3-border" onClick={this.toggleDroplist}>
					{this.getNetworkItem(this.getNetworkByID(this.state.active),true)}
				</div>
				<div className="w3-dropdown-content w3-border">{networks}</div>
			</div>
		);
	}
}

export default SelectNetwork;
