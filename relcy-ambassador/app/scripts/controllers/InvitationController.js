'use strict';

/**
 * @ngdoc function
 * @name relcyMobileInvitePageApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the relcyMobileInvitePageApp
 */
angular.module('relcyMobileInvitePageApp')
  .controller('InvitationController', function ($scope,AmbassadorService,$location,$rootScope) {
  	if(!$rootScope.ambId || $rootScope.ambId == '')
  	{
  		$location.path('/');  
  	}
     $scope.name = ""
     $scope.email = ""
     $scope.phone= ""  
     $scope.platform = 'ios'
     $scope.message = ''
     if($rootScope.backtoinvite)
     {
     	 $scope.name = $rootScope.inviteObj.name 
	     $scope.email = $rootScope.inviteObj.email
	     $scope.phone= $rootScope.inviteObj.phone 
	     $scope.platform = $rootScope.inviteObj.platform 
	     if($scope.platform == 'ios')
	     {  
	     	$('#android').parent().removeClass('active')
	     	$('#ios').parent().addClass('active') 
	 	 }
	 	 else
	 	 {
	 	 	$('#ios').parent().removeClass('active')
	 	 	$('#android').parent().addClass('active')
	 	 }
	 	 $rootScope.backtoinvite = false
     }
     $scope.invite = function()
     {
     	$scope.message = ''
     	$rootScope.name = $scope.name;
     	$rootScope.inviteObj = {ambId:$rootScope.ambId,CID:'5f4903021e',email:$scope.email,name:$scope.name,phone:$scope.phone,platform:$scope.platform}
     	$scope.platform = ( $('#ios').parent().hasClass('active') ? 'ios':'android')
     	AmbassadorService.invitation($rootScope.inviteObj,
     		function(responce){     			
				$location.path('invited');  
     		},function(error){
     			//if(error.status == 403)
     			$scope.message = error.data.message
     			console.log( error)
     		}); 
     }
  });
