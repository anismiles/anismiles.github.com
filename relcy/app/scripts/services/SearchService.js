'use strict';

angular.module('relcyApp')
.service("SearchService",function($timeout,$q,$http){
	this.searchResult = [];
	/*Will be used to refer the service itself*/
	var self = this;
	this.getSearchDetails = function(query)
	{
		var lat = "37.762759";
		var lng = "-122.408934";
		var deferred = $q.defer();
		$http.get('http://dev-w.relcy.com/search?lat='+lat+'&lng='+lng+'&sessionId=b9a30926-e912-11e4-b02c-1681e6b88ec1&query='+query)
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
		//$http.get('http://staging-w.relcy.com/detail?lat='+lat+'&lng='+lng+'&sessionId=b9a30926-e912-11e4-b02c-1681e6b88ec1&id=look:3b41f9b9')//+relcyId)
		$http.get('http://dev-w.relcy.com/detail?lat='+lat+'&lng='+lng+'&sessionId=b9a30926-e912-11e4-b02c-1681e6b88ec1&id='+'look:94cd420d')
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
		try{
			var links = response.results[0].link;
			if(links && links.length>0){
				self.insertReviewsAndWatches(transformedData, links);
			}
		}catch(err){
			console.log('Links not available');
		}
		
		if(response){
			var searchResults = response.search_result_collection;
			if(searchResults){
				
				if( response.results[0].content_type_enum == "ENTERTAINMENT_AUDIO")
				{
					try{
						transformedData.audioResult =  response.results[0].content_type_enum;
						//transformedData.audioResult.maxIndex = 5;
						transformedData.categories.push({key: 'details_audio', keyTitle : 'Audio'});
					}catch(err){
						console.log('no audio results found');
					}
				}
				else{
					
					try{
						transformedData.moviesResult =  response.results[0].content_type_enum;
						//transformedData.moviesResult.maxIndex = 5;
						transformedData.categories.push({key: 'details_movies', keyTitle : 'Movies'});
					}catch(err){
						console.log('no movie results found');
					}
				}
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

	/*Will transform the search results so as to be used on UI*/
	this.transformSearchResults = function(data, $scope){
	var transformedData = [];
	for(var index=0;index<data.length;index++){
		var key = data[index].content_type_enum;
		var values=undefined;
		var keyTitle=undefined;
		var template=undefined;
		var maxIndex=undefined, incrementBy=undefined;
		switch(key){
			case 'ENTERTAINMENT_VIDEO_MOVIE':
				if(data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length){
					values = data[index].searchResultRelcy.results;
					keyTitle = 'Movies';
					template = 'ENTERTAINMENT_VIDEO_MOVIE';
					maxIndex = 2;
					incrementBy = 2;
				}
			break;
			case 'ENTERTAINMENT_VIDEO_TVSHOW':
				if(data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length){
					values = data[index].searchResultRelcy.results;
					keyTitle = 'TV Shows';
					template = 'ENTERTAINMENT_VIDEO_TVSHOW';
					maxIndex = 2;
					incrementBy = 2;
				}
			break;
			case 'WEB_VIDEOS':
				if(data[index] && data[index].videoSearchResult && data[index].videoSearchResult.videoSearchResults && data[index].videoSearchResult.videoSearchResults.length){
					values = data[index].videoSearchResult.videoSearchResults;
					keyTitle = 'Videos';
					template = 'WEB_VIDEOS';
					maxIndex = 2;
					incrementBy = 2;
				}
			break;
			case 'WEB_IMAGES':
				if(data[index] && data[index].imageSearchResult && data[index].imageSearchResult.imageSearchResults && data[index].imageSearchResult.imageSearchResults.length){
					values = data[index].imageSearchResult.imageSearchResults;
					keyTitle = 'Images';
					template = 'WEB_IMAGES';
					maxIndex = 2;
					incrementBy = 2;
				}
			break;
			case 'WEB':
				if(data[index] && data[index].webSearchResult && data[index].webSearchResult.searchResults && data[index].webSearchResult.searchResults.length){
					values = data[index].webSearchResult.searchResults;
					keyTitle = 'Web';
					template = 'WEB';
					maxIndex = 10;
					incrementBy = 10;
				}
			break;
			case 'WEB_NEWS':
				if(data[index] && data[index].newsSearchResult && data[index].newsSearchResult.newsSearchResults && data[index].newsSearchResult.newsSearchResults.length){
					values = data[index].newsSearchResult.newsSearchResults;
					keyTitle = 'News';
					template = 'WEB_NEWS';
					maxIndex = 10;
					incrementBy = 10;
				}
			break;
			case 'APP':
				if(data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length){
					values = data[index].searchResultRelcy.results;
					keyTitle = 'App';
					template = 'APP';
					maxIndex = 2;
					incrementBy = 2;
				}
			break;
			case 'RELATED_SEARCHES':
				if(data[index] && data[index].relatedSearchesResult && data[index].relatedSearchesResult.relatedSearchResults && data[index].relatedSearchesResult.relatedSearchResults.length){
					$scope.relatedSearches = data[index].relatedSearchesResult.relatedSearchResults;
				}
				values=undefined;
			break;
			default:
				maxIndex = 2;
				incrementBy = 2;
				try{
					values = data[index].searchResultRelcy.results;
					keyTitle = key;
					template = 'ENTERTAINMENT_VIDEO_MOVIE';
				}catch(err){
					console.log('not a relcy result');
					try{
						values = data[index].videoSearchResult.videoSearchResults;
						keyTitle = key;
						template = 'ENTERTAINMENT_VIDEO_MOVIE';
					}catch(err){
						console.log('not a video search result');
						try{
							values = data[index].imageSearchResult.imageSearchResult;
							keyTitle = key;
							template = 'WEB_IMAGES';
						}catch(err){
							console.log('not a image search result');
						}
					}
				}
			break;
			}
			if(values){
				transformedData.push({key: key, values: values,keyTitle: keyTitle,  maxIndex: maxIndex, incrementBy: incrementBy, template: template});
			}
		}
		return transformedData;
	};

	/*Will insert the reviews and watches into the transformedData*/
	this.insertReviewsAndWatches = function(transformedData, links, response){
		transformedData.reviews = [];
		transformedData.watches = [];
		angular.forEach(links, function(l){
			try{
				var action = l.app_result.result_data.action;
				switch(action){
					case 'Reviews':
						transformedData.reviews.push(l);
					break;
					case 'Watch':
						transformedData.watches.push(l);
					break;
				}
			}catch(err){
				console.log('invalid link');
			}
		});
	};
	
	/*Will check if the response contains this type of action or not*/
	this.hasLinkType = function(type, response){
		var actions = response.results[0].app_action;
		for(var i=0;i<actions.length;i++){
			if(actions[i]==type){
				return true;
			}
		}
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

