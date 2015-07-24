'use strict';

/**
 * @ngdoc function
 * @name relcyEditorialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the relcyEditorialApp
 */
angular.module('relcyEditorialApp')
.controller('RejectedController', function ($scope,StatusService, ngTableParams,DataService,$filter) {
	$scope.keys = [];
	$scope.rejectedRecords = [];

    $scope.rejectedLoader = true;

	$scope.tableParameterSetting = function()
	{
		$scope.rejectedLoader = false;
		$scope.rejectedRecordsTableParams = new ngTableParams({
          page: 1,            // show first page
          count: 100,          // count per page
          sorting: {
            'user.name': 'asc'     // initial sorting
          }
        }, {
          total: $scope.rejectedRecords.length, // length of data
          getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
              $filter('orderBy')($scope.rejectedRecords, params.orderBy()) :
              $scope.rejectedRecords;

            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          },
          counts: []
        });
	}

	$scope.getKeys = function()
	{
		$scope.rejectedLoader = true;
		StatusService.getAllRecord(function (response) {
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
		      });

	        $scope.rejectedRecords = response.rejected;

	        DataService.approvedRecords = response.approved;
	        DataService.pendingRecords = response.pending;
	        DataService.rejectedRecords = response.rejected;

	        $scope.tableParameterSetting();

      }, function (error) {
        console.log(error);
      });
	}

	if(DataService.rejectedRecords.length >0)
	{
		$scope.rejectedRecords = DataService.rejectedRecords;
		$scope.tableParameterSetting();
	}
	else
	{
		$scope.getKeys();
	}

	//
	$scope.approveRequest = function(key)
	{
		$scope.rejectedLoader = true;
		StatusService.approveRequest({key:key},function(response){
			console.log(response);
			$scope.getDataAfterAction();
		},function(error){
			console.log(error)
		});
	}
	//
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

			$scope.rejectedRecords = response.rejected;
          DataService.approvedRecords = response.approved;
          DataService.pendingRecords = response.pending;
          DataService.rejectedRecords = response.rejected;

          $scope.rejectedRecordsTableParams.reload() ;

          $scope.rejectedLoader = false;

      }, function (error) {
        console.log(error);
      });
    }
	//
	$scope.approve = function(data,type)
	{
		$scope.approveRequest(data.user.invite_id)
	}
});
