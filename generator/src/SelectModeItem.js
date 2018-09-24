import React, { Component } from 'react';

class SelectModeItem extends Component {
	constructor(props) {
		super(props);
		this.RootApp = props.App;
		this.parent = props.parent;
		this.props = props;
		this.state = this.props;
		this.id = props.id;
		this.cfg = window.swap_button_generator_cfg;
		this.onClick = this.onClick.bind(this);
	}
	onClick() {
		if (this.props.selected) return;
		this.RootApp.setState( { network : this.id } );
		this.parent.setState( { 
			active : this.id,
			opened : false
		});
	}
	render() {
		return (
			<div onClick={this.onClick}>{this.state.title}</div>
		);
	}
}

export default SelectModeItem;
