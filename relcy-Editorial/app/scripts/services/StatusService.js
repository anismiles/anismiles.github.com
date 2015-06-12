'use strict';

angular.module('relcyEditorialApp')
    .service("StatusService", ['$timeout', '$q', '$http','$resource', StatusService]);

/*Session to keep - session specific things*/
function StatusService($timeout, $q, $http,$resource) {

	 return $resource(
            "http://webapp.relcy.com/redis/22/",
            {key:"@key"},
            {
            getAllKeys: {
                method: 'GET',
                url: 'http://webapp.relcy.com/redis/22/keys/*',
                responseType: 'json'
            },
            getRecordByKeys: {
                method: 'GET',
                url: 'http://webapp.relcy.com/redis/22/hgetall/:key',
                responseType: 'json'
            },
            rejectRequest: {
                method: 'GET',
                url: 'http://webapp.relcy.com/redis/22/hmset/:key/status/REJECTED',
                responseType: 'json'
            }, 
            approveRequest: {
                method: 'GET',
                url: 'http://webapp.relcy.com/redis/22/hmset/:key/status/APPROVED',
                responseType: 'json'
            },    
        }
    );
}
