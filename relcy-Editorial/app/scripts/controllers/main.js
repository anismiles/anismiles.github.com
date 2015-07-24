'use strict';

/**
 * @ngdoc function
 * @name relcyEditorialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the relcyEditorialApp
 */
angular.module('relcyEditorialApp')
  .controller('MainCtrl', function ($scope, StatusService, ngTableParams,DataService,$filter) {
    $scope.keys = [];
    $scope.pendingRecords = [];
    $scope.approvedRecords = [];
    $scope.rejectedRecords = [];
    $scope.approvedKeys = [];
    $scope.rejectedKeys = [];
    $scope.pendingKeys = [];



    $scope.getKeys = function () {

      StatusService.getAllRecord(function (response) {
        console.log(response);
        //$scope.keys = response.keys;
        //addRecords($scope.keys[0], 0);
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

            //$scope.pendingRecords.push(
            //  {
            //    id:item.id,
            //    timestamp:item.timestamp,
            //    name:item.user.name,
            //    email_address:
            //    invite_id
            //    client_id
            //    phone_number
            //    account_type
            //    ambassador_id
            //    hasFBUrl
            //    fbURL
            //
            //  }
            //)






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
        //$scope.pendingRecords = response.pending;
        $scope.rejectedRecords = response.rejected;
        //DataService.approvedRecords = response.approved;
        //DataService.pendingRecords = response.pending;
        //DataService.rejectedRecords = response.rejected;


        $scope.approvedRecordsTableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          sorting: {
            name: 'asc'     // initial sorting
          }
        });
        $scope.pendingRecordsTableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          sorting: {
            id: 'asc'     // initial sorting
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

        $scope.rejectedRecordsTableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          sorting: {
            name: 'asc'     // initial sorting
          }
        });

      }, function (error) {
        console.log(error);
      });
    }

    $scope.getKeys();
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
    $scope.rejectRequest = function (key, type) {
      StatusService.rejectRequest({key: key}, function (response) {
        //console.log(response);
        if (response.hmset[0] == true) {
          if (type == 'approve') // called from approved section to reject user request
          {
            var tmpRecord = _.find($scope.approvedRecords, function (num) {
              return num.user.invite_id == key
            });
            $scope.approvedRecords = _.without($scope.approvedRecords, tmpRecord);
            $scope.rejectedRecords.push(tmpRecord)
          }
          if (type == 'pending') // called from approved section to reject user request
          {
            var tmpRecord = _.find($scope.pendingRecords, function (num) {
              return num.user.invite_id == key
            });
            $scope.pendingRecords = _.without($scope.pendingRecords, tmpRecord);
            $scope.rejectedRecords.push(tmpRecord)
          }
        }
      }, function (error) {
        console.log(error)
      });
    }
    //
    $scope.approveRequest = function (key, type) {
      StatusService.approveRequest({key: key}, function (response) {
        console.log(response);
        if (response.hmset[0] == true) {
          if (type == 'reject') // called from approved section to reject user request
          {
            var tmpRecord = _.find($scope.rejectedRecords, function (num) {
              return num.user.invite_id == key
            });
            $scope.rejectedRecords = _.without($scope.rejectedRecords, tmpRecord);
            $scope.approvedRecords.push(tmpRecord)
          }
          if (type == 'pending') // called from approved section to reject user request
          {
            var tmpRecord = _.find($scope.pendingRecords, function (num) {
              return num.user.invite_id == key
            });
            $scope.pendingRecords = _.without($scope.pendingRecords, tmpRecord);
            $scope.approvedRecords.push(tmpRecord)
          }
        }
      }, function (error) {
        console.log(error)
      });
    }


    // function addRecords(key,index)
    // {
    // 	StatusService.getRecordByKeys({key:key},function(response){
    // 		console.log(response);
    // 		response.hgetall.user = JSON.parse(response.hgetall.user)
    // 		response.hgetall.smsent = (response.hgetall.smsid ? "Yes":"No")

    // 		if(response.hgetall.status == "PENDING")
    // 		{

    // 			try{
    // 				var thirdParty = response.hgetall.user.user_data.third_party_data[0];
    // 				if(thirdParty.third_party_service=='FACEBOOK'){
    // 					response.hgetall.hasFBUrl = true;
    // 					response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
    // 				}
    // 			}catch(err){
    // 				response.hgetall.hasFBUrl = false;
    // 			}
    // 			$scope.pendingRecords.push(response.hgetall);
    // 		}
    // 		else if(response.hgetall.status == "APPROVED")
    // 		{
    // 			try{
    // 				var thirdParty = response.hgetall.user.user_data.third_party_data[0];
    // 				if(thirdParty.third_party_service=='FACEBOOK'){
    // 					response.hgetall.hasFBUrl = true;
    // 					response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
    // 				}
    // 			}catch(err){
    // 				response.hgetall.hasFBUrl = false;
    // 			}
    // 			$scope.approvedRecords.push(response.hgetall);
    // 		}
    // 		else
    // 		{
    // 			$scope.rejectedRecords.push(response.hgetall)
    // 		}

    // 		// index++;
    // 		// if ($scope.keys.length > index) {
    // 		// 	addRecords($scope.keys[index],index)
    // 		// };
    // 	},function(error){
    // 		console.log(error)
    // 	});
    // }
    //
    $scope.approve = function (data, type) {
      $scope.approveRequest(data.user.invite_id, type)
    }
    //
    $scope.reject = function (data, type) {
      $scope.rejectRequest(data.user.invite_id, type)
    }
    //
    $scope.showAllPendingApprovals = function () {
      //
    }
    //
    $scope.showAllApprovedUser = function () {
      //
    }
    //
    $scope.showAllRejectedUser = function () {
      //
    }

  });
