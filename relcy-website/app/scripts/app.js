'use strict';

/**
 * @ngdoc overview
 * @name relcyWebsiteApp
 * @description
 * # relcyWebsiteApp
 *
 * Main module of the application.
 */
angular
  .module('relcyWebsiteApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angularSpinner'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
