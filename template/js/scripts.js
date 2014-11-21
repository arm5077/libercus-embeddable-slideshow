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
					.attr("alt", image.caption);
				images.push(insertedImage);
			});
			
			$("body").imagesLoaded(function(){
			
				activateImage(images[0]);
				
				$(".nav").click(function(){
					if( $(this).hasClass("right") && index < images.length ){
						index++;
					}
					else if( index > 0 ){
						index--;
					}
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
	$(".caption").text(image.attr("alt"));
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
			image.height( $(window).height() - ( 2 * slideshowPadding ) );
			image.css("width", "auto");
		}
		
		// Set caption to width of picture (maybe a dumb idea)
		$(".caption").width( image.width() );
		$(".caption").css("margin-top", captionMargin + "px");
		
		if( image.height() + $(".caption").height() > $(window).height() ){
			image.css("width", "auto");
			for( i=1; i<=3; i++ ){
				image.height( $(window).height() - $(".caption").height() - captionMargin - (2 * slideshowPadding) );
				$(".caption").width( image.width() );
			}
		}
		
		// Center image
		image.css("margin-top", ($(window).height() - image.height() - $(".caption").height() - captionMargin) / 2 + "px");
		
		$(".nav").height( image.height() );
		$(".nav").width( image.width() / 2 );
		$(".nav").css( "line-height", image.height() + "px" );
		$(".nav.left").css({ "top": image.offset().top + "px", "left": image.offset().left + "px" })
		console.log($(".nav.right").width());
		$(".nav.right").css({ "top": image.offset().top + "px", "right": $(window).width() - image.offset().left - image.width() + "px" })
		
}