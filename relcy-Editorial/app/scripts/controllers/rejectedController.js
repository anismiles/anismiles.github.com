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

	$scope.tableParameterSetting = function()
	{
		$scope.rejectedRecordsTableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
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
          }
        });  
	}

	$scope.getKeys = function()
	{
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
		StatusService.approveRequest({key:key},function(response){
			console.log(response);
			if(response.hmset[0] == true)
			{
			 	var tmpRecord = _.find($scope.rejectedRecords, function(num){ return num.user.invite_id == key });
				$scope.rejectedRecords = _.without($scope.rejectedRecords,tmpRecord); 
				$scope.totalItems = $scope.rejectedRecords.length
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
	  
			if(response.hgetall.status == "REJECTED")
			{
				$scope.rejectedRecords.push(response.hgetall)
			}
			
			index++;
			if ($scope.keys.length > index) {
				addRecords($scope.keys[index],index)
			};
			$scope.totalItems = $scope.rejectedRecords.length
		},function(error){
			console.log(error)
		});
	}
	//
	$scope.approve = function(data,type)
	{
		$scope.approveRequest(data.user.invite_id)
	} 
});
