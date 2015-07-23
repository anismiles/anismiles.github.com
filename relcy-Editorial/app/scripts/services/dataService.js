'use strict';

angular.module('relcyEditorialApp')
    .service("DataService", ['$timeout', '$q', '$http','$resource', DataService]);

/*Session to keep - session specific things*/
function DataService($timeout, $q, $http,$resource) {
	 return {
     pendingRecords:[],
     approvedRecords:[],
     rejectedRecords:[]
   }
}
