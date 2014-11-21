
$(document).ready(function(){
	// Pull local JSON file of images
	$.getJSON("data/images.json", function(json){
		if(json.status.code == "200") {
			$.each(json.results, function(i, image){
				$("<img>").appendTo(".slideshow .image")
					.attr("src", "http://www.post-gazette.com" + image.url);
			});
		} else {
			console.log("Error: " + json.status.description);
		}
	});

});