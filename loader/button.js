(function () {
	var _do = function () {
		window._mc.wcDOMReady3 ( function () {
			var body = _mc.$(_mc.$(document.getElementsByTagName('BODY')[0]));
			var iframeHolder = null;
			var swapOnlineIframe = null;
			var navigateIframe = function (json) {
				swapOnlineIframe.src = "https://shendel.github.io/swap.online.loader/index.html#"+json;
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
					iframe.src = "https://prg-expert.ru/swc/build/?param="+json;
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