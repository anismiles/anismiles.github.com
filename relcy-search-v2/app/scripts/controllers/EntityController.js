angular.module('relcyApp')
  .controller('EntityController', [
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
    'EntityService',
    EntityController]);


function EntityController($scope, $http, $rootScope, $location, $window, $timeout, $stateParams, SearchService, $filter, anchorSmoothScroll, Lightbox, EntityService) {
  console.log('stateParams: ' + $stateParams.entity);
  console.log('stateParams: ' + $stateParams.cipher);
  console.log('stateParams: ' + $stateParams.cType);
  console.log('stateParams: ' + $stateParams.q);
  console.log('stateParams: ' + $stateParams.artist);

  $scope.selected = 0;
  $scope.defaultErrorImage = '../../favicon.ico';
  $scope.itemType;
  $scope.itemDetails;
  $scope.placeDistance = '';
  $rootScope.showTopAnchor = false;
  $scope.showEdit = false;
  $scope.toggle = false;
  $scope.suggestedSearch = false;
  $scope.searchResultShow = true;
  $scope.maxShowSerachRecord = {max: 100, increment: 100};

  if (SearchService.searchTxt) {
    $scope.searchTxt = SearchService.searchTxt;
    if ($scope.searchTxt) {
      $("#pageMiddle").css({'margin-top': '0%'});
    }
  }
  else {
    if ($stateParams.q) {
      $scope.searchTxt = $stateParams.q;
      $("#pageMiddle").css({'margin-top': '0%'});
    }
  }

  /*Will be invoked everytime search field will be changed on homepage*/
  $scope.onInputChange = function (q) {
    $scope.query = q;
    if (q && q.length >= 1) {
      $("#pageMiddle").animate({'margin-top': '0%'}, 200);
      $("#pageMiddle").addClass("innerPageMiddle");
    }
  };

  //search on click
  $scope.searchOnclick = function (str) {
    $scope.searchTxt = str;
    SearchService.searchTxt = str;
    $location.search('q', str);
  };

  $scope.setFocusOnSearch = function () {
    $("#searchInputText").focus();
    console.log("focus ")
  };

  var intervalCounter = -1;
  $scope.selectedIndexOfSearchItem = -1;
  $scope.keyDown = function (val) {
    //console.log(val + " " )
    if (!$scope.suggestedSearch) {
      return;
    }
    if (!(val === 40 || val === 38)) {
      clearInterval(intervalCounter);
      intervalCounter = setInterval(function () {
        clearInterval(intervalCounter);
        $scope.searchOnRelcy();
      }, 350);
      return;
    }
    if (val === 40) {
      $scope.selectedIndexOfSearchItem++;
      //down
      //console.log(">--->> Down " + val)
    }
    else if (val === 38) {
      $scope.selectedIndexOfSearchItem--;
      // up
      //console.log(">--->> Up " + val)
    }

    var max = $scope.maxShowSerachRecord.max <= $scope.searchResultsOfRelcy.length ? $scope.maxShowSerachRecord.max : $scope.searchResultsOfRelcy.length

    if ($scope.selectedIndexOfSearchItem <= -1) {
      $scope.selectedIndexOfSearchItem = max - 1;
    }
    if ($scope.selectedIndexOfSearchItem >= max) {
      $scope.selectedIndexOfSearchItem = 0;
    }
    console.log(">--->> index " + $scope.selectedIndexOfSearchItem + " = " + max);

    var tmpList = angular.element(document.getElementById('serachResultList')).find('li');
    $(tmpList).removeClass('activeList');
    var t = tmpList[$scope.selectedIndexOfSearchItem];
    $(t).addClass('activeList');
    $scope.searchTxt = $scope.searchResultsOfRelcy[$scope.selectedIndexOfSearchItem].title;
    SearchService.searchTxt = $scope.searchTxt;

  };

  $scope.searchOnclick = function (str) {
    $scope.searchTxt = str;
    SearchService.searchTxt = str;
    $location.search('q', str);
  };

  var temp_Interval;
  /* getting search result from server by DT*/
  $scope.searchOnRelcy = function () {
    console.log("searching....");
    $scope.selectedIndexOfSearchItem = -1;
    $("#bigform").addClass("big-form-no-bdr-btm ");
    $scope.maxShowSerachRecord = {max: 100, increment: 100};
    var q = $("#searchInputText").val();

    SearchService.searchTxt = $scope.searchTxt;

    $scope.query = q;
    if (q && q.length >= 1) {
      $("#container").addClass("body");
      $("#pageMiddle").animate({'margin-top': '0%'}, 200);
      $("#bigform").addClass("big-form-no-bdr-btm ");

    }
    if (!q) {
      $scope.suggestedSearch = false;
      $scope.showSearch = false;
      $scope.providedBy = false;
      return;
    }

    $scope.searchResultShow = false;
    clearInterval(temp_Interval);
    temp_Interval = setInterval(function () {
      SearchService.searchOnRelcy(q).then(function (data) {
        clearInterval(temp_Interval);
        var qq = $("#searchInputText").val();
        console.log("result ** " + qq);
        if (qq.length == 0) {
          $scope.suggestedSearch = false;
          $scope.showSearch = false;
          return;
        }
        $scope.suggestedSearch = true;
        $scope.providedBy = true;
        $scope.searchResultsOfRelcy = data.auto_complete_response.auto_complete_item;
      }, function (error) {
        $scope.showingResult = false;
        $scope.gridMessage = 'Error while loading data';
        $rootScope.hideLoader = true;
      });
    }, 100)
  };

  $scope.searchAll = function () {
    if ($scope.selectedIndexOfSearchItem !== -1) {
      var item = $scope.searchResultsOfRelcy[$scope.selectedIndexOfSearchItem];
      if (!item.entity_id && !item.lookIds) {
        $location.search('q', item.title);
        return;
      }

      $location.path('detail').search({
        q: item.title,
        cType: item.content_type_enum,
        entity: item.lookIds[0],
        cipher: item.entity_id,
        img: item.image
      });

      return;
    }

    $scope.suggestedSearch = false;
    if (!$scope.searchTxt) return;
    $location.path('search').search({q: $scope.searchTxt});
    $rootScope.hideLoader = false;
    //$location.path('search').search({q: $scope.query});
    //$state.go('/search?q='+$scope.query)

    //$scope.search($scope.query);
  };

  $scope.selectResult = function (item) {

    SearchService.searchTxt = item.title;
    //detail({q:result.entity_data.common_data.name, cType:cat.key, entity: result.relcy_id.entity_id, cipher: result.relcy_id.cipher_id, img: result.image_info[0].thumbnail.mediaURL })
    if (!item.entity_id && !item.lookIds) {
      $location.search('q', item.title);
      return;
    }

    $location.path('detail').search({
      q: item.title,
      cType: item.content_type_enum,
      entity: item.lookIds[0],
      cipher: item.entity_id,
      img: item.image
    });
  };

  /* DT: templateType is used to identify which edit template will load */

  // 1 for title
  // 2 for release Year"
  // 3 for genre
  // 4 for rating
  // 5 for story
  // 6 for trailer
  // 7 for Hero Image
  // 8 for Profile Image

  angular.extend($scope, {
    center: {
      lat: 0,
      lng: 0,
      zoom: 8
    },
    mapData: {markers: {}}
  });


  $scope.showHideEdit = function () {
    $scope.showEdit = !$scope.showEdit;
    var thumbnailUrl;
    try {
      thumbnailUrl = $scope.itemDetails.imageResults[0].thumbnailUrl;
    } catch (er) {
      thumbnailUrl = $scope.thumbnailImgUrl;
    }
    // template start //
    $scope.EditData = {
      title: $scope.itemDetails.title === undefined ? '' : $scope.itemDetails.title,
      parentalRating: $scope.itemDetails.parentalRating === undefined ? '' : $scope.itemDetails.parentalRating,
      releaseYear: parseInt($scope.itemDetails.releaseYear === undefined ? '' : $scope.itemDetails.releaseYear),
      duration: parseInt($scope.itemDetails.duration === undefined ? '' : $scope.itemDetails.duration),
      genre: $scope.itemDetails.genre === undefined ? '' : $scope.itemDetails.genre,
      displayRating: $scope.itemDetails.displayRating === undefined ? '' : $scope.itemDetails.displayRating,
      story: $scope.itemDetails.story === undefined ? '' : $scope.itemDetails.story.value,
      videoResults: $scope.itemDetails.videoResults === undefined ? '' : $scope.itemDetails.videoResults[0].contentUrl,
      bannerUrl: $scope.bannerUrl === undefined ? '' : $scope.bannerUrl,
      workTitle: $scope.itemDetails.workTitle === undefined ? '' : $scope.itemDetails.workTitle,
      thumbnailUrl: thumbnailUrl === undefined ? '' : thumbnailUrl,
      menuLink: $scope.itemDetails.menu === undefined ? '' : $scope.itemDetails.menu[0].link_id,
      call: $scope.itemDetails.call === undefined ? '' : $scope.itemDetails.call[0].number.value,
      display_address: $scope.itemDetails.mapinfo === undefined ? '' : $scope.itemDetails.mapinfo.address.display_address,
      category: $scope.itemDetails.category === undefined ? '' : $scope.itemDetails.category,
      placeDistance: $scope.placeDistance === undefined ? '' : $scope.placeDistance,
      priceRange: $scope.itemDetails.priceRange === undefined ? '' : $scope.itemDetails.priceRange,
      openStatus: $scope.itemDetails.openStatus === undefined ? '' : $scope.itemDetails.openStatus
    };

    $scope.newData = {
      "newValue" : "","relcy_id":{
      "entity_id": $stateParams.entity,
      "cipher_id":  $stateParams.cipher,
      "content_type_enum":  $stateParams.cType}
    }
    // template end //
  };

  //end
  $scope.hidePopover = function () {
    var popover = document.getElementsByClassName('popover');
    $(popover).remove()
  };
  //

  $scope.editAddressCatOpen = function () {
    //var newValue = {"newValue": $scope.EditData.display_address};
    var newValue = $scope.newData['newValue'] = $scope.EditData.display_address;
    //EntityService.titleOverride({movieName: $scope.itemDetails.title,serviceName:'place'},newValue, function(response,responseHeaders){
    //    //console.log("**********************************  " + response)
    //}, function(error){
    //    // error
    //});
    newValue = {"newValue": $scope.EditData.category};
    //EntityService.titleOverride({movieName: $scope.itemDetails.title,serviceName:'place'},newValue, function(response,responseHeaders){
    //    //console.log("**********************************  " + response)
    //}, function(error){
    //    // error
    //});
    newValue = {"newValue": $scope.EditData.openStatus};
    //EntityService.titleOverride({movieName: $scope.itemDetails.title,serviceName:'place'},newValue, function(response,responseHeaders){
    //    //console.log("**********************************  " + response)
    //}, function(error){
    //    // error
    //});
    newValue = {"newValue": $scope.EditData.priceRange};
    //EntityService.titleOverride({movieName: $scope.itemDetails.title,serviceName:'place'},newValue, function(response,responseHeaders){
    //    //console.log("**********************************  " + response)
    //}, function(error){
    //    // error
    //});
    newValue = {"newValue": $scope.EditData.placeDistance};
    //EntityService.titleOverride({movieName: $scope.itemDetails.title,serviceName:'place'},newValue, function(response,responseHeaders){
    //    //console.log("**********************************  " + response)
    //}, function(error){
    //    // error
    //});
    $scope.hidePopover()
  };
  $scope.editMenuLink = function () {
    var newValue = {"newValue": $scope.EditData.menuLink};
    //EntityService.titleOverride({movieName: $scope.itemDetails.title,serviceName:'place'},newValue, function(response,responseHeaders){
    //    //console.log("**********************************  " + response)
    //}, function(error){
    //    // error
    //});
    $scope.hidePopover()
  };
  //
  $scope.editCall = function () {
    var newValue = {"newValue": $scope.EditData.call};
    //EntityService.titleOverride({movieName: $scope.itemDetails.title,serviceName:'place'},newValue, function(response,responseHeaders){
    //    //console.log("**********************************  " + response)
    //}, function(error){
    //    // error
    //});
    $scope.hidePopover()
  };
  //
  $scope.editWorkTitle = function () {
    var newValue = {"newValue": $scope.EditData.workTitle}
    //EntityService.titleOverride({movieName: $scope.itemDetails.title,serviceName:'celebrity'},newValue, function(response,responseHeaders){
    //    //console.log("**********************************  " + response)
    //}, function(error){
    //    // error
    //});
    $scope.hidePopover()
  };
  //
  $scope.editTitle = function () {
    //var newValue = {"newValue": $scope.EditData.title};
    $scope.newData['newValue'] = $scope.EditData.title
    var newValue = $scope.newData;
    EntityService.titleOverride({ movieName: $scope.itemDetails.title, serviceName: 'movies' }, newValue, function (response, responseHeaders) {
    }, function (error) {
      // error
    });
    $scope.hidePopover()
  };
  //
  $scope.ratingYearLengthCount = 0;
  $scope.editRatingYearLength = function () {
    $scope.ratingYearLengthCount = 0;
    var newValue = {"newValue": $scope.EditData.parentalRating};
    EntityService.ratingOverride({ movieName: $scope.itemDetails.title, serviceName: 'movies' }, newValue, function (response, responseHeaders) {
      $scope.ratingYearLengthCount++;
      console.log(">-->> " + $scope.ratingYearLengthCount)
    }, function (error) {
      // error
    });
    var newValue = {"newValue": $scope.EditData.releaseYear};
    EntityService.yearOverride({ movieName: $scope.itemDetails.title, serviceName: 'movies' }, newValue, function (response, responseHeaders) {
      $scope.ratingYearLengthCount++;
      console.log(">-->> " + $scope.ratingYearLengthCount)
    }, function (error) {
      // error
    });
    var newValue = {"newValue": $scope.EditData.duration};
    EntityService.lengthOverride({ movieName: $scope.itemDetails.title, serviceName: 'movies' }, newValue, function (response, responseHeaders) {
      $scope.ratingYearLengthCount++;
      console.log(">-->> " + $scope.ratingYearLengthCount)
    }, function (error) {
      // error
    });
    $scope.hidePopover()
  };
  $scope.editGenres = function () {
    var newValue = {"newValue": $scope.EditData.genre};
    EntityService.genresOverride({ movieName: $scope.itemDetails.title, serviceName: 'movies' }, newValue, function (response, responseHeaders) {
    }, function (error) {
      // error
    });
    $scope.hidePopover()
  };
  $scope.editStory = function (serviceName) {
    var newValue = {"newValue": $scope.EditData.story};
    EntityService.storyOverride({ movieName: $scope.itemDetails.title, serviceName: serviceName }, newValue, function (response, responseHeaders) {
    }, function (error) {
      // error
    });
    $scope.hidePopover()
  };
  $scope.editTrailer = function (serviceName) {
    var newValue = {"newValue": $scope.EditData.videoResults};
    EntityService.trailerOverride({ movieName: $scope.itemDetails.title, serviceName: serviceName }, newValue, function (response, responseHeaders) {
    }, function (error) {
      // error
    });
    $scope.hidePopover()
  };
  $scope.editBanner = function () {
    var newValue = {"newValue": $scope.EditData.bannerUrl};
    EntityService.bgImageOverride({ movieName: $scope.itemDetails.title, serviceName: 'movies' }, newValue, function (response, responseHeaders) {
    }, function (error) {
      // error
    });
    $scope.hidePopover()
  };
  $scope.editThumbnail = function () {
    var newValue = {"newValue": $scope.EditData.thumbnailUrl};
    EntityService.heroImageOverride({movieName: $scope.itemDetails.title, serviceName: 'movies' }, newValue, function (response, responseHeaders) {
    }, function (error) {
      // error
    });
    $scope.hidePopover()
  };
  //
  $scope.showResult = function (type, index) {
    $scope.selectedTypeIndex = type;
    $scope.resultByType = $scope.types[index];
    //.searchResultRelcy.results;
  };


  /*Will be invoked everytime search field will be changed on homepage*/
  $scope.onInputChange = function (q) {
    $scope.query = q;
  };

  $scope.searchForSelection = function (selection) {
    if (selection && selection.title) {
      $location.path('search').search({q: selection.title});
    }
  };

  /*Will set the default selected category once results come*/
  function setDefaultCategory() {
    for (var i = 0; i < $scope.types.length; i++) {
      if ($scope.hasResults($scope.types[i].content_type_enum, i)) {
        $scope.showResult($scope.types[i].content_type_enum, i);
        break;
      }
    }
  }

  /*Will return the base url to be used in the service calls*/
  $scope.getBaseUrl = function () {
    return SearchService.BASE_URL;
  };

  /*Will open this link in a new tab*/
  $scope.gotoLink = function (link) {
    //Do nothing if link is not there
    if (!link) return;
    $window.open(link, '_blank');
  };

  /*Will increase the resuls and will take u to the last one.*/
  $scope.incrementAndScroll = function (cat) {
    // var allItems = cat.values;
    cat.maxIndex = cat.maxIndex + cat.incrementBy;
  };

  /*Will take you to the next page to view the details*/
  $scope.showDetails = function (item) {
    $scope.showingResult = false;

    if (item.content_type_enum) {
      $scope.itemType = item.content_type_enum;
    } else if (item.originalObject.content_type_enum) {
      $scope.itemType = item.originalObject.content_type_enum;
    }
    var relcyId;

    if (item.relcy_id && item.relcy_id.entity_id) {
      relcyId = item.relcy_id
    } else if (item.originalObject.lookIds && item.originalObject.lookIds[0]) {
      relcyId = {
        "entity_id": item.originalObject.lookIds[0],
        "cipher_id": item.originalObject.entity_id
      }
    }
    if (relcyId) {
      $rootScope.hideLoader = false;
      $scope.showDetailPage = false;
      SearchService.getEntityDetails(relcyId).then(function (data) {
        $scope.showDetailPage = true;
        if ($stateParams.img) {
          $scope.thumbnailImgUrl = $stateParams.img.replace(/%40/gi, '@').
            replace(/%3A/gi, ':').
            replace(/%24/g, '$').
            replace(/%2C/gi, ',').
            replace(/%2F/gi, '/');
        } else {
          $scope.thumbnailImgUrl = undefined;
        }
        $scope.placeDistance = $stateParams.dist || '';

        SearchService.selectedItem = item;
        $scope.itemDetails = SearchService.transformDetails(data);
        $scope.searchResults = $scope.itemDetails.categories;
        SearchService.searchResults = $scope.searchResults;
        var title = '';
        try {
          title = data.detail_response.verticalResult[0].searchResultRelcy.results[0].entity_data.common_data.name;
        } catch (err) {
          console.log('title not found');
        }
        if ($stateParams.artist) {
          title = $stateParams.artist;
        }
        var tQuery = SearchService.transformQuery($scope.itemDetails, $scope.itemType, title);
        // get the banner image
        if ($scope.itemType == 'LOCAL_BUSINESS') {
          try {
            $scope.itemDetails.distance = item.entity_data.local_data.location_info.display_distance;
          } catch (err) {
            console.log('distance unknown');
          }
          $scope.bannerUrl = getMapUrl($scope.itemDetails.mapinfo, SearchService.ACCESS_TOKEN, $scope.itemDetails.categoryHero);
        } else {
          SearchService.getBannerUrl(tQuery).then(function (url) {
            if (url)
              $scope.bannerUrl = url;
            else
              $scope.bannerUrl = DEFAULT_BANNER;

          }, function (err) {
            console.log('Error while fetching banner image url');
          });
        }

        if ($scope.searchResults.length > 0) {
          $rootScope.selectedCategory = $scope.searchResults[0].key;
        }
        $rootScope.hideLoader = true;
      }, function (error) {
        console.log('Error while fetching details!!!');
        $rootScope.hideLoader = true;
      });

    } else {
      console.log('Relcy id not found!');
      return;
    }
  };

  /*Will hide the auto complete on focus out*/
  $rootScope.hideSearchDropdown = function (id) {
    angular.element(document.querySelector('#searchInputText')).children()[0].classList.remove('angucomplete-dropdown-visible');
  };

  $rootScope.hideLoader = true;
  $scope.hasLocalBusiness = false;
  if ($stateParams.q)
  //$scope.setTextOnSearchField($stateParams.q);
    var cipher = $stateParams.cipher.replace(/%40/gi, '@').
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%2F/gi, '/');


  var q = $stateParams.q;
  if (q) {
    setTimeout(function () {
      $("#searchInputText input").focus();
      //angular.element(document.querySelector('#searchInputText')).children().children()[0].value = q;
    }, 300);
    $scope.query = q;
    $scope.showDetails({
      content_type_enum: $stateParams.cType,
      relcy_id: {entity_id: $stateParams.entity, cipher_id: cipher}
    });
  }
}


function getMapUrl(mapinfo, token, category) {
  if ('Bars' == category || 'bars' == category) {
    category = '-bar';
  } else {
    category = '';
  }
  return 'http://api.tiles.mapbox.com/v4/hunterowens2.m0lnepeh/' + 'pin-l' + category + '+3397DA(' + mapinfo.longitude + ',' + mapinfo.latitude + ',1)/' + mapinfo.longitude + ',' + mapinfo.latitude + ',' + '13' + '/908x300.png?access_token=' + token;
}


