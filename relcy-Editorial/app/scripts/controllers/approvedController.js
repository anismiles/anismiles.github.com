'use strict';

/**
 * @ngdoc function
 * @name relcyEditorialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the relcyEditorialApp
 */
angular.module('relcyEditorialApp')
.controller('ApprovedController', function ($scope,StatusService, ngTableParams,DataService,$filter,$http) {
	$scope.keys = [];
	$scope.approvedRecords = [];

    $scope.approvedLoader = true;

	$scope.tableParameterSetting = function()
	{
		$scope.approvedLoader = false;
		$scope.approvedRecordsTableParams = new ngTableParams({
          page: 0,            // show first page
          count: 100,          // count per page
          sorting: {
            'timestamp': 'desc'      // initial sorting
          }
        }, {
          total: $scope.approved_total, // length of data
          getData: function($defer, params) {
            // use build-in angular filter
            $scope.approvedLoader = true;
            var orderedData = params.sorting() ?
                $filter('orderBy')($scope.approvedRecords, params.orderBy()) :
                $scope.approvedRecords;

                    var page = params.page();
                    var size = params.count();
                    var testUrl = 'http://webapp.relcy.com/invites';

                    if(page > 1)
                      page = ((page-1) * 100);
                    else
                      page = 1;

                    //page = page === 0? 1: page;

                    var search = { 
                      from: page,
                      size: size
                    }
                    $http.get(testUrl, { params: search, headers: { 'Content-Type': 'application/json'} })
                         .then(function(res) {
                            params.total(res.data.approved_total);
                            $scope.approvedRecords = res.data.approved
                            var orderedData = params.sorting() ?
                              $filter('orderBy')($scope.approvedRecords, params.orderBy()) :
                              $scope.approvedRecords;
                              $scope.approvedLoader = false;
                            $defer.resolve(orderedData);
                        }, function(reason) {
                            $defer.reject();
                        }
                    );

            //$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          },
          counts: []
        } );
	}

	$scope.getKeys = function()
	{
		$scope.approvedLoader = true;
		StatusService.getAllRecord(function (response) {

        $scope.approved_from = response.approved_from;
        $scope.approved_size = response.approved_size;
        $scope.approved_total = response.approved_total; 

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
		      });

	        $scope.approvedRecords = response.approved;

	        DataService.approvedRecords = response.approved;
	        DataService.pendingRecords = response.pending;
	        DataService.rejectedRecords = response.rejected;

	        $scope.tableParameterSetting();

      }, function (error) {
        console.log(error);
      });
	}
	//
	if(DataService.approvedRecords.length >0)
	{
		$scope.approvedRecords = DataService.approvedRecords;
		$scope.tableParameterSetting();
	}
	else
	{
		$scope.getKeys();
	}
	//
	$scope.rejectRequest = function(key)
	{
		$scope.approvedLoader = true;
		StatusService.rejectRequest({key:key},function(response){
			//console.log(response);
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

          $scope.approvedRecords = response.approved;
          DataService.approvedRecords = response.approved;
          DataService.pendingRecords = response.pending;
          DataService.rejectedRecords = response.rejected;

          $scope.approvedRecordsTableParams.reload() ;

          $scope.approvedLoader = false;

      }, function (error) {
        console.log(error);
      });
    }
	//
	$scope.reject = function(data,type)
	{
		$scope.rejectRequest(data.user.invite_id)
	}
});
