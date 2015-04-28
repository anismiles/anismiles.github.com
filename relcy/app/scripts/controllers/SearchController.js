
angular.module('relcyApp')
.controller("SearchController", function($scope, $http, $rootScope,  $location, SearchService, $filter, anchorSmoothScroll) {
	$scope.selectedTypeIndex = 0;
	$scope.selectedCategory;
	
	$scope.selected = 0;
	$scope.showingResult = false;
	/*The query in the search field of home page*/
	$scope.query;
	 
	$scope.showResult = function(type,index){
		 $scope.selectedTypeIndex = type
		 $scope.resultByType = $scope.types[index]//.searchResultRelcy.results;
	}

	//TODO: Can we remove hardcoding of categories?
	/*Will check if the catagory have results or not*/
	$scope.hasResults = function(type,index){
		switch(type){
			case 'ENTERTAINMENT_VIDEO_MOVIE':
				return ($scope.types[index] && $scope.types[index].searchResultRelcy && $scope.types[index].searchResultRelcy.results && $scope.types[index].searchResultRelcy.results.length);
			break;
			case 'WEB_VIDEOS':
				return ($scope.types[index] && $scope.types[index].videoSearchResult && $scope.types[index].videoSearchResult.videoSearchResults && $scope.types[index].videoSearchResult.videoSearchResults.length);
			break;
			case 'WEB':
				return ($scope.types[index] && $scope.types[index].webSearchResult && $scope.types[index].webSearchResult.searchResults && $scope.types[index].webSearchResult.searchResults.length);
			break;
			case 'APP':
				return ($scope.types[index] && $scope.types[index].searchResultRelcy && $scope.types[index].searchResultRelcy.results && $scope.types[index].searchResultRelcy.results.length);
			break;
			case 'RELATED_SEARCHES':
				return ($scope.types[index] && $scope.types[index].relatedSearchesResult && $scope.types[index].relatedSearchesResult.relatedSearchResults && $scope.types[index].relatedSearchesResult.relatedSearchResults.length);
			break;
			default:
				return false;
			break;
		}
		 
	}
	
	/*Will be called to get an array out of score field*/
	function getScoreArray(score) {
	    return new Array(Math.floor(score));  
	}

	function showHalfRating(score){
		return (score%1)>0;
	}

	$scope.addScores = function(results){
		if(!results) return;
		angular.forEach(results.autocomplete_items, function(a){
			a.scoreArray = getScoreArray(a.score);
			a.showHalfRating = showHalfRating(a.score);
		});
		return results;
	}

	/*Will be invoked everytime search field will be changed on homepage*/
	$scope.onInputChange = function(q){
		$scope.query = q;
	}

	$scope.searchForSelection = function(selection){
		if(selection && selection.title){
			$scope.search(selection.title);
		}
	}

	 /*Start searching for the input query*/
	$scope.search = function(query)
	{
		/*Do nothing when no input in field*/
	 	if(!query) return;
		console.log(query)
		SearchService.getSearchDetails(query).then(function(data) 
		{
			$scope.showingResult = true;
			$scope.result = data['search_response']
			if(!$scope.result.verticalResult) {
				$scope.showingResult = false;
				return;
			}
			$scope.searchResults = transformSearchResults($scope.result.verticalResult);
			$scope.selectedCategory = $scope.searchResults[0].key;
			$scope.types = $scope.result.verticalResult;
			setDefaultCategory();
			
		}, function(error)
		{
			$scope.showingResult = false;
			$scope.gridMessage = 'Error while loading data';
		});
	}
		
	/*Will clear the search field of auto complete with given id.*/
	$scope.clearSearchInput = function(id) {
		$scope.$broadcast('angucomplete-alt:clearInput', 'members');
		/*Hides the search results*/
		$scope.showingResult = false;
		$scope.$broadcast('angucomplete-alt:clearInput', id);		
	}

	/*Will set the default selected category once results come*/
	function setDefaultCategory(){
		for(var i=0;i<$scope.types.length;i++){
			if($scope.hasResults($scope.types[i].content_type_enum,i)){
				$scope.showResult($scope.types[i].content_type_enum,i);	
				break;	
			}
		}
	}

	$scope.scrollTo = function(id) {
		$scope.selectedCategory = id;
		$location.hash(id);
      	// $anchorScroll();
      	anchorSmoothScroll.scrollTo(id);
	}
  
});

/*Will transform the search results so as to be used on UI*/
function transformSearchResults(data){
	var transformedData = [];
	for(var index=0;index<data.length;index++){
		var key = data[index].content_type_enum;
		var values;
		switch(key){
			case 'ENTERTAINMENT_VIDEO_MOVIE':
				if(data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length){
					values = data[index].searchResultRelcy.results;
				}
			break;
			case 'WEB_VIDEOS':
				if(data[index] && data[index].videoSearchResult && data[index].videoSearchResult.videoSearchResults && data[index].videoSearchResult.videoSearchResults.length){
					values = data[index].videoSearchResult.videoSearchResults;
				}
			break;
			case 'WEB':
				if(data[index] && data[index].webSearchResult && data[index].webSearchResult.searchResults && data[index].webSearchResult.searchResults.length){
					values = data[index].webSearchResult.searchResults;
				}
			break;
			case 'WEB_NEWS':
				if(data[index] && data[index].newsSearchResult && data[index].newsSearchResult.newsSearchResults && data[index].newsSearchResult.newsSearchResults.length){
					values = data[index].newsSearchResult.newsSearchResults;
				}
			break;
			case 'APP':
				if(data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length){
					values = [index].searchResultRelcy.results;
				}
			break;
			case 'RELATED_SEARCHES':
				if(data[index] && data[index].relatedSearchesResult && data[index].relatedSearchesResult.relatedSearchResults && data[index].relatedSearchesResult.relatedSearchResults.length){
					values = data[index].relatedSearchesResult.relatedSearchResults;
				}
			break;
		}
		if(values){
			transformedData.push({key: key, values: values, maxIndex: 2, incrementBy: 2});
		}
	}
	return transformedData;
}
