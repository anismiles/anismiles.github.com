'use strict';

/**
 * @ngdoc function
 * @name siteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the siteApp
 */
angular.module('siteApp')
	.controller('MainCtrl', function ($scope, RelcyService,usSpinnerService,$timeout,$location) {
		$scope.phoneNumber = "";
		$scope.platform = "ios";
		$scope.message = "";
		$scope.homePage = true;
		$scope.thanksPage = false;

		$scope.save = function(){
			usSpinnerService.spin('invite');
			$scope.platform = ( $('#ios').parent().hasClass('active') ? 'ios':'android')

			RelcyService.savePhoneNumber({client_id: "131a22184a",platform:$scope.platform,phone_number:$scope.phoneNumber},function(){
				//
				//$scope.phoneNumber = "";
				//$scope.message = "Link sent to your phone!"
				usSpinnerService.stop('invite');
				//mixpanel.track("Landing-Invite-" + $scope.platform);
				mixpanel.track(
				    "Landing-Invite",
				    { "Platform": $scope.platform,"Phone-No":$scope.phoneNumber }
				);

				$location.path('thankyou');

				$timeout(function(){
					$scope.phoneNumber = "";
					$scope.message = ""
				},3000)
			},function(error){
				//mixpanel.track("Landing-Invite-failed");
				mixpanel.track(
				    "Landing-Invite-Failed",
				    { "Platform": $scope.platform,"Phone-No":$scope.phoneNumber }
				);
				$scope.phoneNumber = "";
				if(error.status == 401)
				{
					$scope.message = "Not Authorized"
				}
				if(error.status == 500)
				{
					$scope.message = "Error! Please contact beta@relcy.com"
				}
				if(error.status == 400)
				{
					$scope.message = 'Required fields are missing or incorrect number.'
				}
				if(error.status == 403)
				{
					$scope.message = "Already sent the SMS twice for this number. Please contact beta@relcy.com"
				}
				$timeout(function(){
					$scope.message = ""
				},5000)
				usSpinnerService.stop('invite');
			})
		}
	});
