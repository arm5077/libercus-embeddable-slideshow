
$(document).ready(function(){
	images = [];
	index = 0;
	
	// Pull local JSON file of images
	$.getJSON("data/images.json", function(json){
		if(json.status.code == "200") {
			$.each(json.results, function(i, image){
				insertedImage = $("<img>").appendTo(".slideshow .image")
					.attr("src", "http://www.post-gazette.com" + image.url)
					.attr("alt", image.caption);
				images.push(insertedImage);
			});
			
			activateImage(images[4]);
			
		} else {
			console.log("Error: " + json.status.description);
		}
	});

});

function activateImage(image, caption){
	$(".slideshow img").removeClass("visible");
	$(image).addClass("visible");
	$(".caption").text(image.attr("alt"));
}