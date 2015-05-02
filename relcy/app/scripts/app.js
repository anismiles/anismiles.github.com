
angular.module('relcyApp',
 ['ui.router',
  'ui.bootstrap',
  'bootstrapLightbox',
  'angucomplete-alt']);

angular.module('relcyApp')
.config(function($stateProvider, $urlRouterProvider, $httpProvider,$locationProvider, $locationProvider, $sceProvider, LightboxProvider) {
    
     LightboxProvider.templateUrl = 'views/lightbox.html';
    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
	 	.state("home", {
        	url: "/",
        	templateUrl: "views/home.html",
	  	controller: "SearchController",
      });

      $sceProvider.enabled(false);
 
	
});

