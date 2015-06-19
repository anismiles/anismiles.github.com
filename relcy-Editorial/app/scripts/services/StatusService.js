'use strict';

angular.module('relcyEditorialApp')
    .service("StatusService", ['$timeout', '$q', '$http','$resource', StatusService]);

/*Session to keep - session specific things*/
function StatusService($timeout, $q, $http,$resource) {
     var APIUrl = "http://webapp.relcy.com/redis/22/";
	 return $resource(
            APIUrl,
            {key:"@key"},
            {
            getAllKeys: {
                method: 'GET',
                url: APIUrl+ 'keys/*',
                responseType: 'json'
            },
            getRecordByKeys: {
                method: 'GET',
                url: APIUrl+ 'hgetall/:key',
                responseType: 'json'
            },
            rejectRequest: {
                method: 'GET',
                url: APIUrl+ 'hmset/:key/status/REJECTED',
                responseType: 'json'
            }, 
            approveRequest: {
                method: 'GET',
                url: APIUrl+ 'hmset/:key/status/APPROVED',
                responseType: 'json'
            },    
        }
    );
}
