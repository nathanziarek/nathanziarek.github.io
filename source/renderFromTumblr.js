var fs = require("fs"),
	jsdom = require('jsdom'),
	md = require('html-md');;
	
	fs.readFile("../_drafts/Tumblr Backup.html", "utf8", function(a, b){
		jsdom.env(
			b,
		  	["http://code.jquery.com/jquery-1.10.1.min.js"],
			function (errors, window) {
			    window.$(".post").each(function(i,d){
			    	pageHTML = window.$(d).html();
			    	pageDate = new Date(pageHTML.match(/(\w{3}, \d+ \w{3} \d{4} \d{2}:\d{2}:\d{2})/)[0]);
			    	pageTitle = window.$("h2 > a", window.$(d)).text();
			    	pageReference = window.$("h2 > a", window.$(d)).attr("href");
			    	if(pageTitle == '') {
			    		pageTitle = window.$("h2", window.$(d));
			    		window.$("font", pageTitle).remove();
			    		pageTitle = window.$(pageTitle).text().trim();
			    	}
			    	if(pageTitle == '') {
			    		pageTitle = "Blank" + i;
			    	}
			    	pageURL = pageDate.getFullYear() + " " + ("0" + pageDate.getDate()).slice(-2) + " " + ("0" + pageDate.getDate()).slice(-2) + " " + pageTitle;
			    	pageURL = pageURL.toLowerCase().replace(/[^\d\w]+/g, "-");
			    	pageURL = pageURL.replace(/(^-+)|(-+$)/, "");
			    	window.$("h2", pageHTML).remove();
			    	pageMD = md(pageHTML);
			    	pageTags = pageHTML.match(/Tagged with: (.*?)</);
			    	if (pageTags) {
			    		pageTagsArray = pageTags[1].split(", ");
			    		pageTags = "";
			    		for(i=0; i<pageTagsArray.length; i++) {
			    			pageTags += pageTagsArray[i].replace(" ", "-") + " ";
			    		}
			    		pageTags.trim();
			    	}
			    	pageTop = "---\nlayout: article\ntitle: " + pageTitle + "\nexcerpt: \npermalink: " + pageURL;
			    	if(pageTags) { pageTop += "\ncategories: " + pageTags; } 
			    	pageTop += "\npublished: true";
			    	if(pageReference) { pageTop += "\nreference: " + pageReference; }
			    	pageTop += "\nauthor: Nathan Ziarek\n---"
			    	fs.writeFile("../_drafts/" + pageURL + ".md", pageTop + "\n\n" + pageMD);
			    	console.log(i, pageURL);
			    });
			}
		);	
	});
	

/*fs.readFile("../_drafts/Tumblr Backup.html", "utf8", function(a, b){

	console.log("Creating Document");
	var document = jsdom.jsdom(b);
	
	console.log("Creating Window");
	var window = document.createWindow();

	console.log("Loading jQuery");
	jsdom.jQueryify(window, './jquery.js', function() {
		
		console.log("   DOM-ifying HTML");
		window.$('html').html(b);
		
		console.log("   Writing .post Length");
		console.log(window.$('.post').length);
	});
	
});*/