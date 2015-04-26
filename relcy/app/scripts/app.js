
angular.module('relcyApp',
 ['ui.router',
  'ui.bootstrap',
  'angucomplete-alt']);

angular.module('relcyApp')
.config(function($stateProvider, $urlRouterProvider, $httpProvider,$locationProvider) {
   

    $urlRouterProvider.otherwise('home');
    
    $stateProvider
	 	.state("home", {
          	url: "/home",
          	templateUrl: "views/home.html",
		  	controller: "SearchController",
        })
	
});