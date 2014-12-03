slideshowPadding = 10;
captionMargin = 10;
titleMargin = 10;

(function(){
	
	var app = angular.module("slideshow", []);	
	
	app.service('resize', function(){
		return {
			resizeImage: function(image){
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
		};
	});
	
	app.controller("SlideshowController", [ "$http", "resize", function($http, resize){
		SlideshowControllerObject = this;
		this.slideshowIndex = 0;
		
		$http({
			url: "data/images.json", 
			method: "GET",
			headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){ 
			if(data.status.code == "200"){
				SlideshowControllerObject.images = data.results;
			}
		});
		
		this.changeImage = function(direction){
			if( (SlideshowControllerObject.slideshowIndex + direction) >= 0 && (SlideshowControllerObject.slideshowIndex + direction) < SlideshowControllerObject.images.length) {
				SlideshowControllerObject.slideshowIndex += direction;
				resize.resizeImage($("img"));
			}
		}
	} ]);
	
	app.directive("orient", ["resize", function(resize){
		return {
			link: function(scope, element, attrs){
				element.bind("load", function(e){
					resize.resizeImage($(element));
				});
				
				angular.element(window).bind("resize", function(e){
					resize.resizeImage($(element));
				});
			}
		}
	}]);
	
})();