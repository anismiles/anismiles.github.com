
// JavaScript Document
app.service("SearchService",function($timeout,$q,$http){
	this.searchResult = []
/*	this.getSearchDetails = function()
	{
			var deferred = $q.defer();
		 $http.get('arc-response.json')
		   .success(function(data) { 
			  deferred.resolve(data);
		   }).error(function(msg, code) {
			  deferred.reject(msg);
			 // $log.error(msg, code);
		   });
		 return deferred.promise;
	}*/
	this.search = function(query){
		var session_id = "b9a30926-e912-11e4-b02c-1681e6b88ec1";
		var lat = "37.762759"
		var lng = "-122.408934"
		var query= query
		var request = $http({method: "get", url:"http://animesh.org/test/arc-response-2015_Apr_24_12-21-31.json?sessionId="+session_id+"&lat="+lat+"&lng="+lng+"&query="+query })
		return( request.then( this.handleSuccess, this.handleError ) );
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







