
angular.module('relcyApp')
.controller("SearchController", function($scope, $http, $rootScope,  $location, SearchService,$filter) {
	$scope.selectedTypeIndex = 0;
	
	$scope.selected = 0;
	$scope.showingResult = false;
	/*The query in the search field of home page*/
	$scope.query;
	 
	 $scope.showResult = function(type,index)
	 {
		 $scope.selected = index;
		 $scope.selectedTypeIndex = type
		 $scope.resultByType = $scope.types[index]//.searchResultRelcy.results;
	}
	
	$scope.onInputChange = function(q){
		$scope.query = q;
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
			$scope.types = $scope.result.verticalResult;
			$scope.showResult($scope.types[0].content_type_enum,0);
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
  
});

