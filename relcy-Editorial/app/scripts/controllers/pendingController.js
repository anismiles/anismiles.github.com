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
	 

	$scope.tableParameterSetting = function()
	{
		$scope.pendingRecordsTableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
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
          }
        });  
	}

	$scope.getKeys = function()
	{
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
