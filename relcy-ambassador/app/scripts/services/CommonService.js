
'use strict';

angular.module('relcyMobileInvitePageApp')
    .service("CommonService", ['$timeout', '$q', '$http','$resource', CommonService]); 
 
function CommonService() {
	 this.ambId = ""
}
