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
	
	app.controller("FormController", [ "$http", "sharedURL", function($http, sharedURL){
		this.submit = function(url){
			$http({
				url: "php/clone-slideshow.php", 
				method: "GET",
				params: { "url": url },
				headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
			}).success(function(data){ 
				sharedURL.setURL(data.url);
			});
		};
	} ]);
	
	app.controller("iframeController", [ "sharedURL", function(sharedURL){
		this.iframe  = {};
		this.iframe.height = "400";
		this.iframe.width = "100%";
		this.iframe.url = sharedURL.getURL;
	}]);
	
})();