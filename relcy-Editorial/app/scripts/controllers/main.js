'use strict';

/**
 * @ngdoc function
 * @name relcyEditorialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the relcyEditorialApp
 */
angular.module('relcyEditorialApp')
  .controller('MainCtrl', function ($scope, StatusService, ngTableParams,DataService,$filter,$timeout,$http) {
    $scope.keys = [];
    $scope.pendingRecords = [];
    $scope.approvedRecords = [];
    $scope.rejectedRecords = [];
    $scope.approvedKeys = [];
    $scope.rejectedKeys = [];
    $scope.pendingKeys = [];

    $scope.pendingLoader = true;
    $scope.approvedLoader = true;
    $scope.rejectedLoader = true;

    $scope.tableParamaterSetting = function()
    {
      $scope.pendingLoader = false;
      $scope.approvedLoader = false;
      $scope.rejectedLoader = false;

      $scope.approvedRecordsTableParams = new ngTableParams({
          page: 1,            // show first page
          count: 100,          // count per page
        filter: {
        },
          sorting: {
            'timestamp': 'desc'     // initial sorting
          }
        }, {
          total: $scope.approved_total,//$scope.approvedRecords.length, // length of data
          getData: function($defer, params) {
            // use build-in angular filter
            $scope.approvedLoader = true;
            var orderedData = params.sorting() ?
                $filter('orderBy')($scope.approvedRecords, params.orderBy()) :
                $scope.approvedRecords;

                    var page = params.page();
                    var size = params.count();
                    var testUrl = 'http://webapp.relcy.com/invites';

                    if(page >= 1)
                      page = page * 100;

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
            //}
          },
          counts: []
        });

        $scope.pendingRecordsTableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          sorting: {
            'timestamp': 'desc'     // initial sorting
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

        $scope.rejectedRecordsTableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          sorting: {
            'timestamp': 'desc'     // initial sorting
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
    $scope.getKeys = function () {
      $scope.pendingLoader = true;
      $scope.approvedLoader = true;
      $scope.rejectedLoader = true;

      StatusService.getAllRecord(function (response) {
        console.log(response);
        //$scope.keys = response.keys;
        //addRecords($scope.keys[0], 0);

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
        })

        angular.forEach(response.pending, function(item){
          try{
            var thirdParty = item.user.user_data.third_party_data[0];
            item.timestamp = new Date(item.timestamp);
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

        console.log($scope.pendingRecords)
        $scope.approvedRecords = response.approved;
        $scope.pendingRecords = response.pending;
        $scope.rejectedRecords = response.rejected;
        DataService.approvedRecords = response.approved;
        DataService.pendingRecords = response.pending;
        DataService.rejectedRecords = response.rejected;

        $scope.tableParamaterSetting();

      }, function (error) {
        console.log(error);
      });
    }

    if(DataService.pendingRecords.length >0)
    {
      $scope.pendingRecords = DataService.pendingRecords;
    }
    if(DataService.approvedRecords.length >0)
    {
      $scope.approvedRecords = DataService.approvedRecords;
    }
    if(DataService.rejectedRecords.length >0)
    {
      $scope.rejectedRecords = DataService.rejectedRecords;
    }

    if($scope.pendingRecords.length == 0 && $scope.approvedRecords.length == 0 && $scope.rejectedRecords.length == 0)
    {
        $scope.getKeys();
    }
    else
    {
      $scope.tableParamaterSetting();
    }

    $scope.getDataAfterAction = function (update) {

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

        console.log($scope.pendingRecords)

        // 1 for update pending and approved
        // 2 for update pending and rejected
        // 3 for update approved and rejected
        // 4 for update rejected and approved
        $timeout(function(){
          if(update == 1 )
          {

            $scope.approvedRecords = response.approved;
            $scope.pendingRecords = response.pending;
          }
          else if(update == 2 )
          {

            $scope.rejectedRecords = response.rejected;
            $scope.pendingRecords = response.pending;
          }
          else if(update == 3 || update == 4)
          {

            $scope.approvedRecords = response.approved;
            $scope.rejectedRecords = response.rejected;
          }

          DataService.approvedRecords = response.approved;
          DataService.pendingRecords = response.pending;
          DataService.rejectedRecords = response.rejected;

          // $scope.tableParamaterSetting();
          $scope.approvedRecordsTableParams.reload() ;
          $scope.pendingRecordsTableParams.reload() ;
          $scope.rejectedRecordsTableParams.reload() ;

          $scope.pendingLoader = false;
          $scope.approvedLoader = false;
          $scope.rejectedLoader = false;
        },500)

      }, function (error) {
        console.log(error);
      });
    }

    //
    $scope.rejectRequest = function (key, type) {
      if (type == 'approve') // called from approved section to reject user request
      {
        $scope.approvedLoader = true;
        $scope.rejectedLoader = true;
      }
      if (type == 'pending') // called from approved section to reject user request
      {
        $scope.pendingLoader = true;
        $scope.rejectedLoader = true;
      }
      StatusService.rejectRequest({key: key}, function (response) {
        //console.log(response);
        if (response.hmset[0] == true) {
          if (type == 'approve') // called from approved section to reject user request
          {
            $scope.getDataAfterAction(3)
            // var tmpRecord = _.find($scope.approvedRecords, function (num) {
            //   return num.user.invite_id == key
            // });
            // $scope.approvedRecords = _.without($scope.approvedRecords, tmpRecord);
            // $scope.rejectedRecords.push(tmpRecord)
          }
          if (type == 'pending') // called from approved section to reject user request
          {
            $scope.getDataAfterAction(2)
            // var tmpRecord = _.find($scope.pendingRecords, function (num) {
            //   return num.user.invite_id == key
            // });
            // $scope.pendingRecords = _.without($scope.pendingRecords, tmpRecord);
            // $scope.rejectedRecords.push(tmpRecord)
          }
        }
      }, function (error) {
        console.log(error)
      });
    }
    //
    $scope.approveRequest = function (key, type) {
      if (type == 'reject')
      {
        $scope.approvedLoader = true;
        $scope.rejectedLoader = true;
      }
      if (type == 'pending') // called from approved section to reject user request
      {
        $scope.pendingLoader = true;
        $scope.approvedLoader = true;
      }
      StatusService.approveRequest({key: key}, function (response) {
        console.log(response);
        if (response.hmset[0] == true) {
          if (type == 'reject') // called from approved section to reject user request
          {
            $scope.getDataAfterAction(4)
            // var tmpRecord = _.find($scope.rejectedRecords, function (num) {
            //   return num.user.invite_id == key
            // });
            // $scope.rejectedRecords = _.without($scope.rejectedRecords, tmpRecord);
            // $scope.approvedRecords.push(tmpRecord)
          }
          if (type == 'pending') // called from approved section to reject user request
          {
            $scope.getDataAfterAction(1)
            // var tmpRecord = _.find($scope.pendingRecords, function (num) {
            //   return num.user.invite_id == key
            // });
            // $scope.pendingRecords = _.without($scope.pendingRecords, tmpRecord);
            // $scope.approvedRecords.push(tmpRecord)
          }
        }
      }, function (error) {
        console.log(error)
      });
    }

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
