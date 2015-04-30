'use strict';

angular.module('relcyApp')
.service("SearchService",function($timeout,$q,$http){
	this.searchResult = []
	this.getSearchDetails = function(query)
	{
		var lat = "37.762759";
		var lng = "-122.408934";
		var deferred = $q.defer();
		$http.get('http://staging-w.relcy.com/search?lat='+lat+'&lng='+lng+'&sessionId=b9a30926-e912-11e4-b02c-1681e6b88ec1&query='+query)
		.success(function(data) { 
			  deferred.resolve(data);
		}).error(function(msg, code) {
			  deferred.reject(msg);
		   });
		 return deferred.promise;
	}

	this.getEntityDetails = function(relcyId)
	{
		var lat = "37.762759";
		var lng = "-122.408934";
		var deferred = $q.defer();
		$http.get('http://staging-w.relcy.com/detail?lat='+lat+'&lng='+lng+'&sessionId=b9a30926-e912-11e4-b02c-1681e6b88ec1&&id='+relcyId)
		.success(function(data) { 
			  deferred.resolve(data);
		}).error(function(msg, code) {
			  deferred.reject(msg);
		   });
		 return deferred.promise;
	};

	this.search = function(query){
		var session_id = "b9a30926-e912-11e4-b02c-1681e6b88ec1";
		var lat = "37.762759"
		var lng = "-122.408934"
		var query= query
		var request = $http({method: "get", url:"/test/arc-response-2015_Apr_24_12-21-31.json?sessionId="+session_id+"&lat="+lat+"&lng="+lng+"&query="+query })
		return( request.then( this.handleSuccess, this.handleError ) );
	};

	this.transformDetails = function(response){
		var transformedData = {};
		transformedData.categories = [];
		response = response.detail_response;
		if(response){
			var searchResults = response.search_result_collection;
			if(searchResults){
				/*Extracting web search results*/
				try{
					transformedData.webResults = searchResults.webSearchResult.searchResults;
					transformedData.webResults.maxIndex = 3;
					transformedData.categories.push({key: 'details_web', keyTitle : 'Web'});
				}catch(err){
					console.log('no web results found');
				}
				/*Extracting image search results*/
				try{
					transformedData.imageResults =  searchResults.imageSearchResult.imageSearchResults;
					transformedData.imageResults.maxIndex = 3;
					transformedData.categories.push({key: 'details_images', keyTitle : 'Images'});
				}catch(err){
					console.log('no image results found');
				}
				/*Extracting video search results*/
				try{
					transformedData.videoResults =  searchResults.videoSearchResult.videoSearchResults;
					transformedData.videoResults.maxIndex = 5;
					transformedData.categories.push({key: 'details_videos', keyTitle : 'Videos'});
				}catch(err){
					console.log('no video results found');
				}
			}
			
			try{
				transformedData.duration = response.results[0].entity_data.entertainment_data.movie_data.length;	
			}catch(err){
				console.log('duration unknown');
			}

			try{
				transformedData.releaseYear = response.results[0].entity_data.entertainment_data.common_data.release_year;	
			}catch(err){
				console.log('release year unknown');
			}

			try{
				transformedData.title = response.results[0].entity_data.common_data.name;	
			}catch(err){
				console.log('title not found/unknown');
			} 

			try{
				transformedData.story = response.results[0].entity_data.common_data.summary;	
			}catch(err){
				console.log('title not found/unknown');
			}

			try{
				transformedData.parentalRating = response.results[0].entity_data.entertainment_data.common_data.parental_rating;	
			}catch(err){
				console.log('parentalRating not found/unknown');
			}

			try{
				transformedData.cast = response.results[0].entity_data.entertainment_data.common_data.performer;	
			}catch(err){
				console.log('cast not found/unknown');
			}

			try{
				if(transformedData.cast){
					transformedData.cast.push(response.results[0].entity_data.entertainment_data.common_data.director);
				}else{
					transformedData.cast = [response.results[0].entity_data.entertainment_data.common_data.director];
				}
			}catch(err){
				console.log('director not found/unknown');
			}

			try{
				transformedData.genre = response.results[0].entity_data.entertainment_data.common_data.genre.join();
				transformedData.genre = transformedData.genre.replace(/&amp;/g, '&');
			}catch(err){
				console.log('cast not found/unknown');
			}
		}

		return transformedData;
	};

	this.handleError = function( response ) 
	{     console.log(response);
		if(response.status == 404  && response.data == 'Result not available.') {
	         return response;
		}
		console.log(response);
		// The API response from the server should be returned in a
		// nomralized format. However, if the request was not handled by the
		// server (or what not handles properly - ex. server error), then we
		// may have to normalize it on our end, as best we can.
		if (
		! angular.isObject( response.data ) ||
		! response.data.message
		) {
		
		return( $q.reject( response ) );
		
		}
		
		// Otherwise, use expected error message.
		return( $q.reject( response) );

	}
	// I transform the successful response, unwrapping the application data
	// from the API response payload.
	this.handleSuccess = function( response )
	{	
		var result =  response.data;
		return( result );		
	} 
})







