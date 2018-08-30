import React, { Component } from 'react';

import './dropdown.css';
import ShowDebugItem from './ShowDebugItem';

class ShowDebug extends Component {
	constructor(props) {
		super(props);
		this.RootApp = props.App;
		this.props = props;
		this.state = {
			active : this.RootApp.state.debug,
			opened : false
		};
		this.toggleDroplist = this.toggleDroplist.bind(this);
	}
	getDebugItem(debug,selected) {
		return <ShowDebugItem App={this.RootApp} parent={this} key={debug.id} id={debug.id} title={debug.title} selected={selected} />
	}
	getDebugByID(id) {
		if (id === 0 ) {
			return {
				id : 0,
				title : 'No'
			}
		} else {
			return {
				id : 1,
				title : 'Yes'
			}
		}
	}
	toggleDroplist() {
		this.setState( { opened : !this.state.opened } );
	}
	render() {
		const debug = [];
		debug.push( this.getDebugItem( this.getDebugByID( 0 ) ) );
		debug.push( this.getDebugItem( this.getDebugByID( 1 ) ) );
		
		var className = [];
		
		className.push("w3-dropdown");
		className.push("w3-dropdown-input");
		if (this.state.opened) className.push("w3-dropdown-input-opened");
		className = className.join(" ");
		return (
			<div className={className}>
				<b onClick={this.toggleDroplist}></b>
				<div className="w3-input w3-btn w3-border" onClick={this.toggleDroplist}>
					{this.getDebugItem(this.getDebugByID(this.state.active),true)}
				</div>
				<div className="w3-dropdown-content w3-border">{debug}</div>
			</div>
		);
	}
}

export default ShowDebug;
