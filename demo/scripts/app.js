
var app = angular.module('mainApp', ['ui.router', 'ui.bootstrap']);

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