angular.module('relcyApp')
    .controller('LoginController', [
        '$scope',
        '$http',
        '$rootScope',
        '$location',
        '$window',
        '$timeout',
        '$stateParams',
		'$state',
		'$cookies',
        LoginController]);

function LoginController($scope, $http, $rootScope, $location, $window, $timeout, $stateParams,$state,$cookies) {
	
	$rootScope.hideLoader = true;
	$scope.loginInfo = {};
    $scope.login = function()
	{
		if($scope.loginInfo.username=="admin"  && $scope.loginInfo.password=="1234")
		{
			console.log("user password is correct")
			$cookies.put('LoggedIn', 'true')
			$state.go('search')
			
		}
		else
		{
			$scope.errorMsg = 'Wrong username or password.'
		}
	}
}

