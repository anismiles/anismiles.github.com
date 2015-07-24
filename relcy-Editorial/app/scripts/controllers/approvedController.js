'use strict';

/**
 * @ngdoc function
 * @name relcyEditorialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the relcyEditorialApp
 */
angular.module('relcyEditorialApp')
.controller('ApprovedController', function ($scope,StatusService, ngTableParams,DataService,$filter) {
	$scope.keys = [];
	$scope.approvedRecords = []; 

    $scope.approvedLoader = true; 

	$scope.tableParameterSetting = function()
	{
		$scope.approvedLoader = false; 
		$scope.approvedRecordsTableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          sorting: {
            'user.name': 'asc'     // initial sorting
          }
        }, {
          total: $scope.approvedRecords.length, // length of data
          getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
              $filter('orderBy')($scope.approvedRecords, params.orderBy()) :
              $scope.approvedRecords;

            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          },
          counts: []
        } ); 
	}  

	$scope.getKeys = function()
	{
		$scope.approvedLoader = true; 
		StatusService.getAllRecord(function (response) {  
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
