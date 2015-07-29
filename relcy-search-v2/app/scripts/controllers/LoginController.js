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
        LoginController]);

function LoginController($scope, $http, $rootScope, $location, $window, $timeout, $stateParams,$state) {
	 $rootScope.hideLoader = true;
	$scope.loginInfo = {};
    $scope.login = function()
	{
		if($scope.loginInfo.username=="admin"  && $scope.loginInfo.password=="!relcyadmin@2015!")
		{
			console.log("user password is correct")
			$state.go('search')
			
		}
		else
		{
			$scope.errorMsg = 'Wrong username or password.'
		}
	}
}

