'use strict';

angular.module('relcyMobileInvitePageApp')
    .service("AmbassadorService", ['$timeout', '$q', '$http','$resource', AmbassadorService]);

/*Session to keep - session specific things*/
function AmbassadorService($timeout, $q, $http,$resource) {
    var BASE_URL = "https://dev-w.relcy.com/";
    var REDIS_BASE_URL = "http://webapp.relcy.com/redis/";
	return $resource(
            REDIS_BASE_URL+"24/hmget/",
            {id:"@id",ambId:'@ambId',CID:'@CID',email:'@email',name:'@name',phone:'@phone',platform:'@platform'},
            {
            login: {
                method: 'GET',
                url: REDIS_BASE_URL+'24/hmget/:id/name/email',
                responseType: 'json'
            },
            invitation:{
                method:'GET',
                url: BASE_URL+'app?ambassador_id=:ambId&client_id=:CID&email_address=:email&name=:name&phone_number=:phone&platform=:platform'
            }
            
        }
    );
}
