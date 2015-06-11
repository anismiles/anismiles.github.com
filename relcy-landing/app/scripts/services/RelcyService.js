'use strict';

angular.module('siteApp')
    .service("RelcyService", ['$timeout', '$q', '$http','$resource', RelcyService]);

/*Session to keep - session specific things*/
function RelcyService($timeout, $q, $http,$resource) {

	 return $resource(
            "https://staging-w.relcy.com/app",
            {client_id: "@client_id",platform: "@platform",phone_number:"@phone_number",ambassador_id:"@ambassador_id"},
            {
            savePhoneNumber: {
                method: 'GET',
                url: 'https://staging-w.relcy.com/app?platform=:platform&phone_number=:phone_number&client_id=:client_id',
                responseType: 'json'
            }      
        }
    );
}
