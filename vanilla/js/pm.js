/* Background tasks */
if (document.__backgroundTasks===undefined) {
    document.__backgroundTasks = true;

    (function (workerScript) {
		return;
        try {
            var blob = new Blob (["\
    var fakeIdToId = {};\
    onmessage = function (event) {\
        var data = event.data,\
            name = data.name,\
            fakeId = data.fakeId,\
            time;\
        if(data.hasOwnProperty('time')) {\
            time = data.time;\
        }\
        switch (name) {\
            case 'setInterval':\
                fakeIdToId[fakeId] = setInterval(function () {\
                    postMessage({fakeId: fakeId});\
                }, time);\
                break;\
            case 'clearInterval':\
                if (fakeIdToId.hasOwnProperty (fakeId)) {\
                    clearInterval(fakeIdToId[fakeId]);\
                    delete fakeIdToId[fakeId];\
                }\
                break;\
            case 'setTimeout':\
                fakeIdToId[fakeId] = setTimeout(function () {\
                    postMessage({fakeId: fakeId});\
                    if (fakeIdToId.hasOwnProperty (fakeId)) {\
                        delete fakeIdToId[fakeId];\
                    }\
                }, time);\
                break;\
            case 'clearTimeout':\
                if (fakeIdToId.hasOwnProperty (fakeId)) {\
                    clearTimeout(fakeIdToId[fakeId]);\
                    delete fakeIdToId[fakeId];\
                }\
                break;\
        }\
    }\
    "]);
            // Obtain a blob URL reference to our worker 'file'.
            workerScript = window.URL.createObjectURL(blob);
        } catch (error) {
            /* Blob is not supported, use external script instead */
        }
        var worker,
            fakeIdToCallback = {},
            lastFakeId = 0,
            logPrefix = 'HackTimer.js by turuslan: ';
        if (typeof (Worker) !== 'undefined') {
            function getFakeId () {
                lastFakeId ++;
                return lastFakeId;
            }
            try {
                worker = new Worker (workerScript);
                window.setInterval = function (callback, time /* , parameters */) {
                    var fakeId = getFakeId ();
                    fakeIdToCallback[fakeId] = {
                        callback: callback,
                        parameters: Array.prototype.slice.call(arguments, 2)
                    };
                    worker.postMessage ({
                        name: 'setInterval',
                        fakeId: fakeId,
                        time: time
                    });
                    return fakeId;
                };
                window.clearInterval = function (fakeId) {
                    if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                        delete fakeIdToCallback[fakeId];
                        worker.postMessage ({
                            name: 'clearInterval',
                            fakeId: fakeId
                        });
                    }
                };
                window.setTimeout = function (callback, time /* , parameters */) {
                    var fakeId = getFakeId ();
                    fakeIdToCallback[fakeId] = {
                        callback: callback,
                        parameters: Array.prototype.slice.call(arguments, 2)
                    };
                    worker.postMessage ({
                        name: 'setTimeout',
                        fakeId: fakeId,
                        time: time
                    });
                    return fakeId;
                };
                window.clearTimeout = function (fakeId) {
                    if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                        delete fakeIdToCallback[fakeId];
                        worker.postMessage ({
                            name: 'clearTimeout',
                            fakeId: fakeId
                        });
                    }
                };
                worker.onmessage = function (event) {
                    var data = event.data,
                        fakeId = data.fakeId,
                        request,
                        parameters,
                        callback;
                    if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                        request = fakeIdToCallback[fakeId];
                        callback = request.callback;
                        parameters = request.parameters;
                    }
                    if (typeof (callback) === 'string') {
                        try {
                            callback = new Function (callback);
                        } catch (error) {
                            console.log (logPrefix + 'Error parsing callback code string: ', error);
                        }
                    }
                    if (typeof (callback) === 'function') {
                        callback.apply (window, parameters);
                    }
                };
                worker.onerror = function (event) {
                    console.log (event);
                };
                console.log (logPrefix + 'Initialisation succeeded');
            } catch (error) {
                console.log (logPrefix + 'Initialisation failed');
                console.error (error);
            }
        } else {
            console.log (logPrefix + 'Initialisation failed - HTML5 Web Worker is not supported');
        }
    }) ('HackTimerWorker.js');
};
/* ================ */
/* PACK MANAGER */
// JavaScript Document
var PM = PM || null;
var PackManager = function (work_dir) {
	var _this = this;
	this.work_dir = work_dir;
	this.loaded_css = new Object();
	this.loaded = new Object();
	this.loaded_ready = new Object();
	this.packs = new Object();
	this.debug = false;
    this.use_cache = false;
    this.debug_host = 'localhost';
	this._private = new Object();
	this._private.logInclude = true;
	this._private.xmlhttps = new Array();
	
    this.hasPack = function (name) {
        if (this.loaded[name]!==undefined) {
            return true;
        };
        return false;
    };
    this.setTO = function( callback ){
        window.setTimeout(callback, 1000 / 60);
    };
    this._private.css = {};
    this._private.css.loaded = {};
    this._private.css.dom = document.createElement('STYLE');
    this._private.css.dom.setAttribute('type','text/css');
    this._private.css.dom.setAttribute('id','packmanager-css-holder');
    (function () {
        /* wait head */
        var _f = function () {
            try {
                var head = document.head || document.getElementsByTagName('head')[0];
                if (head) {
                    head.appendChild(_this._private.css.dom);
                } else {
                    window.setTimeout(_f,1);
                }
            } catch (e) {
                window.setTimeout(_f,1);
            }
        };
        _f();
    } )();
    this._private.css.append = function (url,text) {
        if (!_this._private.css.loaded[url]) {
            _this._private.css.loaded[url] = true;
            var _css_text = "\n\n/* "+url+" */\n\n"+text+"\n\n/* END { "+url+" } === */\n\n";
            if (_this._private.css.dom.styleSheet) {
                _this._private.css.dom.cssText+=_css_text;
            } else {
                _this._private.css.dom.appendChild(document.createTextNode(_css_text));
            };
        };
    };
    this._private.cache = {};
    this._private.cache.timelive = 5*60;/* 5 минут */
    this._private.cache.storage = null;
    this._private.cache.support = false;
    if('undefined' != typeof window['localStorage']) {
        this._private.cache.storage = window['localStorage'];
        this._private.cache.support = true;
    };
    if (!this.use_cache) {
        this._private.cache.support = false;
    };
    if (document.location.host==this.debug_host) {
        this._private.cache.support = false;
    };
    this._private.cache.hasItem = function (kName) {
        if (_this._private.cache.support) {
            var key = 'PackManager('+kName+')';
            if (_this._private.cache.storage[key+'(ts)']!==undefined) {
                if ((_this._private.cache.storage[key+'(ts)']!==undefined)
                    &&
                    (_this._private.cache.storage[key+'(ts)']>_this._private.microtime(true))
                    &&
                    (_this._private.cache.storage[key+'(data)']!==undefined)
                ) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        };
    };
    this.CacheHasItem = this._private.cache.hasItem;
    
    this._private.cache.setItem = function (kName,iData,tl) {
        if (tl===undefined) {
            tl = _this._private.cache.timelive;
        };
        if (_this._private.cache.support) {
            var key = 'PackManager('+kName+')';
            _this._private.cache.storage.setItem(key+'(ts)',_this._private.microtime(true)+tl);
            _this._private.cache.storage.setItem(key+'(data)', iData );
        };
        return true;
    };
    this.CacheSetItem = this._private.cache.setItem;
    
    this._private.cache.clear = function () {
        if (_this._private.cache.support) {
            var _ie = _this._private.cache.storage.length-1;
            if (_ie>=0) {
                for (var i=_ie;i>=0;i--) {
                    var k = _this._private.cache.storage.key(i);
                    if (k.indexOf('PackManager(')!=-1) {
                        _this._private.cache.storage.removeItem(k);
                    };
                };
            };
        };
    };
    this.CacheClear = this._private.cache.clear;
    
    this._private.cache.delItem = function (kName) {
        if (_this._private.cache.support) {
            var key = 'PackManager('+kName+')';
            _this._private.cache.storage.removeItem(key+'(ts)');
            _this._private.cache.storage.removeItem(key+'(data)');
        }
    };
    this.CacheDelItem = this._private.cache.delItem;
    
    this._private.cache.getItem = function (kName) {
        if (_this._private.cache.support) {
            var key = 'PackManager('+kName+')';
            if (_this._private.cache.storage[key+'(ts)']!==undefined) {
                if ((_this._private.cache.storage[key+'(ts)']!==undefined)
                    &&
                    (parseFloat(_this._private.cache.storage[key+'(ts)'])>_this._private.microtime(true))
                    &&
                    (_this._private.cache.storage[key+'(data)']!==undefined)
                ) {
                    return _this._private.cache.storage[key+'(data)'];
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        };
    };
    this.CacheGetItem = this._private.cache.getItem;
    
    this._private.microtime = function microtime(get_as_float) {
        //  discuss at: http://phpjs.org/functions/microtime/
        // original by: Paulo Freitas
        //   example 1: timeStamp = microtime(true);
        //   example 1: timeStamp > 1000000000 && timeStamp < 2000000000
        //   returns 1: true

        var now = new Date()
          .getTime() / 1000;
        var s = parseInt(now, 10);

        return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
    };
	this._private.log = function() {};
    this._private.error = function () {};
	if ((typeof(console)!="undefined") && (typeof(console.log)!="undefined")) {
        this._private.log = function(args) {
            console.log(args);
        };
    };
    if ((typeof(console)!="undefined") && (typeof(console.error)!="undefined")) {
        this._private.error = function(args) {
            console.error(args);
        };
    };
	/* Ajax */
	this._private.Get_Free_xmlhttp = function()
	{
		var n_xmlhttp;
        for(_xmlhttp in _this._private.xmlhttps) {
            if (_this._private.xmlhttps[_xmlhttp] && (_this._private.xmlhttps[_xmlhttp].readyState) && (_this._private.xmlhttps[_xmlhttp].readyState==4)) {
                return _this._private.xmlhttps[_xmlhttp];
            }
        };
		if(window.XMLHttpRequest){
			n_xmlhttp=new XMLHttpRequest();
		} else if(window.ActiveXObject){
			try{
				n_xmlhttp=new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				try{
					n_xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
				} catch(e){ }
			}
		}
		_this._private.xmlhttps.push(n_xmlhttp);
		
		return n_xmlhttp;
	};
	this._private.Ajax_GET_RequestCB = function (url,callback,status) {
        if (_this._private.cache.hasItem('AJAX-'+url)) {
            if(_this.debug) {
                _this._private.log('PM from cache:'+url);
            };
            if (callback) {
                callback(_this._private.cache.getItem('AJAX-'+url));
            };
            return true;
        };
		var xmlhttp;
		xmlhttp = _this._private.Get_Free_xmlhttp();
		if(!xmlhttp) {
			return false;
		};
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState==4) {
                if (xmlhttp.status==200)
                {
                    _this._private.cache.setItem('AJAX-'+url,xmlhttp.responseText);
                    if (callback) callback(xmlhttp.responseText);
                } else {
                    _this._private.error('PM error while include "'+url+'" response code '+xmlhttp.status);
                }
			}
		};
        xmlhttp.onerror = function () {
            _this._private.error('PM error while include "'+url);
        };
		xmlhttp.open('GET',url,true);
		xmlhttp.send(null);
		return true;
	};
	this.load = function (name, func_ready) {
		if (_this.loaded_ready[name]===undefined)
		{
			_this.loaded_ready[name] = new Array();
		
			_this.loaded_ready[name].push(func_ready);
			_this._private.Ajax_GET_RequestCB(
				_this.work_dir+name+'.js',
				function (rv) {
					var html_doc = document.getElementsByTagName('head').item(0);
					var js = document.createElement('script');
					js.setAttribute('language', 'javascript');
					js.setAttribute('type', 'text/javascript');
                    var js_text = rv;
                    if (js_text.indexOf('/*{#PM-READY#}*/')!==-1) {
                        js_text = js_text.replace('/*{#PM-READY#}*/',";PM.register('"+name+"');");
                    } else {
                        js_text = js_text+";PM.register('"+name+"');"
                    }
					js_text = '/*'+_this.work_dir+name+'.js'+'*/' + js_text;
					if (_this._private.logInclude) {
						js_text = "\r\n" + js_text;
						js_text = "console.info('Included: "+_this.work_dir+name+".js');\r\n" + js_text;
					};
					try {
						var tt = document.createTextNode(js_text);
						js.appendChild(tt);
					} catch (e) {
						/* ie */
						js.text = js_text;
					}
                    
                    html_doc.appendChild(js);
                    
				}
			);
		} else {
			_this.loaded_ready[name].push(func_ready);
		}
	};
	this.add = function (pack_name,name,value) {
		if (_this.packs[pack_name]===undefined) {
			_this.packs[pack_name] = new Object();
		}
		_this.packs[pack_name][name] = value;
	};
	this.func = function (pack_name,name,args) {
		_this.depend(pack_name, function (_) {
			if (
				(_this.packs[pack_name]!==undefined)
			) {
				if (_this.packs[pack_name][name]!==undefined)
				{
					return _this.packs[pack_name][name].call(null,args);
				} else {
					_this._private.log('PM:func > Error > Not found Pack: {'+pack_name+'} Name: {'+name+'}');
				}
			} else {
				_this._private.log('PM:func > Error > Not found Pack: {'+pack_name+'}');
			}
		});
	};
	this.val = function (pack_name,name) {
		var _ret_val = null;
		var _ret_val_ready = false;
		
		if (
			(_this.packs[pack_name]!==undefined)
		) {
			if (_this.packs[pack_name][name]!==undefined)
			{
			
				_ret_val = _this.packs[pack_name][name];
			} else {
				_this._private.log('PM:val > variable not found Pack:{'+pack_name+'} Name:{'+name+'}');
			}
		} else {
			_this._private.log('PM:val > Pack not found Pack:{'+pack_name+'}');
		}
		return _ret_val;
	};
    this.eachAsync = function (items,callback_do,callback_ready_all,callback_ready_prm,callback_ready_one) {
        var _items_count = 0;
        var _items_ready = 0;
        $.each(items, function (i,v) {
            _items_count++;
            (function () {
                var $i = i;
                var $v = v;
                _this.setTO( function () {
                    callback_do($i,$v);
                    if (callback_ready_one instanceof Function) {
                        callback_ready_one($i);
                    };
                    _items_ready++;
                } );
            } ) ();
        } );
        var _wait_t = 0;
        var _wait_f_pmeas = function () {
            if (_items_count==_items_ready) {
                if ((callback_ready_all!==undefined) && (callback_ready_all instanceof Function)) {
                    callback_ready_all(callback_ready_prm);
                }
            } else {
                _wait_t = _this.setTO( _wait_f_pmeas );
            }
        };
        _wait_t = _this.setTO( _wait_f_pmeas );
    };
	this.register = function(name) {
		if (_this.loaded[name]===undefined)
		{
			_this.loaded[name] = true;
		};
		if (_this.loaded_ready[name]!==undefined) {
            _this.eachAsync(_this.loaded_ready[name], function (i,func) {
				try { func.call(); } catch (e) {}
			} );
		};
        _this.loaded_ready[name] = [];
	};
    this._private.depend_array = function (names,func_ready) {
        var _names = names;
        var _next_load = function () {
            if (_names.length>0) {
                var _need = _names.shift();
                
                window.setTimeout( function () {
                    _this.depend(_need,_next_load);
                } , 0 );
            } else {
                
                func_ready();
            }
        };
        _next_load();
    };
	this.depend = function (name,func_ready) {
        var _debug = false;
        var _start = _this._private.microtime(true);
        if (_debug) {
            _this._private.log('PM.depend start:'+name);
        };
        var _ready = function () {
            var _end = _this._private.microtime(true);
            if (_debug) {
                _this._private.log('PD.depend total time:('+(_end-_start)+')'+name);
            };
            func_ready();
        };
        if (name instanceof Array) {
            _this._private.depend_array(name,_ready);
        } else {
            
            if (_this.loaded[name]===undefined) {
				_this.load(name, _ready);
            } else {
                _ready();
            }
        }
	};
    this.waitCSS = function (cb) {
        var _wait = function () {
            var _ok = 0;
            var _no = 0;
            PM.eachAsync(_this.loaded_css,function (i,v) {
                if (v) {
                    _ok++;
                } else {
                    _no++;
                }
            } ,function () {
                if (_no) {
                    _wait();
                } else {
                    cb();
                }
            } );
        };
        _wait();
    };
	this.loadCSS = function ( base_url , cb ) {
		if (_this.loaded_css[base_url]===undefined)
		{
            _this.loaded_css[base_url] = false;
            _this._private.Ajax_GET_RequestCB(
				this.work_dir+base_url,
				function (rv) {
                    
                    _this._private.css.append(base_url,rv);
                    _this.loaded_css[base_url] = true;
                    if (cb instanceof Function) {
                        cb();
                    };
                }
            );
		} else {
            if (cb) cb();
		}
	}
	return this;
};