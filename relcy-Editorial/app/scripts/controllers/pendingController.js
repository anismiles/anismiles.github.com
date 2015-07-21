'use strict';

/**
 * @ngdoc function
 * @name relcyEditorialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the relcyEditorialApp
 */
angular.module('relcyEditorialApp')
.controller('PendingController', function ($scope,StatusService) {
	$scope.keys = [];
	$scope.pendingRecords = [];  

	$scope.maxSize = 5;
	$scope.totalItems = 0;
	$scope.currentPage = 0;
	 
	$scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;
	};

	$scope.pageChanged = function() { 
		console.log('Page changed to: ' + $scope.currentPage)
	};  

	$scope.getKeys = function()
	{
		StatusService.getAllKeys(function(response){
			console.log(response);
			$scope.keys = response.keys;
			addRecords($scope.keys[0],0);
		},function(error){
			console.log(error)
		});
	}
	 
	//
	$scope.rejectRequest = function(key)
	{
		StatusService.rejectRequest({key:key},function(response){
			//console.log(response); 
			if(response.hmset[0] == true)
			{  				
				var tmpRecord = _.find($scope.pendingRecords, function(num){ return num.user.invite_id == key });
				$scope.pendingRecords = _.without($scope.pendingRecords,tmpRecord);
				$scope.totalItems = $scope.pendingRecords.length
			}
		},function(error){
			console.log(error)
		});
	}
	//
	$scope.approveRequest = function(key)
	{
		StatusService.approveRequest({key:key},function(response){
			console.log(response);
			if(response.hmset[0] == true)
			{  				 
				var tmpRecord = _.find($scope.pendingRecords, function(num){ return num.user.invite_id == key });
				$scope.pendingRecords = _.without($scope.pendingRecords,tmpRecord);
				$scope.totalItems = $scope.pendingRecords.length
				//$scope.approvedRecords.push(tmpRecord)				 
			}
		},function(error){
			console.log(error)
		});
	}
	//
	function addRecords(key,index)
	{
		StatusService.getRecordByKeys({key:key},function(response){
			console.log(response);
			response.hgetall.user = JSON.parse(response.hgetall.user)
			response.hgetall.smsent = (response.hgetall.smsid ? "Yes":"No") 
	 
			if(response.hgetall.status == "PENDING")
			{
				try{
					var thirdParty = response.hgetall.user.user_data.third_party_data[0];
					if(thirdParty.third_party_service=='FACEBOOK'){
						response.hgetall.hasFBUrl = true;
						response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
					}
				}catch(err){
					response.hgetall.hasFBUrl = false;
				}
				$scope.pendingRecords.push(response.hgetall);
			}
			 
			index++;
			if ($scope.keys.length > index) {
				addRecords($scope.keys[index],index)
			};
			$scope.totalItems = $scope.pendingRecords.length
		},function(error){
			console.log(error)
		});
	}
	//
	$scope.approve = function(data)
	{
		$scope.approveRequest(data.user.invite_id,type)
	}
	//
	$scope.reject = function(data)
	{
		$scope.rejectRequest(data.user.invite_id,type)
	}
	 
	$scope.getKeys();
});
