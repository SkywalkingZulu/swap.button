import React, { Component } from 'react';

import './dropdown.css';
import SelectThemeItem from './SelectThemeItem';

class SelectTheme extends Component {
	constructor(props) {
		super(props);
		this.RootApp = props.App;
		this.props = props;
		this.state = {
			active : this.RootApp.state.themeStyle,
			opened : false
		}
		this.cfg = this.RootApp.getConfig();
		this.toggleDroplist = this.toggleDroplist.bind(this);
	}
	getThemeItem(theme,selected) {
		if (theme.hidden) return null;
		return <SelectThemeItem App={this.RootApp} parent={this} key={theme.id} id={theme.id} title={theme.title} selected={selected} />
	}
	getThemeByID(id) {
		if (id === 0 ) {
			return {
				id : 0,
				title : 'Select theme'
			}
		}
		for (var k in this.cfg.themes) {
			if (this.cfg.themes[k].id===id) return this.cfg.themes[k];
		}
		
	}
	toggleDroplist() {
		this.setState( { opened : !this.state.opened } );
	}
	render() {
		const themes = [];
		
		for (var k in this.cfg.themes) {
			themes.push( this.getThemeItem(this.cfg.themes[k]) );
		}
		var className = [];
		className.push("w3-dropdown");
		className.push("w3-dropdown-input");
		if (this.state.opened) className.push("w3-dropdown-input-opened");
		className = className.join(" ");
		return (
			<div className={className}>
				<b onClick={this.toggleDroplist}></b>
				<div className="w3-input w3-btn w3-border" onClick={this.toggleDroplist}>
					{this.getThemeItem(this.getThemeByID(this.state.active),true)}
				</div>
				<div className="w3-dropdown-content w3-border">{themes}</div>
			</div>
		);
	}
}

export default SelectTheme;
