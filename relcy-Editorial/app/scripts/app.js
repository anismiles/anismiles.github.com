'use strict';

/**
 * @ngdoc overview
 * @name relcyEditorialApp
 * @description
 * # relcyEditorialApp
 *
 * Main module of the application.
 */
angular
  .module('relcyEditorialApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ui.bootstrap',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap' ,
    'ngTable'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).when('/pending', {
        templateUrl: 'views/pendingRecords.html',
        controller: 'PendingController'
      })
      .when('/approved', {
        templateUrl: 'views/approvedRecords.html',
        controller: 'ApprovedController'
      })
      .when('/rejected', {
        templateUrl: 'views/rejectedRecords.html',
        controller: 'RejectedController'
      })     
      .otherwise({
        redirectTo: '/'
      });
  });
