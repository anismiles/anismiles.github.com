
angular.module('relcyApp',
 ['ui.router',
  'ui.bootstrap',
  'bootstrapLightbox',
  'ngResource',
  'ngAnimate',
  'leaflet-directive']);

angular.module('relcyApp')
.config(function($stateProvider, $urlRouterProvider, $httpProvider,$locationProvider, $locationProvider, $sceProvider, LightboxProvider) {
    // otherwise both defaults to 100
    // ThumbnailServiceProvider.defaults.width = 150;
    // ThumbnailServiceProvider.defaults.height = 150;
     LightboxProvider.templateUrl = 'views/lightbox.html';
    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('login');

    $stateProvider
	 //	.state("home", {
    //  	url: "/?q",
    //  	templateUrl: "views/home.html",
  	//    controller: "SearchController"
    //})
	.state("login", {
        url: "/login",
        templateUrl: "views/login.html",
        controller: "LoginController"
    })
    .state("search", {
        url: "/search?q",
        templateUrl: "views/result.html",
        controller: "SearchController"
    })
    .state("detail", {
        url: "/detail?entity&cipher&cType&q&artist&img",
        templateUrl: "views/details/movie.html",
        controller: "EntityController"
    })
    .state("place", {
        url: "/place?entity&cipher&cType&q&img&dist",
        templateUrl: "views/details/place.html",
        controller: "EntityController"
    })
    .state("celebrity", {
        url: "/celebrity?entity&cipher&cType&q&img&dist",
        templateUrl: "views/details/celebrity.html",
        controller: "EntityController"
    })
    .state("people", {
        url: "/people?entity&cipher&cType&q&img&dist",
        templateUrl: "views/details/people.html",
        controller: "EntityController"
    });


      $sceProvider.enabled(false);

}
);
//angular.module('relcyApp')
//.run(function(editableOptions) {
//	editableOptions.theme = 'bs3';
//});
