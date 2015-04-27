
angular.module('relcyApp')
.controller("SearchController", function($scope, $http, $rootScope,  $location, SearchService,$filter) {
	$scope.selectedTypeIndex = 0;
	
	$scope.selected = 0;
	$scope.showingResult = false;
	/*The query in the search field of home page*/
	$scope.query;
	 
	$scope.showResult = function(type,index){
		 $scope.selected = index;
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
			//SearchService.searchResult = 
			$scope.showingResult = true;
			$scope.result = data['search_response']
			if(!$scope.result.verticalResult) {
				$scope.showingResult = false;
				return;
			}
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
  
});

