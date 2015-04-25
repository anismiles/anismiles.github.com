
app.controller("SearchController", function($scope, $http, $rootScope,  $location, SearchService,$filter) {
	$scope.selectedTypeIndex = 0;
	//$scope.query;
	$scope.selected = 0;
	$scope.showingResult = false;
	$scope.query;
	$scope.getData = function()
	{
		SearchService.getSearchDetails().then(function (data){
			
			$scope.result = data['search_response']
			$scope.types = $scope.result.verticalResult;
			 $scope.showResult($scope.types[0].content_type_enum,0);
			})
			
	}
	 
	 $scope.showResult = function(type,index)
	 {
		 $scope.selected = index;
		 $scope.selectedTypeIndex = type
		 $scope.resultByType = $scope.types[index]//.searchResultRelcy.results;
	}
	$scope.closeResult=function()
	{
		$scope.showingResult = false;
		$scope.query=""
	}
	 $scope.search = function()
	 {
		 console.log($scope.query)
		SearchService.search($scope.query).then(function(data) 
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
	//$scope.getData()
  
});

