import React, { Component } from 'react';

import './dropdown.css';
import SelectButtonStyleItem from './SelectButtonStyleItem';

class SelectButtonStyle extends Component {
	constructor(props) {
		super(props);
		this.RootApp = props.App;
		this.props = props;
		this.state = {
			active : this.RootApp.state.buttonStyle,
			opened : false
		}
		this.cfg = window.swap_button_generator_cfg;
		this.toggleDroplist = this.toggleDroplist.bind(this);
	}
	getStyleItem(style,selected) {
		if (style.hidden) return null;
		return <SelectButtonStyleItem App={this.RootApp} parent={this} key={style.id} id={style.id} title={style.title} selected={selected} />
	}
	getStyleByID(id) {
		if (id === 0 ) {
			return {
				id : 0,
				title : 'Select button style'
			}
		}
		for (var k in this.cfg.button_styles) {
			if (this.cfg.button_styles[k].id===id) return this.cfg.button_styles[k];
		}
		
	}
	toggleDroplist() {
		this.setState( { opened : !this.state.opened } );
	}
	render() {
		const styles = [];
		//styles.push( this.getStyleItem( this.getStyleByID(0) ) );
		for (var k in this.cfg.button_styles) {
			styles.push( this.getStyleItem(this.cfg.button_styles[k]) );
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
					{this.getStyleItem(this.getStyleByID(this.state.active),true)}
				</div>
				<div className="w3-dropdown-content w3-border">{styles}</div>
			</div>
		);
	}
}

export default SelectButtonStyle;
