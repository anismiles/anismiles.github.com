
var app = angular.module('relcyApp', ['ui.router', 'ui.bootstrap', 'angucomplete-alt']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider,$locationProvider) {
   

    $urlRouterProvider.otherwise('home');
    
    $stateProvider
	 	.state("home", {
          	url: "/home",
          	templateUrl: "views/home.html",
		  	controller: "SearchController",
        })
		
/*		.state("result", {
          	url: "/result",
          	templateUrl: "views/result.html",
		  	controller: "SearchController"
        })
			*/	
	
});