'use strict';

angular.module('relcyApp')
    .service("EntityService", ['$timeout', '$q', '$http','$resource', EntityService]);

/*Session to keep - session specific things*/
function EntityService($timeout, $q, $http,$resource) {

  //this.titleOverride =function(movieName,serviceName,value,header)
  //{
  //  var deferred = $q.defer();
  //  $http.POST('http://nedit-w.relcy.com/'+serviceName+'/'+movieName+'/title',value,header)
  //    .success(function(data) {
  //      deferred.resolve(data);
  //    }).error(deferred.reject);
  //  return deferred.promise;
  //}

	 return $resource(
            "http://nedit-w.relcy.com/",
            {actionType:'@actionType',entityType:'@entityType',entityTitle:'@entityTitle'},
            {
            entityEditor: {
              method: 'POST',
              url: 'http://nedit-w.relcy.com/:entityType/:entityTitle/:actionType',
              responseType: 'json'
            },

            actionOverride: {
              method: 'POST',
              url: 'http://nedit-w.relcy.com/:entityType/:entityTitle/:actionType',
              responseType: 'json'
            },
            entityDelete: {
              method: 'DELETE',
              url: 'http://nedit-w.relcy.com/:entityType/:entityTitle/:actionType',
              responseType: 'json'
            }


        }
    );
}
