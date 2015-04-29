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
		response = response.detail_response;
		if(response){
			var searchResults = response.search_result_collection;
			if(searchResults){
				/*Extracting web search results*/
				try{
					transformedData.webResults = searchResults.webSearchResult.searchResults;
					transformedData.webResults.maxIndex = 3;
				}catch(err){
					console.log('no web results found');
				}
				/*Extracting image search results*/
				try{
					transformedData.imageResults =  searchResults.imageSearchResult.imageSearchResults;
					transformedData.imageResults.maxIndex = 3;
				}catch(err){
					console.log('no image results found');
				}
				/*Extracting video search results*/
				try{
					transformedData.videoResults =  searchResults.videoSearchResult.videoSearchResults;
					transformedData.videoResults.maxIndex = 5;
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







