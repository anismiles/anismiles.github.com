'use strict';

angular.module('relcyEditorialApp')
    .service("StatusService", ['$timeout', '$q', '$http','$resource', StatusService]);



function StatusService($timeout, $q, $http,$resource) {
     var BASE_URL = "http://webapp.relcy.com/redis/";
	 return $resource(
            BASE_URL,
            {key:"@key"},
            {
            getAllKeys: {
                method: 'GET',
                url: BASE_URL+ '22/keys/*',
                responseType: 'json'
            },
            getRecordByKeys: {
                method: 'GET',
                url: BASE_URL+ '22/hgetall/:key',
                responseType: 'json'
            },
            rejectRequest: {
                method: 'GET',
                url: BASE_URL+ '22/hmset/:key/status/REJECTED',
                responseType: 'json'
            }, 
            approveRequest: {
                method: 'GET',
                url: BASE_URL+ '22/hmset/:key/status/APPROVED',
                responseType: 'json'
            },    
        }
    );
}
