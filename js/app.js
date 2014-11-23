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
					//sharedURL.setURL(null);
					var FormController = this;
				
						FormControllerObject.success = false;
						console.log(FormController.success);
				
				}
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