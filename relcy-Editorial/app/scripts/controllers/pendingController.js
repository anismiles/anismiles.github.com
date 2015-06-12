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
				$scope.pendingRecords.push(response.hgetall)
			}
			 
			index++;
			if ($scope.keys.length > index) {
				addRecords($scope.keys[index],index)
			};
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
