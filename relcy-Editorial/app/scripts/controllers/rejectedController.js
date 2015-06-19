'use strict';

/**
 * @ngdoc function
 * @name relcyEditorialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the relcyEditorialApp
 */
angular.module('relcyEditorialApp')
.controller('RejectedController', function ($scope,StatusService) {
	$scope.keys = [];
	$scope.rejectedRecords = [];

	$scope.getKeys = function()
	{
		StatusService.getAllKeys(function(response){
			// console.log(response);
			$scope.keys = response.keys;
			addRecords($scope.keys[0],0);
		},function(error){
			console.log(error)
		});
	}
	//	 
	$scope.approveRequest = function(key)
	{
		StatusService.approveRequest({key:key},function(response){
			// console.log(response);
			if(response.hmset[0] == true)
			{
			 	var tmpRecord = _.find($scope.rejectedRecords, function(num){ return num.user.invite_id == key });
				$scope.rejectedRecords = _.without($scope.rejectedRecords,tmpRecord); 
			}
		},function(error){
			console.log(error)
		});
	}
	//
	function addRecords(key,index)
	{
		StatusService.getRecordByKeys({key:key},function(response){
			// console.log(response);
			response.hgetall.user = JSON.parse(response.hgetall.user)
			response.hgetall.smsent = (response.hgetall.smsid ? "Yes":"No") 
	  
			if(response.hgetall.status == "REJECTED")
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
		$scope.approveRequest(data.user.invite_id)
	}
	
	$scope.getKeys();
});
