$( function() {
		
	$(".post-placement").click( function() {
		window.location = $("a", this).attr("href");
	});

    var container = $('body.home ul')[0];
    console.log(container);
    if(container != undefined) {
        var myPackery = new Packery( container, {
            itemSelector: 'li',
            gutter: 30
        });
        bodyLI = $('body.home ul li').get().reverse();
        fadeIn();
    }

    $('table').tablesorter();

});
