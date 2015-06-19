'use strict';

/**
 * @ngdoc function
 * @name relcyMobileInvitePageApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the relcyMobileInvitePageApp
 */
angular.module('relcyMobileInvitePageApp')
  .controller('InvitedCtrl', function ($scope,$rootScope,$location) {  
  	if(!$rootScope.ambId || $rootScope.ambId == '')
  	{
  		$location.path('/');  
  	}
    
     $scope.name = $rootScope.name;
     $scope.back =function()
     {
     	$location.path('invitation')
     }
     $scope.inviteAgain =function()
     {
     	$rootScope.backtoinvite = true
     	$location.path('invitation')
     }
     
  });
