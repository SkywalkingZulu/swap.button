PM.depend([
	'js/app',
], function () {
	APP.UI = APP.UI || {};
	
	APP.UI._initTimerButton = function (button) {
		const origText = button.html();
		let startTime = button.data('cooldown') + 1;
		let timer = 0;
		button.bind('click', function (e) {
			e.preventDefault();
			window.clearTimeout( timer );
		} );
		const timerCB = function () {
			startTime = startTime - 1;
			button.html( origText + "&nbsp;("+startTime+")" );
			if (startTime===0) {
				button.trigger('click');
			} else {
				timer = window.setTimeout( timerCB , 1000 );
			}
		};
		timerCB();
	};
	APP.UI.initTimerButtons = function (holder) {
		let $timer_buttons = $(holder).find('.cooldown');
		$.each($timer_buttons, function (i,timer) {
			APP.UI._initTimerButton($(timer).removeClass('cooldown'));
		} );
	};
	/*{#PM-READY#}*/
} );