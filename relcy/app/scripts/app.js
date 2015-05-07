
angular.module('relcyApp',
 ['ui.router',
  'ui.bootstrap',
  'bootstrapLightbox',
  'angucomplete-alt',
  'ui.thumbnail']);

angular.module('relcyApp')
.config(function($stateProvider, $urlRouterProvider, $httpProvider,$locationProvider, $locationProvider, $sceProvider, LightboxProvider,ThumbnailServiceProvider) {
    // otherwise both defaults to 100
    ThumbnailServiceProvider.defaults.width = 150;
    ThumbnailServiceProvider.defaults.height = 150;
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

