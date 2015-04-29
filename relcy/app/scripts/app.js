
angular.module('relcyApp',
 ['ui.router',
  'ui.bootstrap',
  'angucomplete-alt']);

angular.module('relcyApp')
.config(function($stateProvider, $urlRouterProvider, $httpProvider,$locationProvider, $locationProvider) {
   
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
	 	.state("home", {
        	url: "/",
        	templateUrl: "views/home.html",
	  	controller: "SearchController",
      }).state("details", {
          url: "/details",
          templateUrl: "views/detail.html",
      controller: "SearchController",
      })   
	
});

