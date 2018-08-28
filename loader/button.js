/* --- MiniCore --- */
function miniCoreObject() {
    this.worldCont = null;
    var ua = navigator.userAgent.toLowerCase();
    this.isSecure = window.location.href.toLowerCase().indexOf("https") === 0;
    this.zIndexMax = 1000001;
    this.uid_counter = 0;
    try {
        this.window = window.self;
        this.document = this.window.document;
    } catch (e) {}
    this.MaxZOrder = function(cont, cmax) {
        this.zIndexMax++;
        return this.zIndexMax;
    }
    this.$ = function(id) {
        if (id instanceof Object) return this.MakeFW(id);
        if (id instanceof Array) {
            var rv = new Array();
            for (e in id) {
                var o = this.MakeFW(document.getElementById(id[e]));
                rv.push(o);
            }
            return rv;
        } else {
            return this.MakeFW(document.getElementById(id));
        }
    }
    this.BodyHeight = function() {
        return Math.max(document.compatMode != 'CSS1Compat' ? document.body.scrollHeight : document.documentElement.scrollHeight, this.getViewportHeight());
    }
	this.getViewportHeight = function() {
        return ((document.compatMode || this.isIE) && !this.isOpera) ? (document.compatMode == 'CSS1Compat') ? document.documentElement.clientHeight : document.body.clientHeight : (document.parentWindow || document.defaultView).innerHeight;
    }
    this.addHandler = function(object, event, handler, useCapture) {
        if (object instanceof Array) {
            for (var i in object) {
                this.addHandler(object[i], event, handler, useCapture ? useCapture : false);
            }
        } else {
            if (typeof(object) == 'string') object = miniCore.$(object);
            if (object) {
                if (!object.fxLib) object = _mc.MakeFW(object);
                if (!object.events[event]) {
                    object.events[event] = new Array();
                }
                object.events[event].push(handler);
                if (object.addEventListener) {
                    object.addEventListener(event, handler, useCapture ? useCapture : false);
                } else if (object.attachEvent) {
                    object.attachEvent('on' + event, handler);
                } else alert("Add handler is not supported");
            }
        }
    }
    this.Init = function() {
        this.worldCont = this.B();
    }
    this.Event = function(e) {
        var r = window.event;
        if (!r) r = e;
        if (r) {
            if (r.target == undefined) {
                if (r.srcElement) r.target = r.srcElement;
                if (r.currentTarget) r.target = r.currentTarget;
            }
            this.MakeFW(r.target);

            return r;
        }
    }
    this.MakeFW = function(obj) {
        var _miniCore = this;

        if (obj) {
            if (obj.fxLib == undefined) {
                try {
                    obj.fxLib = '1.2.0-mini-slime';
                } catch (e) {
                    return obj;
                }
                var n_uid = 'fxLib_' + _miniCore.uid_counter;
                try {
                    var b_isWinDoc = false;
                    if (_mc.isIE || _mc.isOpera || _mc.isChrome || _mc.isSafari) {
                        if (_mc.isChrome) {
                            try {
                                if (obj.document) b_isWinDoc = true;
                            } catch (e) {}
                            try {
                                if (obj.location) b_isWinDoc = true;
                            } catch (e) {}
                        } else {
                            if ((obj == _mc.window) || (obj == _mc.document)) b_isWinDoc = true;
                        }
                    } else {
                        if ((obj.toString == '[object HTMLDocument]') || (obj.toString == '[object Window]')) b_isWinDoc = true;
                    }
                } catch (e) {
                    alert(e.message);
                }

                obj.uid = n_uid;
                obj.nName = (this.isIE) ? obj.tagName : obj.nodeName;
                _miniCore.uid_counter++;
                obj.events = new Array();
                obj.sA = function(atr, val) {
                    obj.setAttribute(atr, val);
                    return this;
                }
                obj.gA = function(atr) {
                    return obj.getAttribute(atr);
                }
                obj.classAdd = function(newClass) {
					var classes = obj.className.split(" ");
					if (classes.indexOf(newClass===-1)) {
						classes.push(newClass);
						obj.className = classes.join(" ");
					}
                }
				obj.classHas = function (cls) {
					var classes = obj.className.split(" ");
					for (var k in classes) {
						if (classes[k]===cls) return true;
					}
					return false;
				}
				obj.classDel = function (delClass) {
					var classes = obj.className.split(" ");
					var newClasses = [];
					for (var k in classes) {
						if (classes[k]!==delClass) {
							newClasses.push(classes[k]);
						}
					}
					obj.className = newClasses.join(" ");
				}
                obj.classReplace = function(newClass, oldClass) {
					var classes = obj.className.split(" ");
					var newClasses = [];
					for (var k in classes) {
						if ((classes[k]!==newClass) && (classes[k]!==oldClass)) {
							newClasses.push(classes[k]);
						}
					}
					newClasses.push(newClass);
					obj.className = newClasses.join(" ");
					
                }
                obj.e = function(event, func, pp) {
                    _miniCore.addHandler(this, event, func, pp);
                    return this;
                }
                obj.event = obj.e;
                
                obj.a = function(child) {
                    if (child) {
                        try {
                            child.parent = this;
                        } catch (e) {}
                        try {
                            this.appendChild(child);
                        } catch (e) {}
                        return this;
                    }
                }
                obj.append = obj.a;
                obj.toTop = function() {
                    obj.style.zIndex = _mc.MaxZOrder();
                    return this;
                }
            }
        }
        return obj;
    }
}

function wcDOMReady3(func) {
    var already = false;
    var timer = null;
    ready = function() {
        if (!already) {
            if (document && document.getElementsByTagName && document.getElementById && document.body) {
                func();
                window.clearInterval(timer);
                already = true;
            }
        }
    };

    try {
        document.addEventListener("DOMContentLoaded", ready, false);
        document.addEventListener('load', ready, false);
    } catch (e) {
        timer = setInterval(function() {
            if (/loaded|complete/.test(document.readyState)) {
                clearInterval(timer);
                ready();
            }
        }, 10);
    }
    var on_onload = window.onload;
    window.onload = function() {
        if (on_onload) on_onload();
        ready();
    };
};
var miniCore = new miniCoreObject();
var _mc = miniCore;
window._mc = _mc;
window._mc.wcDOMReady3 = wcDOMReady3;
/* --- end MiniCore --- */
/* --- Main Logic --- */
(function () {
	var _do = function () {
		window._mc.wcDOMReady3 ( function () {
			var body = _mc.$(_mc.$(document.getElementsByTagName('BODY')[0]));
			var iframeHolder = null;
			var swapOnlineIframe = null;
			var navigateIframe = function (json) {
				swapOnlineIframe.src = "https://swaponline.github.io/swap.button/vanilla/?"+json+"#/swap.button/swap/build/";
			}
			var createIframe = function (json) {
				var holder = _mc.MakeFW(document.createElement("DIV"));
					holder.classAdd("swap-online-window");
				var holderBG = _mc.MakeFW(document.createElement("DIV"));
					holderBG.classAdd("swap-online-window-background");
					holder.append(holderBG);
				
				var holdifr = _mc.MakeFW(document.createElement("DIV"));
					holdifr.classAdd("swap-online-window-iframe-holder");
					holder.append(holdifr);
				var close = _mc.MakeFW(document.createElement("A"));
					close.classAdd("swap-online-window-close");
					close.innerHTML = "close";
					close.href = "#";
					holder.append(close);
				var iframe = _mc.MakeFW(document.createElement("IFRAME"));
					iframe.src = "https://swaponline.github.io/swap.button/vanilla/?"+json;
					iframe.border = 0;
				
					holdifr.append(iframe);
				iframeHolder = holder;
				swapOnlineIframe = iframe;
				body.append(iframeHolder);
			}
			if (body) {
				window.addEventListener('message', function(e) { 
					if (e.data.swaponlineheight!==undefined) {
						if (swapOnlineIframe) {
							swapOnlineIframe.style.height = e.data.swaponlineheight;
						}
					}
				} );
				body.event('click', function (e) { 
					e = _mc.Event(e);
					if (e.target.classHas('swap-online-window-close')) {
						e.preventDefault();
						swapOnlineIframe.src = "about:blank";
						body.classDel("swap-online-opened");
					}
					if (e.target.classHas('swap-online-button')) {
						console.log("A click");
						console.log(e.target.gA("data-json"));
						e.preventDefault();
						if (iframeHolder===null) {
							createIframe(e.target.gA("data-json"));
						} else {
							navigateIframe(e.target.gA("data-json"));
						}
						body.classAdd("swap-online-opened");
						iframeHolder.toTop();
					}
				});
			}
		} );
	};
	var _wait = function () {
		if (window._mc!==undefined) {
			if (window._mc.wcDOMReady3!==undefined) {
				_do();
				return;
			}
		}
		window.setTimeout(_wait, 100 );
	}
	_wait();
} )();