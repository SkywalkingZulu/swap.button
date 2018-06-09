window.swap_button_generator_cfg = {
	button_code : (function () {
			const button_code = function () {
				/*<<<<
				<script type="text/javascript">
				(function() {
					if (!window.swapbutton_init) {
						window.swapbutton_init = true;
						
						const head = document.getElementsByTagName("HEAD")[0];
						window.head = head;
						
						var include = function (tag,attrs) {
							var node = document.createElement(tag);
							for (var k in attrs) {
								if (attrs.hasOwnProperty(k)) {
									node[k] = attrs[k];
								}
							};
							head.appendChild(node);
						};
						include("LINK",{
							href : "{%host_url%}/button/style{%button_style%}.css",
							type : "text/css",
							rel : "stylesheet"
						});
						include("SCRIPT", {
							type : "text/javascript",
							src : "{%host_url%}/core.js"
						});
						include("SCRIPT", {
							type : "text/javascript",
							src : "{%host_url%}/button.js"
						});
					};
					document.write("<a href=\"#\" data-json=\"{%json%}\" class=\"swap-online-button\">Swap.Online</a>");
				}) ();
				</script>
				>>>>*/
				
			};
			var templ = button_code.toString();
			const begin_char = "/*<<<<";
            const begin = templ.indexOf('/*<<<<');
            const end = templ.indexOf('>>>>*/');
			templ = templ.substring(begin+begin_char.length,end);
            return templ;
			
				})(),
	cryptos : [
		{
			id		: 'BTC',
			title	: 'BitCoin'
		},
		{
			id		: 'ETH',
			title	: 'Etherium'
		},
		{
			id		: 'ETHTOKEN',
			title	: 'ERC20:NOXON'
		}
	],
	button_styles: [
		{
			id		: 0,
			title	: 'Default',
			hidden	: true
		},
		{
			id		: 1,
			title 	: 'Inline'
		},
		{
			id		: 2,
			title	: 'Vertical fixed left',
		},
		{
			id		: 3,
			title	: 'Vertical fixed right'
		},
		{
			id		: 4,
			title	: 'Fixed right-bottom'
		},
		{
			id		: 5,
			title	: 'Fixed left-bottom'
		},
		{
			id		: 6,
			title	: 'Fixed right-top'
		},
		{
			id		: 7,
			title	: 'Fixed left-top'
		}
		
	],
	themes : [
		{
			id		: 0,
			title 	: 'Default',
			hidden	: true
		},
		{
			id		: 1,
			title	: 'Default (white)'
		},
		{
			id		: 2,
			title 	: 'Gray'
		},
		{
			id		: 3,
			title 	: 'Black'
		}
	],
	default_url : '/swapbutton/',
	host_url : 'https://shendel.github.io/swap.online.loader'
}