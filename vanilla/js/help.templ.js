APP._p.templ_regs = {
	hash : {},
	genhash : function (name) {
		if (APP._p.templ_regs.hash[name]==undefined) {
			APP._p.templ_regs.hash[name] = {
				'{#V#}'     : new RegExp('{#'+name+'#}', "igm")
			};
		};
	},
	cleanhash : function (name) {
		if (APP._p.templ_regs.hash[name]!==undefined) {
			delete APP._p.templ_regs.hash[name];
		};
	},
	set  : function (in_,name,value) {
		this.genhash(name);
		if (value===null) {
			value='';
		};
		
		in_ = in_.replace(APP._p.templ_regs.hash[name]['{#V#}'], value);
		this.cleanhash(name);
		return in_;
	},
	add : function(in_,name,value) {
		this.genhash(name);
		
		in_ = in_.replace(APP._p.templ_regs.hash[name]['{#V#}'], value+'{#'+name+'#}');
		this.cleanhash(name);
		return in_;
	},
	after : function (in_,name,value) {
		this.genhash(name);
		
		in_ = in_.replace(APP._p.templ_regs.hash[name]['{#V#}'], '{#'+name+'#}'+value);
		this.cleanhash(name);
		return in_;
	}
};
APP.Help.getTempl = function (id,html_source) {
	var ret = {};
		if ($.isFunction(id)) {
			var tmpl_begin_s = '{#tmpl-begin#}';
			var tmpl_end_s = '{#tmpl-end#}';
			var tmpl_begin_i = id.toString().indexOf(tmpl_begin_s);
			var tmpl_end_i = id.toString().indexOf(tmpl_end_s);
			if ((tmpl_begin_i!=-1) && (tmpl_end_i!=-1)) {
				ret._html = id.toString().substring(tmpl_begin_i+tmpl_begin_s.length,tmpl_end_i);
			} else {
				tmpl_begin_s = '[#tmpl-begin#]';
				tmpl_end_s = '[#tmpl-end#]';
				tmpl_begin_i = id.toString().indexOf(tmpl_begin_s);
				tmpl_end_i = id.toString().indexOf(tmpl_end_s);
				if ((tmpl_begin_i!=-1) && (tmpl_end_i!=-1)) {
					ret._html = id.toString().substring(tmpl_begin_i+tmpl_begin_s.length,tmpl_end_i);
				}
			}

		} else {
			ret._html = (!html_source) ? $(id).html() : id;
		}
		ret._events = {};
		ret._fnc_binds = {};
		ret._var_binds = {};
		ret._onRenderDom = [];
		ret.onRenderDom = function (fnc) {
			ret._onRenderDom.push(fnc);
		};
		ret.bind_var = function (name,val) {
			ret._var_binds[name] = val;
		};
		ret.bind_func = function(name,fnc) {
			ret._fnc_binds[name] = fnc;
		};
		ret.bind = function(selector,event,cb) {
			if (ret._events[selector]==undefined) {
				ret._events[selector] = {};
			};
			if (ret._events[selector][event]==undefined) {
				ret._events[selector][event] = [];
			};
			ret._events[selector][event].push(cb);
			return this;
		};
		ret._origHtml = ret._html;
		ret.reset = function () {
			this._html = this._origHtml;
			this._events = {};
			this._fnc_binds = {};
			this._onRenderDom = [];
			return this;
		};
		ret._setObject = function (prefix,obj) {
			var $this = this;
			APP.Help.eachF(obj,function (k,value) {
				if(value instanceof Object) {
					$this._setObject(prefix+k+'.',value);
				} else {
					if (!(value instanceof Function)) {
						$this._html = APP._p.templ_regs.set($this._html,prefix+k,value);
					}
				}
			} );
		};
		ret.setCascade = function(obj) {
			var $this = this;
			APP.Help.eachF(obj, function (k,value) {
				if (value instanceof Object) {
					$this.setObject(k,value);
				} else {
					if (!(value instanceof Function)) {
						$this._html = APP._p.templ_regs.set($this._html,k,value);
					}
				}
			} );
			return this;
		};
		ret.setObject = function (prefix,obj) {
			this._setObject(prefix+'.',obj);
			return this;
		};
		ret.setVar = function (name,value) {
			this._html = APP._p.templ_regs.set(this._html,name,value);
			return this;
		};
		ret.addVar = function (name,value) {
			this._html = APP._p.templ_regs.add(this._html,name,value);
			return this;
		};
		ret.afterVar = function (name,value) {
			this._html = APP._p.templ_regs.after(this._html,name,value);
			return this;
		};
		ret.getSource = function () {
			return this._html;
		};
		ret.getPlain = function () {
			_ret = this._html;
			/* {#boo#} */
			_ret = _ret.replace(/\{\#[^\#]*\#\}/igm,'');
			/* [#boo#] */
			_ret = _ret.replace(/\[\#[^\#]*\#\]/igm,'');
			/* {@boo@} */
			_ret = _ret.replace(/\{\@[^\@]*\@\}/igm,'');
			/* [@boo@] */
			_ret = _ret.replace(/\[\@[^\@]*\@\]/igm,'');
			/* {%boo%} */
			_ret = _ret.replace(/\{\%[^\%]*\%\}/igm,'');
			/* [%boo%] */
			_ret = _ret.replace(/\[\%[^\%]*\%\]/igm,'');
			/* [%#boo#%] */
			_ret = _ret.replace(/\[\%\#[^\%]*\#\%\]/igm,'');
			return _ret;
		};
		ret.getDom = function () {
			var _ret = this._html;
			/* {#boo#} */
			_ret = _ret.replace(/\{\#[^\#]*\#\}/igm,'');
			/* [#boo#] */
			_ret = _ret.replace(/\[\#[^\#]*\#\]/igm,'');
			/* {@boo@} */
			_ret = _ret.replace(/\{\@[^\@]*\@\}/igm,'');
			/* [@boo@] */
			_ret = _ret.replace(/\[\@[^\@]*\@\]/igm,'');
			/* {%boo%} */
			_ret = _ret.replace(/\{\%[^\%]*\%\}/igm,'');
			/* [%boo%] */
			_ret = _ret.replace(/\[\%[^\%]*\%\]/igm,'');
			/* [%#boo#%] */
			_ret = _ret.replace(/\[\%\#[^\%]*\#\%\]/igm,'');
			var $dom = $(_ret);
			/* events */
			APP.Help.eachF(this._events, function (sel,events) {
				var _t = $dom;
				if (sel!='ROOT') {
					_t = $($dom.find(sel));
				};
				APP.Help.eachF(events , function (event_type,event_callbacks) {
					APP.Help.eachF(event_callbacks, function (cb_i,event_cb) {
						_t.bind(event_type,event_cb);
					} );
				} );
			} );
			/* bind funcs */
			APP.Help.eachF(this._fnc_binds, function (name,fnc) {
				$dom[0][name] = fnc;
			} );
			APP.Help.eachF(this._onRenderDom ,function (i,fnc) {
				fnc.call($dom);
			} );
			APP.Help.eachF(this._var_binds, function (name,val) {
				$dom[0][name] = val;
			} );
			return $dom;
		};
	return ret;
};