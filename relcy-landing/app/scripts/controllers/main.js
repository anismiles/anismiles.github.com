'use strict';

/**
 * @ngdoc function
 * @name siteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the siteApp
 */
angular.module('siteApp')
	.controller('MainCtrl', function ($scope, RelcyService,usSpinnerService,$timeout) {
		$scope.phoneNumber = "";
		$scope.platform = "ios";
		$scope.message = ""
		
		$scope.save = function(){
			usSpinnerService.spin('invite');
			$scope.platform = ( $('#ios').parent().hasClass('active') ? 'ios':'android')
			
			RelcyService.savePhoneNumber({client_id: "131a22184a",platform:$scope.platform,phone_number:$scope.phoneNumber},function(){
				//
				$scope.phoneNumber = "";
				$scope.message = "Link sent to your phone!"
				usSpinnerService.stop('invite');
				$timeout(function(){
					$scope.phoneNumber = "";
					$scope.message = ""
				},3000)
			},function(error){
				//alert(error)
				$scope.phoneNumber = "";
				$scope.message = "Something went wrong! Please try again!"
				$timeout(function(){ 
					$scope.message = ""
				},3000)
				usSpinnerService.stop('invite');
			})
		}
	});
