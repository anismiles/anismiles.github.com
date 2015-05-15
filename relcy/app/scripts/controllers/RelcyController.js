angular.module('relcyApp')
.controller('RelcyController', [
	'$scope',
	'$http', 
	'$rootScope', 
	'$location', 
	'$window',
	'$timeout',
	'$stateParams',
	'SearchService',
	'$filter',
	'anchorSmoothScroll',
	'Lightbox',
	RelcyController]);

function RelcyController($scope, $http, $rootScope, $location, $window, $timeout,
 $stateParams, SearchService, $filter, anchorSmoothScroll, Lightbox){
	var DEFAULT_BANNER = 'img-no-min/Lighthouse.png';
	angular.extend($scope, {types:[], query: '', showDetailPage: false, showingResult: false})
	/*Will check if the catagory have results or not*/
    $scope.hasResults = function (type, index) {
         return SearchService.hasResults(type, index, $scope.types);
    }

	/*Will clear the search field of auto complete with given id.*/
    $scope.clearSearchInput = function (id) {
        $scope.hideMainSearch = false;
        $scope.showDetailPage = false;
        $scope.$broadcast('angucomplete-alt:clearInput', 'members');
        /*Hides the search results*/
        $scope.showingResult = false;
        $scope.$broadcast('angucomplete-alt:clearInput', id);
    }    

    $scope.reload = function () {
        window.location.reload();
    }

    /*Will be called to get an array out of score field*/
    function getScoreArray(score) {
        if (!score) return [];
        return new Array(Math.floor(score));
    }

    function showHalfRating(score) {
        return (score % 1) > 0;
    }

    /*Will add ratings to auto search results*/
    $scope.addScores = function (results) {
        if (!results) return;
        angular.forEach(results.auto_complete_response.auto_complete_item, function (a) {
            a.scoreArray = getScoreArray(a.score);
            a.showHalfRating = showHalfRating(a.score);
        });
        return results.auto_complete_response;
    }

    /*Will add rating array to app resutls*/
    $scope.addScoresToAppResluts = function (results) {
        if (!results) return;
        angular.forEach(results, function (a) {
            a.scoreArray = getScoreArray(a.app_result[0].score);
            a.showHalfRating = showHalfRating(a.app_result[0].score);
        });
        return results;
    }

    /*Will add rating array to local business resutls*/
    $scope.addScoresToPlaceResluts = function (results) {
        if (!results) return;
        angular.forEach(results, function (a) {
            try {
                var rating = a.entity_data.common_data.display_rating[0];
                var score;
                var style = rating.rating_style;
                if (style == 'STAR') {
                    score = rating.rating;
                    a.scoreArray = getScoreArray(score);
                    a.showHalfRating = showHalfRating(score);
                } else {
                    a.rating = rating.rating + '/' + rating.max_rating;
                    a.showStrRating = true;
                }
                a.ratingSource = rating.source;
            } catch (err) {
                console.log('rating not avlbl for this one');
            }

        });
        return results;
    }

    /*Will add rating array to movies resutls*/
    $scope.addScoresToVideoMovies = function (results) {
        if (!results) return;
        angular.forEach(results, function (a) {
            var score = a.score / 20;
            a.scoreArray = getScoreArray(score);
            a.showHalfRating = showHalfRating(score);
        });
        return results;
    };

    /*Will scroll to this id*/
    $scope.scrollTo = function (id) {
        $scope.selectedCategory = id;
        if (id == 'container') {
            $scope.showTopAnchor = false;
            /*Set first element in categories as selected*/
            if ($scope.searchResults.length > 0) {
                $scope.selectedCategory = $scope.searchResults[0].key;
            }
        } else {
            try {
                if ($scope.searchResults[0].key == id) {
                    $scope.showTopAnchor = false;
                } else {
                    $scope.showTopAnchor = true;
                }
            } catch (err) {
                console.log('nothing there in first category!');
            }
        }

        $location.hash(id);
        // $anchorScroll();
        anchorSmoothScroll.scrollTo(id);
    }

    function setTextOnSearchField(text){
    	$scope.query = text;
    	$scope.$broadcast('angucomplete-alt:clearInput', 'members');
        $timeout(function () {
            angular.element(document.querySelector('#members')).children().children()[0].value = text;
        }, 250);
    }
}