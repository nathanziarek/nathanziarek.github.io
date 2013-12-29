WebFontConfig = {
	google: {
		families: ['Alegreya+Sans:100,400,700,400italic,700italic']
	},
	active: function() {
		$("body.home ul").packery({
			itemSelector: 'li',
			gutter: 30
		}).addClass("state-ready");
	}
};