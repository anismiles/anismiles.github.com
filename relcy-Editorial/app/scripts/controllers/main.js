'use strict';

/**
 * @ngdoc function
 * @name relcyEditorialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the relcyEditorialApp
 */
angular.module('relcyEditorialApp')
.controller('MainCtrl', function ($scope,StatusService) {
	$scope.keys = [];
	$scope.pendingRecords = [];
	$scope.approvedRecords = [];
	$scope.rejectedRecords = [];

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
	// $scope.getRecordByKeys = function(key)
	// {
	// 	StatusService.getRecordByKeys({key:key},function(response){
	// 		console.log(response);
	// 		$scope.records = response;
	// 	},function(error){
	// 		console.log(error)
	// 	});
	// }
	//
	$scope.rejectRequest = function(key,type)
	{
		StatusService.rejectRequest({key:key},function(response){
			//console.log(response); 
			if(response.hmset[0] == true)
			{
				if (type=='approve') // called from approved section to reject user request
				{
					var tmpRecord = _.find($scope.approvedRecords, function(num){ return num.user.invite_id == key });
					$scope.approvedRecords = _.without($scope.approvedRecords,tmpRecord);
					$scope.rejectedRecords.push(tmpRecord)
				}
				if (type=='pending') // called from approved section to reject user request
				{
					var tmpRecord = _.find($scope.pendingRecords, function(num){ return num.user.invite_id == key });
					$scope.pendingRecords = _.without($scope.pendingRecords,tmpRecord);
					$scope.rejectedRecords.push(tmpRecord)
				}
			}
		},function(error){
			console.log(error)
		});
	}
	//
	$scope.approveRequest = function(key,type)
	{
		StatusService.approveRequest({key:key},function(response){
			console.log(response);
			if(response.hmset[0] == true)
			{
				if (type=='reject') // called from approved section to reject user request
				{
					var tmpRecord = _.find($scope.rejectedRecords, function(num){ return num.user.invite_id == key });
					$scope.rejectedRecords = _.without($scope.rejectedRecords,tmpRecord);
					$scope.approvedRecords.push(tmpRecord)
				}
				if (type=='pending') // called from approved section to reject user request
				{
					var tmpRecord = _.find($scope.pendingRecords, function(num){ return num.user.invite_id == key });
					$scope.pendingRecords = _.without($scope.pendingRecords,tmpRecord);
					$scope.approvedRecords.push(tmpRecord)
				}
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
			else if(response.hgetall.status == "APPROVED")
			{
				$scope.approvedRecords.push(response.hgetall)
			}
			else
			{
				$scope.rejectedRecords.push(response.hgetall)
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
	$scope.approve = function(data,type)
	{
		$scope.approveRequest(data.user.invite_id,type)
	}
	//
	$scope.reject = function(data,type)
	{
		$scope.rejectRequest(data.user.invite_id,type)
	}
	//
	$scope.showAllPendingApprovals = function()
	{
		//
	}
	//
	$scope.showAllApprovedUser = function()
	{
		//
	}
	//
	$scope.showAllRejectedUser = function()
	{
		//
	}
	$scope.getKeys();
});
