'use strict';

angular.module('relcyApp')
  .service("EntityService", ['$timeout', '$q', '$http', '$resource', EntityService]);

/*Session to keep - session specific things*/
function EntityService($timeout, $q, $http, $resource) {
  $http.defaults.headers.common = "{'Content-Type':'application/json'}";
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
    {actionType: '@actionType', entityType: '@entityType', entityTitle: '@entityTitle'},
    {
      entityEditor: {
        method: 'PUT',
        url: 'http://nedit-w.relcy.com/:entityType/:entityTitle/:actionType',
        responseType: 'json'
      },
      actionOverride: {
        method: 'PUT',
        url: 'http://nedit-w.relcy.com/:entityType/:entityTitle/:actionType',
        responseType: 'json'
      },
      entityDelete: {
        method: 'DELETE',
        url: 'http://nedit-w.relcy.com/:entityType/:entityTitle/:actionType',
        //responseType: 'json',
        headers:{'Content-Type':'application/json'}
      },
      entityAdd: {
        method: 'POST',
        url: 'http://nedit-w.relcy.com/:entityType/:entityTitle/:actionType',
        responseType: 'json'
      }
    }
  );
}
