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
    'Session',
    RelcyController]);

function RelcyController($scope, $http, $rootScope, $location, $window, $timeout, $stateParams, SearchService, $filter, anchorSmoothScroll, Lightbox, Session) {

  angular.extend($rootScope, {selectedCategory: '', showTopAnchor: false});
  angular.extend($scope, {types: [], query: '', selectedTypeIndex: 0});


  /*Will check if the catagory have results or not*/
  $scope.hasResults = function (type, index) {
    return SearchService.hasResults(type, index, $scope.types);
  };

  /*Asking and fetching the current location*/
  $window.navigator.geolocation.getCurrentPosition(function (position) {
    $scope.$apply(function () {
      Session.position = position;
      console.log(position);
    });
  }, function (error) {
  });

  ///*Will clear the search field of auto complete with given id.*/
  //$scope.clearSearchInput = function (id) {
  //  $scope.showDetailPage = false;
  //  $scope.$broadcast('angucomplete-alt:clearInput', 'searchInputText');
  //  /*Hides the search results*/
  //  $scope.showingResult = false;
  //  $scope.$broadcast('angucomplete-alt:clearInput', id);
  //};

  $rootScope.reload = function () {
    SearchService.searchTxt =''
    $location.path('/').search({q: ''});
    $("#container").removeClass("body");
  };

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
  };

  $scope.me = function()
  {
    console.log("me here")
  }
  /*Will add rating array to app resutls*/
  $scope.addScoresToAppResluts = function (results) {
    if (!results) return;
    angular.forEach(results, function (a) {
      a.scoreArray = getScoreArray(a.app_result[0].score);
      a.showHalfRating = showHalfRating(a.app_result[0].score);
    });
    return results;
  };

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
  };

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
    $rootScope.selectedCategory = id;
    if (id == 'container') {
      $rootScope.showTopAnchor = false;
      /*Set first element in categories as selected*/
      if (SearchService.searchResults.length > 0) {
        $rootScope.selectedCategory = SearchService.searchResults[0].key;
      }
    } else {
      try {
        if (SearchService.searchResults[0].key == id) {
          $rootScope.showTopAnchor = false;
        } else {
          $rootScope.showTopAnchor = true;
        }
      } catch (err) {
        console.log('nothing there in first category!');
      }
    }

    //$location.hash(id);
    // $anchorScroll();
    anchorSmoothScroll.scrollTo(id);
  };

  $scope.onAutoCompleteSelect = function (item) {
    if (!item) return;
    if (item.originalObject.lookIds && item.originalObject.lookIds[0]) {
      $location.path('/detail').search({
        q: item.title,
        cipher: item.originalObject.entity_id,
        cType: item.originalObject.content_type_enum,
        entity: item.originalObject.lookIds[0],
        img: item.image || ''
      });
    } else {
      $location.path('search').search({q: item.title});
    }
  };

  $scope.setTextOnSearchField = function (text) {
    $scope.query = text;
    $scope.$broadcast('angucomplete-alt:clearInput', 'searchInputText');
    $timeout(function () {
      angular.element(document.querySelector('#searchInputText')).children().children()[0].value = text;
    }, 250);
  };
  $rootScope.openCastLightbox = function (data, type, index) {
    //console.log("hello openCastLightbox")
    Lightbox.type = type;
    //data = 'http://www.youtube.com/embed/XGSy3_Czz8k?autoplay=1';
    Lightbox.data = data;

    if (type == 'VIDEO') {
      for (var i = 0; i < data.length; i++) {
        try {
          if (data[i].contentUrl.indexOf("youtube") > -1) {
            var url = data[i].contentUrl.replace("watch?v=", "embed/");
            url = url + '?autoplay=1';
            Lightbox.data = {value: url, title: data[i].title, duration: data[i].duration};
            break;
          }
        } catch (err) {
          console.log('something went wrong!');
        }
      }
      if (!Lightbox.data.value) {
        Lightbox.data = {value: data[0].contentUrl};
      }
    }
    if (type == 'IMAGES') {
      $scope.images = [];
      for (var i = 0; i < data.length; i++) {
        $scope.images.push(
          {
            'url': data[i].contentUrl,
            'caption': data[i].title,
            'thumbUrl': data[i].thumbnailUrl,// used only for this example
            'dimensions': data[i].dimensions
          })
      }
      Lightbox.openModal($scope.images, index);
    } else {
      //Opening lightbox only if data is having a value
      // if(!data.value) return;
      Lightbox.openModal([Lightbox.data], 0);
    }
  };
}
