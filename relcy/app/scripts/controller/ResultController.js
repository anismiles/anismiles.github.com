
app.controller("ResultController", function($scope, $http, $rootScope,  $location, SearchService) {
	$scope.getData = function()
	{
		SearchService.getSearchDetails().then(function (data){
			
			$scope.search_response = data['search_response'];console.log($scope.search_response)
			})
	}
	 
	$scope.getData();
		
});

