'use strict';

/**
 * @ngdoc function
 * @name relcyEditorialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the relcyEditorialApp
 */
angular.module('relcyEditorialApp')
  .controller('MainCtrl', function ($scope, StatusService, ngTableParams,DataService) {
    $scope.keys = [];
    $scope.pendingRecords = [];
    $scope.approvedRecords = [];
    $scope.rejectedRecords = [];
    $scope.approvedKeys = [];
    $scope.rejectedKeys = [];
    $scope.pendingKeys = [];

    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      sorting: {
        name: 'asc'     // initial sorting
      }
    });

    $scope.getKeys = function () {

      StatusService.getAllRecord(function (response) {
        console.log(response);
        //$scope.keys = response.keys;
        //addRecords($scope.keys[0], 0);

        $scope.approvedRecords = response.approved.splice(0,1000);
        $scope.pendingRecords = response.pending.splice(0,1000);
        $scope.rejectedRecords = response.rejected.splice(0,1000);
        DataService.approvedRecords = $scope.approvedRecords
        DataService.pendingRecords = $scope.pendingRecords
        DataService.rejectedRecords = $scope.rejectedRecords

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
    $scope.approveRequest = function (key) {
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
    //
    function addApproveRecords(key, index) {
      var tmpJson = '{   "hgetall":{      "smsid":"SM45e5dd0dc1f5470fb8d96283de9c9a1e",      "time":"2015-06-21T14:41:54.239-07:00",      "status":"APPROVED",      "user":{"name": "Manju","email_address": "leomanjucs@gmail.com","invite_id": "62f8c3593eea0a2a3e2d2c203293f76c","client_id": "1a133c4635","phone_number": "4086060562","ambassador_id": "","device": [{"device_uid": "ADC162B8-2778-4B43-A007-2C6B95421D78","platform": "IOS","modelName": "iPhone","language": "en","timezone": "America/Los_Angeles","version_number": "8.3","advertising_uid": "A2DCA463-9CA9-4D2A-AAE2-CF6D0978E2EC","app_version": "0.9.38","phone_country_code": "310","bundle_id": "com.relcy-labs.Relcy","screenWidth": 375,"screenHeight": 667,"screenScale": 2.0,"timestamp_utc": 1434948093583}]}   }}';
      var response = JSON.parse(tmpJson);
      response.hgetall.user = response.hgetall.user
      response.hgetall.smsent = (response.hgetall.smsid ? "Yes" : "No")
      try {
        var thirdParty = response.hgetall.user.user_data.third_party_data[0];
        if (thirdParty.third_party_service == 'FACEBOOK') {
          response.hgetall.hasFBUrl = true;
          response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
        }
      } catch (err) {
        response.hgetall.hasFBUrl = false;
      }
      $scope.approvedRecords.push(response.hgetall);

      // StatusService.getRecordByKeys({key:key},function(response){
      // 	console.log(response);
      // 	response.hgetall.user = JSON.parse(response.hgetall.user)
      // 	response.hgetall.smsent = (response.hgetall.smsid ? "Yes":"No")
      // 		try{
      // 			var thirdParty = response.hgetall.user.user_data.third_party_data[0];
      // 			if(thirdParty.third_party_service=='FACEBOOK'){
      // 				response.hgetall.hasFBUrl = true;
      // 				response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
      // 			}
      // 		}catch(err){
      // 			response.hgetall.hasFBUrl = false;
      // 		}
      // 		$scope.approvedRecords.push(response.hgetall);
      // },function(error){
      // 	console.log(error)
      // });
    }

    function addPendingRecords(key, index) {
      var tmpJson = '{   "hgetall":{      "smsid":"SM45e5dd0dc1f5470fb8d96283de9c9a1e",      "time":"2015-06-21T14:41:54.239-07:00",      "status":"APPROVED",      "user":{"name": "Manju","email_address": "leomanjucs@gmail.com","invite_id": "62f8c3593eea0a2a3e2d2c203293f76c","client_id": "1a133c4635","phone_number": "4086060562","ambassador_id": "","device": [{"device_uid": "ADC162B8-2778-4B43-A007-2C6B95421D78","platform": "IOS","modelName": "iPhone","language": "en","timezone": "America/Los_Angeles","version_number": "8.3","advertising_uid": "A2DCA463-9CA9-4D2A-AAE2-CF6D0978E2EC","app_version": "0.9.38","phone_country_code": "310","bundle_id": "com.relcy-labs.Relcy","screenWidth": 375,"screenHeight": 667,"screenScale": 2.0,"timestamp_utc": 1434948093583}]}   }}';
      var response = JSON.parse(tmpJson);
      response.hgetall.user = response.hgetall.user
      response.hgetall.smsent = (response.hgetall.smsid ? "Yes" : "No")
      try {
        var thirdParty = response.hgetall.user.user_data.third_party_data[0];
        if (thirdParty.third_party_service == 'FACEBOOK') {
          response.hgetall.hasFBUrl = true;
          response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
        }
      } catch (err) {
        response.hgetall.hasFBUrl = false;
      }
      $scope.pendingRecords.push(response.hgetall);

      // StatusService.getRecordByKeys({key:key},function(response){
      // 	console.log(response);
      // 	response.hgetall.user = JSON.parse(response.hgetall.user)
      // 	response.hgetall.smsent = (response.hgetall.smsid ? "Yes":"No")
      // 		try{
      // 			var thirdParty = response.hgetall.user.user_data.third_party_data[0];
      // 			if(thirdParty.third_party_service=='FACEBOOK'){
      // 				response.hgetall.hasFBUrl = true;
      // 				response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
      // 			}
      // 		}catch(err){
      // 			response.hgetall.hasFBUrl = false;
      // 		}
      // 		$scope.approvedRecords.push(response.hgetall);
      // },function(error){
      // 	console.log(error)
      // });
    }

    function addRejectedRecords(key, index) {
      var tmpJson = '{   "hgetall":{      "smsid":"SM45e5dd0dc1f5470fb8d96283de9c9a1e",      "time":"2015-06-21T14:41:54.239-07:00",      "status":"APPROVED",      "user":{"name": "Manju","email_address": "leomanjucs@gmail.com","invite_id": "62f8c3593eea0a2a3e2d2c203293f76c","client_id": "1a133c4635","phone_number": "4086060562","ambassador_id": "","device": [{"device_uid": "ADC162B8-2778-4B43-A007-2C6B95421D78","platform": "IOS","modelName": "iPhone","language": "en","timezone": "America/Los_Angeles","version_number": "8.3","advertising_uid": "A2DCA463-9CA9-4D2A-AAE2-CF6D0978E2EC","app_version": "0.9.38","phone_country_code": "310","bundle_id": "com.relcy-labs.Relcy","screenWidth": 375,"screenHeight": 667,"screenScale": 2.0,"timestamp_utc": 1434948093583}]}   }}';
      var response = JSON.parse(tmpJson);
      response.hgetall.user = response.hgetall.user
      response.hgetall.smsent = (response.hgetall.smsid ? "Yes" : "No")
      try {
        var thirdParty = response.hgetall.user.user_data.third_party_data[0];
        if (thirdParty.third_party_service == 'FACEBOOK') {
          response.hgetall.hasFBUrl = true;
          response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
        }
      } catch (err) {
        response.hgetall.hasFBUrl = false;
      }
      $scope.rejectedRecords.push(response.hgetall);

      // StatusService.getRecordByKeys({key:key},function(response){
      // 	console.log(response);
      // 	response.hgetall.user = JSON.parse(response.hgetall.user)
      // 	response.hgetall.smsent = (response.hgetall.smsid ? "Yes":"No")
      // 		try{
      // 			var thirdParty = response.hgetall.user.user_data.third_party_data[0];
      // 			if(thirdParty.third_party_service=='FACEBOOK'){
      // 				response.hgetall.hasFBUrl = true;
      // 				response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
      // 			}
      // 		}catch(err){
      // 			response.hgetall.hasFBUrl = false;
      // 		}
      // 		$scope.approvedRecords.push(response.hgetall);
      // },function(error){
      // 	console.log(error)
      // });
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
