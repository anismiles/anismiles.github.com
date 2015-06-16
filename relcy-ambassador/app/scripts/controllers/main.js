'use strict';

/**
 * @ngdoc function
 * @name relcyMobileInvitePageApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the relcyMobileInvitePageApp
 */
angular.module('relcyMobileInvitePageApp')
  .controller('MainCtrl', function ($scope,AmbassadorService,$location,$timeout) {
  	$scope.name = "";
  	$scope.ambassadorCode = "";
  	$scope.message = "";

    $scope.login = function()
    {
    	AmbassadorService.login({id:$scope.ambassadorCode},function(response){
			console.log(response)
			if(response.hmget[0] == $scope.name || response.hmget[1] == $scope.name)
			{
				$location.path("/form2");
			}
			else
			{
				$scope.message = "Authentication failed!"
				$timeout(function(){$scope.message = ""},5000)
			}
		},function(error){
			console.log(error)
		});
    }
  });
