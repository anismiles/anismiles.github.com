'use strict';

/**
 * @ngdoc overview
 * @name relcyMobileInvitePageApp
 * @description
 * # relcyMobileInvitePageApp
 *
 * Main module of the application.
 */
angular
  .module('relcyMobileInvitePageApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
	   .when('/invitation', {
        templateUrl: 'views/invitation.html',
        controller: 'InvitationController'
      })
      .when('/invited', {
        templateUrl: 'views/invited.html',
        controller: 'InvitedCtrl'
      })
	  
      .otherwise({
        redirectTo: '/'
      });
  });
