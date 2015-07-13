'use strict';

/**
 * @ngdoc function
 * @name relcyWebsiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the relcyWebsiteApp
 */
angular.module('relcyWebsiteApp')
  .controller('MainCtrl', function ($scope, RelcyService, usSpinnerService, $timeout, $location) {
    console.log("MainCtrl loaded")
    $scope.phoneNumber = "";
    $scope.platform = "";
    $scope.message = "";
    $scope.homePage = true;
    $scope.thanksPage = false;
    $("#errorAlert").hide();
    $("#seccusAlert").hide();

    $scope.save = function () {
      usSpinnerService.spin('invite');
      //$scope.platform = ( $('#ios').parent().hasClass('active') ? 'ios':'android')

      RelcyService.savePhoneNumber({
        client_id: "131a22184a",
        platform: $scope.platform.id,
        phone_number: $scope.phoneNumber
      }, function () {
        //
        //$scope.phoneNumber = "";
        //$scope.message = "Link sent to your phone!"
        usSpinnerService.stop('invite');
        //mixpanel.track("Landing-Invite-" + $scope.platform);
        mixpanel.track(
          "home_text_link",
          {"Platform": $scope.platform.id, "Phone-No": $scope.phoneNumber}
        );
        $scope.message = "Thank you for your interest. You have been added to our waiting list."

        $("#signup form").hide();
        $("#seccusAlert").show();
        setTimeout(function () {
          $scope.message = ""
          $("#hero a.cancel").click();
        }, 5000);

        //$timeout(function(){
        //  $scope.phoneNumber = "";
        //  $scope.message = ""
        //},3000)
      }, function (error) {
        //mixpanel.track("Landing-Invite-failed");
        if (error.status == 401) {
          $scope.message = "Not Authorized"
        }
        if (error.status == 500) {
          $scope.message = "Error! Please contact beta@relcy.com"
        }
        if (error.status == 400) {
          $scope.message = "Required fields are missing or incorrect number."
        }
        if (error.status == 403) {
          $scope.message = "Already sent the SMS twice for this number. Please contact beta@relcy.com"
          mixpanel.track(
            "home_sms_maxout",
            {"Platform": $scope.platform.id, "Phone-No": $scope.phoneNumber}
          );
        }
        $scope.phoneNumber = "";
        //$("#signup form").hide();
        $("#errorAlert").show();
        setTimeout(function () {
          $scope.message = ""
          $("#errorAlert").hide();
        }, 5000);
        usSpinnerService.stop('invite');
      })
    }
  });
