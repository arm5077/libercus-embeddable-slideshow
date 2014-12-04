slideshowPadding = 10;
captionMargin = 10;
titleMargin = 10;

(function(){
	
	var app = angular.module("slideshow", ['ngSanitize']);	
	
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
					image.height( $(window).height() - ( 2 * slideshowPadding ) - $(".title").outerHeight(true) - titleMargin - $(".caption").height() - captionMargin );
					image.css("width", "auto");
				}
				
				// Realign caption with bottom of the thing
				$(".caption").css("bottom", slideshowPadding + "px");
				
				// Realign title with top of the thing
				$(".title").css("top", slideshowPadding + "px");
				
				if( image.height() + $(".title").height() + titleMargin + $(".caption").height() + captionMargin > $(window).height() ){
					image.css("width", "auto");
					for( i=1; i<=3; i++ ){
						image.height( $(window).height() - $(".title").outerHeight(true) - titleMargin - $(".caption").height() - captionMargin - (2 * slideshowPadding) );
					}
				}
				// Center image
				image.css("margin-top", $(".title").outerHeight(true) + titleMargin + ($(window).height() - image.height() - $(".title").outerHeight(true) - titleMargin - $(".caption").height() - captionMargin) / 2 + "px");
				// Center forward-back buttons vertically
				$(".nav").css( "line-height", $(window).height() + "px" );
			}
		};
	});
	
	app.controller("SlideshowController", [ "$scope", "$http", "resize", function($scope, $http, resize){
		this.slideshowIndex = 0;
		this.loaderOn = true;
		SlideshowControllerObject = this;
		$http({
			url: "data/images.json", 
			method: "GET",
			headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){ 
			if(data.status.code == "200"){
				SlideshowControllerObject.images = data.results;
				SlideshowControllerObject.title = data.title;
				SlideshowControllerObject.url = data.old_url;
			}
		});
		
		this.changeImage = function(direction){
			if( (SlideshowControllerObject.slideshowIndex + direction) >= 0 && (SlideshowControllerObject.slideshowIndex + direction) < SlideshowControllerObject.images.length) {
				SlideshowControllerObject.slideshowIndex += direction;
				resize.resizeImage($("img"));
			}
		}
		
		this.turnOffLoader = function(){
			$scope.$apply(function(){
				SlideshowControllerObject.loaderOn = false;
			});
		}
		
	} ]);
	
	app.directive("orient", ["resize", function(resize){
		return {
			scope: {
				methodToCall: '&method'
			},
			link: function(scope, element, attrs){
				element.bind("load", function(e){
					resize.resizeImage($(element));
					var func = scope.methodToCall();
					func();
				});
				
				angular.element(window).bind("resize", function(e){
					resize.resizeImage($(element));
				});
			}
		}
	}]);
	
})();