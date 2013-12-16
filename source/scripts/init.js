$( function() {

	$("body.home ul").packery({
		itemSelector: 'li',
		gutter: 30
	});
	
	$(".post-placement").click( function() {
		window.location = $("a", this).attr("href");
	});

});