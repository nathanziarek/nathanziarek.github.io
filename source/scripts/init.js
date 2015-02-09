var bodyLI = [];

WebFontConfig = {
	google: {
		families: ['Alegreya+Sans:100,400,700,400italic,700italic']
	},
	active: function() {
        var container = $('body.home ul')[0];
        var myPackery = new Packery( container, {
			itemSelector: 'li',
			gutter: 30
		});
		bodyLI = $('body.home ul li').get().reverse();
		fadeIn();
	}
}

function fadeIn() {
	var elem = bodyLI.pop();
	$(elem).addClass("state-loaded");
	if(bodyLI.length > 0) {
		window.setTimeout(fadeIn, 50);
	}
}
