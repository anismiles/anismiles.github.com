'use strict';

/**
 * @ngdoc function
 * @name relcyEditorialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the relcyEditorialApp
 */
angular.module('relcyEditorialApp')
.controller('ApprovedController', function ($scope,StatusService, DataService,$timeout) {
	$scope.keys = [];
	$scope.approvedRecords = [];

	$scope.maxSize = 5;
	$scope.totalItems = 0;
	$scope.currentPage = 0;

  $scope.loadData = function ()
  {
    console.log("loading data");
    $scope.approvedRecords = DataService.approvedRecords;
  }

  $scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;
	};

	$scope.pageChanged = function() {
		console.log('Page changed to: ' + $scope.currentPage)
	};

	//
	$scope.rejectRequest = function(key)
	{
		StatusService.rejectRequest({key:key},function(response){
			//console.log(response);
			if(response.hmset[0] == true)
			{
				var tmpRecord = _.find($scope.approvedRecords, function(num){ return num.user.invite_id == key });
				$scope.approvedRecords = _.without($scope.approvedRecords,tmpRecord);
				$scope.totalItems = $scope.approvedRecords.length
			}
		},function(error){
			console.log(error)
		});
	}

	$scope.reject = function(data,type)
	{
		$scope.rejectRequest(data.user.invite_id)
	}

  $timeout(function(){
    $scope.loadData()
  },500)
});
