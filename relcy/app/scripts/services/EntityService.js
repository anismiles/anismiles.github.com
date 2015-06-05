'use strict';

angular.module('relcyApp')
    .service("EntityService", ['$timeout', '$q', '$http','$resource', EntityService]);

/*Session to keep - session specific things*/
function EntityService($timeout, $q, $http,$resource) {

	 return $resource(
            "http://nedit-w.relcy.com/",
            {movieName: "@movieName"},
            {
            bgImageOverride: {
                method: 'PUT',
                url: 'http://nedit-w.relcy.com/movies/:movieName/bg-image',
                responseType: 'json'
            }, 
            heroImageOverride: {
                method: 'PUT',
                url: 'http://nedit-w.relcy.com/movies/movies/:movieName/hero-image',
                responseType: 'json'
            },
            titleOverride: {
                method: 'PUT',
                url: 'http://nedit-w.relcy.com/movies/:movieName/title',
                responseType: 'json'
            },
            ratingOverride: {
                method: 'PUT',
                url: 'http://nedit-w.relcy.com/movies/movies/:movieName/rating',
                responseType: 'json'
            },
            yearOverride: {
                method: 'PUT',
                url: 'http://nedit-w.relcy.com/movies/movies/:movieName/year',
                responseType: 'json'
            },
            lengthOverride: {
                method: 'PUT',
                url: 'http://nedit-w.relcy.com/movies/movies/:movieName/length',
                responseType: 'json'
            },
            genresOverride: {
                method: 'PUT',
                url: 'http://nedit-w.relcy.com/movies/movies/:movieName/genres',
                responseType: 'json'
            },  
            storyOverride: {
                method: 'PUT',
                url: 'http://nedit-w.relcy.com/movies/movies/:movieName/story',
                responseType: 'json'
            },  
            castOverride: {
                method: 'PUT',
                url: 'http://nedit-w.relcy.com/movies/movies/:movieName/cast',
                responseType: 'json'
            },  
            trailerOverride: {
                method: 'PUT',
                url: 'http://nedit-w.relcy.com/movies/:movieName/trailer',
                responseType: 'json'
            },  
            bgImageAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/movies/:movieName/bg-image',
                responseType: 'json'
            }, 
            heroImageAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/movies/:movieName/hero-image',
                responseType: 'json'
            },
            titleAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/movies/:movieName/title',
                responseType: 'json'
            },
            ratingAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/movies/:movieName/rating',
                responseType: 'json'
            },
            yearAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/movies/:movieName/year',
                responseType: 'json'
            },
            lengthAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/movies/:movieName/length',
                responseType: 'json'
            },
            genresAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/movies/:movieName/genres',
                responseType: 'json'
            },  
            storyAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/movies/:movieName/story',
                responseType: 'json'
            },  
            castAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/movies/:movieName/cast',
                responseType: 'json'
            },  
            trailerAdd: {
                method: 'POST',
                url: 'http://nedit-w.relcy.com/movies/:movieName/trailer',
                responseType: 'json'
            }, 
            bgImageDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/movies/:movieName/bg-image',
                responseType: 'json'
            }, 
            heroImageDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/movies/:movieName/hero-image',
                responseType: 'json'
            },
            titleDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/movies/:movieName/title',
                responseType: 'json'
            },
            ratingDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/movies/:movieName/rating',
                responseType: 'json'
            },
            yearDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/movies/:movieName/year',
                responseType: 'json'
            },
            lengthDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/movies/:movieName/length',
                responseType: 'json'
            },
            genresDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/movies/:movieName/genres',
                responseType: 'json'
            },  
            storyDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/movies/:movieName/story',
                responseType: 'json'
            },  
            castDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/movies/:movieName/cast',
                responseType: 'json'
            },  
            trailerDelete: {
                method: 'DELETE',
                url: 'http://nedit-w.relcy.com/movies/:movieName/trailer',
                responseType: 'json'
            },              
        }
    );
}
