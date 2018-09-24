import React, { Component } from 'react';

import './dropdown.css';
import SelectModeItem from './SelectModeItem';

class SelectMode extends Component {
	constructor(props) {
		super(props);
		this.RootApp = props.App;
		this.props = props;
		this.state = {
			active : this.RootApp.state.mode,
			opened : false,
			error : false
		}
		this.cfg = this.RootApp.getConfig();
		this.toggleDroplist = this.toggleDroplist.bind(this);
	}
	getModeItem(mode,selected) {
		return <SelectModeItem App={this.RootApp} parent={this} key={mode.id} id={mode.id} title={mode.title} selected={selected} />
	}
	getModeByID(id) {
		if (id === 0 ) {
			return {
				id : 0,
				title : 'Select mode'
			}
		}
		for (var k in this.cfg.modes) {
			if (this.cfg.modes[k].id===id) return this.cfg.modes[k];
		}
		
	}
	toggleDroplist() {
		this.setState( { opened : !this.state.opened } );
	}
	render() {
		const modes = [];

		for (var k in this.cfg.modes) {
			modes.push( this.getModeItem(this.cfg.modes[k]) );
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
					{this.getModeItem(this.getModeByID(this.state.active),true)}
				</div>
				<div className="w3-dropdown-content w3-border">{modes}</div>
			</div>
		);
	}
}

export default SelectMode;
