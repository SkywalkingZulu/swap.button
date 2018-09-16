PM.depend([
	'js/app',
	'js/help.templ'
], function () {
	
	APP.UI = APP.UI || {};
	
	
	APP.UI.Tabs = new Object({
		_p : {
			headerHolder : null,
			contentHolder : null,
			inited : false,
			tabs : [],
			activeTab : null,
			addedBeforeInit : [],
			headerTempl : APP.Help.getTempl( () => {
				/***
				<a href="#" data-id="{#tab.id#}">{#tab.name#}</a>
				***/
			} ),
			contentTempl : APP.Help.getTempl( () => {
				/***
				<div data-id="{#tab.id#}">{#tab.content#}</div>
				***/
			} )
		},
		init : function () {
			APP.Help.AppendStyle( () => {
				/***
				DIV#tabs-holder>HEADER {
					border-bottom: 2px solid #EFEFEF;
				}
				DIV#tabs-holder>HEADER A {
					display: inline-block;
					padding: 5px;
					font-size: 12pt;
				}
				DIV#tabs-holder>HEADER A.-hidden {
					display: none !important;
				}
				DIV#tabs-holder>HEADER A.-active-tab {
					font-weight: bold;
				}
				DIV#tabs-holder>DIV>DIV {
					display: none;
				}
				DIV#tabs-holder>DIV>DIV.-active-tab {
					display: block;
				}
				***/
			} );
			this._p.headerHolder = $('DIV#tabs-holder>HEADER');
			this._p.contentHolder = $('DIV#tabs-holder>DIV');
			this._p.inited = true;
			
			$(document).delegate('DIV#tabs-holder>HEADER A', 'click', function (e) {
				e.preventDefault();
				APP.UI.Tabs.activateTab($(e.target).data('id'));
			} );
			this.lateAddDo();
		},
		lateAddDo : function () {
			let _this = this;
			$.each (this._p.addedBeforeInit, function (i,tabData) {
				_this.add( tabData.name, tabData.content );
			} );
		},
		activateTab : function ( tabID ) {
			if (this._p.activeTab !== tabID ) {
				this._p.headerHolder.find('.-active-tab').removeClass('-active-tab');
				this._p.contentHolder.find('.-active-tab').removeClass('-active-tab');
				this._p.headerHolder.find('[data-id="'+tabID+'"]').addClass('-active-tab');
				this._p.contentHolder.find('[data-id="'+tabID+'"]').addClass('-active-tab');
				this._p.activeTab = tabID;
			}
		},
		updateHeader : function (tabID, newName) {
			this._p.headerHolder.find('[data-id="'+tabID+'"]').html(newName);
		},
		hideTab : function (tabID) {
			this._p.headerHolder.find('[data-id="'+tabID+'"]').addClass('-hidden');
			if (this._p.activeTab===tabID) {
				let notHiddenTab = this._p.headerHolder.find('A:not(.-hidden)');
				if (notHiddenTab.length>0) {
					this.activateTab($(notHiddenTab[0]).data('id'));
				}
			}
		},
		showTab : function (tabID) {
			this._p.headerHolder.find('[data-id="'+tabID+'"]').removeClass('-hidden');
		},
		add : function (name, content, onAdd ) {
			if (this._p.inited) {
				const tabID = APP.Help.getRandomID();
				this._p.headerHolder.append( 
					this._p.headerTempl
						.reset()
						.setObject( 'tab' , {
							id : tabID,
							name : name
						} )
						.getDom()
				);
				const contentDom = this._p.contentTempl
					.reset()
					.setObject( 'tab' , {
						id : tabID,
						content : (content instanceof String) ? content : ''
					} )
					.getDom();
				if (!(content instanceof String)) {
					contentDom.append(content);
				};
				this._p.contentHolder.append( 
					contentDom
				);
				this._p.tabs.push ( { 
					id : tabID,
					name : name
				} );
				if (this._p.activeTab===null) {
					this.activateTab( tabID );
				};
				if (onAdd instanceof Function) {
					onAdd( tabID );
				};
			} else {
				this._p.addedBeforeInit.push ( {
					name : name,
					content : content,
					onAdd : onAdd
				} );
			}
		}
	} );
	$(document).ready( () => { APP.UI.Tabs.init() } );
	/*{#PM-READY#}*/
} );