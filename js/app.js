(function(){
	
	var app = angular.module("slideshowCreator", []);
	
	app.service('sharedURL', function(){
		var url = null;
		return {
			getURL: function(){
				return url;
			},
			setURL: function(val){
				url = val;
			}
		};
	});
	
	app.controller("FormController", [ "$http", "$timeout", "sharedURL", function($http, $timeout, sharedURL){
		this.success = true;
		FormControllerObject = this;
		
		this.submit = function(url){
			$http({
				url: "php/clone-slideshow.php", 
				method: "GET",
				params: { "url": url },
				headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
			}).success(function(data){ 
				if(data.status.code == "200"){
					FormControllerObject.success = true;
					sharedURL.setURL(data.url);
				}
				else {
					sharedURL.setURL(null);
					FormControllerObject.success = false;
				}
			});
		};
	} ]);
	
	app.controller("iframeController", [ "sharedURL", function(sharedURL){
		this.iframe  = {};
		this.iframe.height = "400";
		this.iframe.width = "600";
		this.iframe.url = sharedURL.getURL;
		var iframeController = this;
		this.iframe.getEmbed = function(){ return "<iframe src='" + iframeController.iframe.url() + "' width='" + iframeController.iframe.width + "' height='" + iframeController.iframe.height + "' style='border:1px solid #ccc'></iframe>"; };
	
	}]);
	
	app.directive('urlForm', function(){
		return {
			restrict: 'E',
			templateUrl: "html/url-form.html"
		};
	});	

	app.directive('iframePreview', function(){
		return {
			restrict: 'E',
			templateUrl: "html/iframe-preview.html"
		};
	});
	
	app.directive('iframeControls', function(){
		return {
			restrict: 'E',
			templateUrl: "html/iframe-controls.html"
		};
	});
	
	app.directive('appHeader', function(){
		return {
			restrict: 'E',
			templateUrl: "html/app-header.html"
		};
	});
	
})();