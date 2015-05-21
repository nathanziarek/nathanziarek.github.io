var bodyLI = [];

function fadeIn() {
	var elem = bodyLI.pop();
	$(elem).addClass("state-loaded");
	if(bodyLI.length > 0) {
		window.setTimeout(fadeIn, 50);
	}
}
