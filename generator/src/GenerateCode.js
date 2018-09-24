import React, { Component } from 'react';

class GenerateCode extends Component {
	constructor(props) {
		super(props);
		this.RootApp = props.App;
		this.props = props;
		this.state = {
			generated : false,
			jsCode : ''
		}
		this.jsTextArea = React.createRef();
		this.onClickGenerate = this.onClickGenerate.bind(this);
		this.doSelect = this.doSelect.bind(this);
	}
	onClickGenerate() {
		if (this.RootApp.checkErrors()) {
			this.setState( { generated : false } );
			return;
		}
		var js_code = this.RootApp.getConfig().button_code.toString();
		js_code = this.prepareJSCode(js_code);
		this.setState( { 
			generated : true,
			jsCode : js_code
		} );
	}
	prepareJSCode(inCode) {
		var json = [
      this.RootApp.state.cryptos_from,
      this.RootApp.state.cryptos_to,
      this.RootApp.state.themeStyle,
      this.RootApp.state.network,
      this.RootApp.state.debug,
      this.RootApp.state.mode
    ];
		json = JSON.stringify(json).split("\"").join("'");
		
		inCode = inCode.split(String.fromCharCode(9)).join("");
		inCode = inCode.split(String.fromCharCode(10)).join("");
		inCode = inCode.split(String.fromCharCode(13)).join("");
		inCode = inCode.split("{%button_style%}").join(this.RootApp.state.buttonStyle);
		inCode = inCode.split("{%popup_theme%}").join(this.RootApp.state.themeStyle);
		inCode = inCode.split("{%crypto_from%}").join(this.RootApp.state.crypto_from);
		inCode = inCode.split("{%crypto_to%}").join(this.RootApp.state.crypto_to);
		inCode = inCode.split("{%crypto_from_title%}").join(this.RootApp.getCryptoByID(this.RootApp.state.crypto_from).title);
		inCode = inCode.split("{%crypto_to_title%}").join(this.RootApp.getCryptoByID(this.RootApp.state.crypto_to).title);
		inCode = inCode.split("{%json%}").join(json);
		inCode = inCode.split("{%host_url%}").join(this.RootApp.getConfig().host_url);
		return inCode;
	}
	doSelect() {
		this.jsTextArea.current.setSelectionRange(0, this.jsTextArea.current.value.length );
	}
	onChangeNull() {}
	renderCode() {
		if (!this.state.generated) return null;
		var generatedCode = <textarea ref={this.jsTextArea} readOnly="true" onFocus={this.doSelect} onChange={this.onChangeNull} className="w3-input w3-border" value={this.state.jsCode}></textarea>
		return (
			<div key="row-2" className="w3-container w3-row">
				<h3>Install instruction</h3>
				<p>Place this JavaScript code on pages of your site</p>
				{generatedCode}
				
			</div>
		)
	}
	render() {
		const render_rows = [];
		render_rows.push( (
			<div key="row-1" className="w3-container w3-center w3-padding-16">
				<button className="w3-btn w3-green" onClick={this.onClickGenerate}>Generate Swap Button Code</button>
			</div>
		) );
		render_rows.push( this.renderCode() );
		return render_rows;
	}
}

export default GenerateCode;
