'use strict';

angular.module('relcyMobileInvitePageApp')
    .service("AmbassadorService", ['$timeout', '$q', '$http','$resource', AmbassadorService]);

/*Session to keep - session specific things*/
function AmbassadorService($timeout, $q, $http,$resource) {
    var APIUrl = "";
	return $resource(
            "http://webapp.relcy.com/redis/24/hmget/",
            {id:"@id",ambId:'@ambId',CID:'@CID',email:'@email',name:'@name',phone:'@phone',platform:'@platform'},
            {
            login: {
                method: 'GET',
                url: 'http://webapp.relcy.com/redis/24/hmget/:id/name/email',
                responseType: 'json'
            },
            invitation:{
                method:'GET',
                url:'https://staging-w.relcy.com/app?ambassador_id=:ambId&client_id=:CID&email_address=:email&name=:name&phone_number=:phone&platform=:platform'
            }
            
        }
    );
}
