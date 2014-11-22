// Constants
slideshowPadding = 10;
captionMargin = 10;

$(document).ready(function(){
	images = [];
	index = 0;
	
	// Pull local JSON file of images
	$.getJSON("data/images.json", function(json){
		if(json.status.code == "200") {
			$.each(json.results, function(i, image){
				insertedImage = $("<img>").appendTo(".slideshow .image")
					.attr("src", "http://www.post-gazette.com" + image.url)
					.attr("alt", image.caption)
					.attr("credit", image.credit);
				images.push(insertedImage);
			});
			
			$("body").imagesLoaded(function(){
			
				activateImage(images[0]);
				
				$(".nav").click(function(){
					if( $(this).hasClass("right") && index < images.length - 1 ){
						index++;
					}
					else if( $(this).hasClass("left") && index > 0 ){
						index--;
					}
					console.log(index);
					activateImage(images[index]);
				});
			});	
			
		} else {
			console.log("Error: " + json.status.description);
		}
	});

});

function activateImage(image, caption){
	$(".slideshow img").removeClass("visible");
	image.addClass("visible");
	$(".caption").html(image.attr("alt") + "<div class='credit'>" + image.attr("credit") + "</div>");
	resizeImage(image);
	$(window).on("resize", function(){ resizeImage(image) });
}

function resizeImage(image) {

		// If image is horizontal
		if( image.width() / image.height() > 1 ){	
			image.width( $(window).width() - ( 2 * slideshowPadding ) );
			image.css("height", "auto");
		}
		// If image is vertical
		else {
			image.height( $(window).height() - ( 2 * slideshowPadding ) - $(".caption").height() - captionMargin );
			image.css("width", "auto");
		}
		
		// Realign caption with bottom of the thing
		$(".caption").css("bottom", slideshowPadding + "px");
		
		if( image.height() + $(".caption").height() + captionMargin > $(window).height() ){
			image.css("width", "auto");
			for( i=1; i<=3; i++ ){
				image.height( $(window).height() - $(".caption").height() - captionMargin - (2 * slideshowPadding) );
			}
		}
		// Center image
		image.css("margin-top", ($(window).height() - image.height() - $(".caption").height() - captionMargin) / 2 + "px");
		
		// Center forward-back buttons vertically
		$(".nav").css( "line-height", $(window).height() + "px" );
}