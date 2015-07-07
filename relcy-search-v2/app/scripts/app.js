
angular.module('relcyApp',
 ['ui.router',
  'ui.bootstrap',
  'bootstrapLightbox',
  'angucomplete-alt',
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
    $urlRouterProvider.otherwise('search');

    $stateProvider
	 //	.state("home", {
    //  	url: "/?q",
    //  	templateUrl: "views/home.html",
  	//    controller: "SearchController"
    //})
    .state("search", {
        url: "/search?q",
        templateUrl: "views/result.html",
        controller: "SearchController"
    })
    .state("detail", {
        url: "/detail?entity&cipher&cType&q&artist&img",
        templateUrl: "views/details/movie-detail.html",
        controller: "EntityController"
    })
    .state("place", {
        url: "/place?entity&cipher&cType&q&img&dist",
        templateUrl: "views/details/place-detail.html",
        controller: "EntityController"
    });

      $sceProvider.enabled(false);

}
);
//angular.module('relcyApp')
//.run(function(editableOptions) {
//	editableOptions.theme = 'bs3';
//});
