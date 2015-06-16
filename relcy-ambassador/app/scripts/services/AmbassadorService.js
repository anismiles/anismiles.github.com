'use strict';

angular.module('relcyMobileInvitePageApp')
    .service("AmbassadorService", ['$timeout', '$q', '$http','$resource', AmbassadorService]);

/*Session to keep - session specific things*/
function AmbassadorService($timeout, $q, $http,$resource) {

	 return $resource(
            "http://webapp.relcy.com/redis/24/hmget/",
            {id:"@id"},
            {
            login: {
                method: 'GET',
                url: 'http://webapp.relcy.com/redis/24/hmget/:id/name/email',
                responseType: 'json'
            },
            
        }
    );
}
