
app.controller("MainController", function($scope, $http, $rootScope,  $location, SearchService) {
	
	$scope.getData =  function(){
		SearchService.getSearchDetails.then(function(result) {
			console.log(result)
			})
		}
});

