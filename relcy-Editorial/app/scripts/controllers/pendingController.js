'use strict';

/**
 * @ngdoc function
 * @name relcyEditorialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the relcyEditorialApp
 */
angular.module('relcyEditorialApp')
.controller('PendingController', function ($scope,StatusService, ngTableParams,DataService,$filter) {
	$scope.keys = [];
	$scope.pendingRecords = [];

	$scope.pendingLoader = true;


	$scope.tableParameterSetting = function()
	{
		$scope.pendingLoader = false;
		$scope.pendingRecordsTableParams = new ngTableParams({
          page: 1,            // show first page
          count: 100,          // count per page
          sorting: {
            'user.name': 'asc'     // initial sorting
          }
        }, {
          total: $scope.pendingRecords.length, // length of data
          getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
              $filter('orderBy')($scope.pendingRecords, params.orderBy()) :
              $scope.pendingRecords;

            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          },
          counts: []
        });
	}

	$scope.getKeys = function()
	{
		$scope.pendingLoader = true;
		StatusService.getAllRecord(function (response) {
	        angular.forEach(response.pending, function(item){
		          try{
		            var thirdParty = item.user.user_data.third_party_data[0];
		            if(thirdParty.third_party_service=='FACEBOOK'){
		              item.hasFBUrl = true;
		              item.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
		            }
		          }catch(err){
		            item.hasFBUrl = false;
		          }
		      });

	        $scope.pendingRecords = response.pending;

	        DataService.approvedRecords = response.approved;
	        DataService.pendingRecords = response.pending;
	        DataService.rejectedRecords = response.rejected;

	        $scope.tableParameterSetting();

      }, function (error) {
        console.log(error);
      });
	}

	if(DataService.pendingRecords.length >0)
	{
		$scope.pendingRecords = DataService.pendingRecords;
		$scope.tableParameterSetting();
	}
	else
	{
		$scope.getKeys();
	}

	//
	$scope.rejectRequest = function(key)
	{
		$scope.pendingLoader = true;
		StatusService.rejectRequest({key:key},function(response){
			//console.log(response);
			$scope.getDataAfterAction();
		},function(error){
			console.log(error)
		});
	}
	//
	$scope.approveRequest = function(key)
	{
		$scope.pendingLoader = true;
		StatusService.approveRequest({key:key},function(response){

			$scope.getDataAfterAction()
		},function(error){
			console.log(error)
		});
	}

	$scope.getDataAfterAction = function () {

      StatusService.getAllRecord(function (response) {
        console.log(response);

        angular.forEach(response.approved, function(item){
          try{
            var thirdParty = item.user.user_data.third_party_data[0];
            if(thirdParty.third_party_service=='FACEBOOK'){
              item.hasFBUrl = true;
              item.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
            }
          }catch(err){
            item.hasFBUrl = false;
          }
        })

        angular.forEach(response.pending, function(item){
          try{
            var thirdParty = item.user.user_data.third_party_data[0];
            if(thirdParty.third_party_service=='FACEBOOK'){
              item.hasFBUrl = true;
              item.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
            }
          }catch(err){
            item.hasFBUrl = false;
          }
        })

        angular.forEach(response.rejected, function(item){
          try{
            var thirdParty = item.user.user_data.third_party_data[0];
            if(thirdParty.third_party_service=='FACEBOOK'){
              item.hasFBUrl = true;
              item.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
            }
          }catch(err){
            item.hasFBUrl = false;
          }
        })

          $scope.pendingRecords = response.pending;
          DataService.approvedRecords = response.approved;
          DataService.pendingRecords = response.pending;
          DataService.rejectedRecords = response.rejected;

          $scope.pendingRecordsTableParams.reload() ;

          $scope.pendingLoader = false;

      }, function (error) {
        console.log(error);
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

});
