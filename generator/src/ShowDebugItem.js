import React, { Component } from 'react';

class ShowDebugItem extends Component {
	constructor(props) {
		super(props);
		this.RootApp = props.App;
		this.parent = props.parent;
		this.props = props;
		this.state = this.props;
		this.id = props.id;
		this.onClick = this.onClick.bind(this);
	}
	onClick() {
		if (this.props.selected) return;
		this.RootApp.setState( { debug : this.id } );
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

export default ShowDebugItem;
