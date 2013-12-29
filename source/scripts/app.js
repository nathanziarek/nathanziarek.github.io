$( function() {
		
	$(".post-placement").click( function() {
		window.location = $("a", this).attr("href");
	});

});