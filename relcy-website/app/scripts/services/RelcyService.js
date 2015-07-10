'use strict';

angular.module('relcyWebsiteApp')
  .service("RelcyService", ['$timeout', '$q', '$http', '$resource', RelcyService]);

/*Session to keep - session specific things*/
function RelcyService($timeout, $q, $http, $resource) {
  /*staging*/
  //var APIUrl = "https://staging-w.relcy.com/app";
  /*dev*/
  //var APIUrl = "https://dev-w.relcy.com/app";
  /*prod*/
  var APIUrl = "https://api-w.relcy.com/app";

  return $resource(
    APIUrl,
    {client_id: "@client_id", platform: "@platform", phone_number: "@phone_number", ambassador_id: "@ambassador_id"},
    {
      savePhoneNumber: {
        method: 'GET',
        url: APIUrl + '?platform=:platform&phone_number=:phone_number&client_id=:client_id',
        responseType: 'json'
      }
    }
  );
}
