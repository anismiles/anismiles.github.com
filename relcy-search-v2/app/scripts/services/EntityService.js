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
            {movieName: "@movieName",serviceName:"@serviceName"},
            {
            bgImageOverride: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/bg-image',
                responseType: 'json'
            },
            heroImageOverride: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/hero-image',
                responseType: 'json'
            },
            titleOverride: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/title',
                responseType: 'json'
            },
            ratingOverride: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/rating',
                responseType: 'json'
            },
            yearOverride: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/year',
                responseType: 'json'
            },
            lengthOverride: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/length',
                responseType: 'json'
            },
            genresOverride: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/genre',
                responseType: 'json'
            },
            storyOverride: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/story',
                responseType: 'json'
            },
            castOverride: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/cast',
                responseType: 'json'
            },
            trailerOverride: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/trailer',
                responseType: 'json'
            },
            bgImageAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/bg-image',
                responseType: 'json'
            },
            heroImageAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/hero-image',
                responseType: 'json'
            },
            titleAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/title',
                responseType: 'json'
            },
            ratingAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/rating',
                responseType: 'json'
            },
            yearAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/year',
                responseType: 'json'
            },
            lengthAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/length',
                responseType: 'json'
            },
            genresAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/genres',
                responseType: 'json'
            },
            storyAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/story',
                responseType: 'json'
            },
            castAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/cast',
                responseType: 'json'
            },
            trailerAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/trailer',
                responseType: 'json'
            },
            bgImageDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/bg-image',
                responseType: 'json'
            },
            heroImageDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/hero-image',
                responseType: 'json'
            },
            titleDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/title',
                responseType: 'json'
            },
            ratingDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/rating',
                responseType: 'json'
            },
            yearDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/year',
                responseType: 'json'
            },
            lengthDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/length',
                responseType: 'json'
            },
            genresDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/genres',
                responseType: 'json'
            },
            storyDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/story',
                responseType: 'json'
            },
            castDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/cast',
                responseType: 'json'
            },
            trailerDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/:serviceName/:movieName/trailer',
                responseType: 'json'
            }
        }
    );
}
