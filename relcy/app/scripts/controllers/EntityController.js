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
        EntityController]);


function EntityController($scope, $http, $rootScope, $location, $window, $timeout, $stateParams, SearchService, $filter, anchorSmoothScroll, Lightbox)
{
    console.log('stateParams: ' + $stateParams.entity);
    console.log('stateParams: ' + $stateParams.cipher);
    console.log('stateParams: ' + $stateParams.cType);
    console.log('stateParams: ' + $stateParams.q);
    console.log('stateParams: ' + $stateParams.artist);

    $scope.selected = 0;
    $scope.defaultErrorImage = '../../favicon.ico';
    $scope.itemType ;
    $scope.itemDetails ;
    $scope.placeDistance = '';
    $rootScope.showTopAnchor = false;
    $scope.showEdit = false;
    $scope.toggle = false
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
        try{
            thumbnailUrl = $scope.itemDetails.imageResults[0].thumbnailUrl;
        }catch(er){
            thumbnailUrl = $scope.thumbnailImgUrl;
        }
        // template start //
        $scope.EditData = {
            templateUrl: "movie-title.html",
            title: $scope.itemDetails.title,
            parentalRating:$scope.itemDetails.parentalRating,
            releaseYear: parseInt($scope.itemDetails.releaseYear),
            duration:parseInt($scope.itemDetails.duration),
            genre:$scope.itemDetails.genre,
            displayRating:$scope.itemDetails.displayRating,
            story:$scope.itemDetails.story.value,
            videoResults:$scope.itemDetails.videoResults,
            bannerUrl:$scope.bannerUrl,
            thumbnailUrl:thumbnailUrl
        };
        // template end //
    };

    $scope.saveEditData = function ()
    {
        var thumbnailUrl;
        try{
            thumbnailUrl = $scope.itemDetails.imageResults[0].thumbnailUrl;
        }catch(er){
            thumbnailUrl = $scope.thumbnailImgUrl;
        }
        $scope.EditData = {
            templateUrl: "movie-title.html",
            title: $scope.itemDetails.title,
            parentalRating:$scope.itemDetails.parentalRating,
            releaseYear: parseInt($scope.itemDetails.releaseYear),
            duration:parseInt($scope.itemDetails.duration),
            genre:$scope.itemDetails.genre,
            displayRating:$scope.itemDetails.displayRating,
            story:$scope.itemDetails.story.value,
            videoResults:$scope.itemDetails.videoResults,
            bannerUrl:$scope.bannerUrl,
            thumbnailUrl: thumbnailUrl,
        };
    }
    //end

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
                    title = data.detail_response.results[0].entity_data.common_data.name;
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
        angular.element(document.querySelector('#members')).children()[0].classList.remove('angucomplete-dropdown-visible');
    };

    $rootScope.hideLoader = true;
    $scope.hasLocalBusiness = false;
    if ($stateParams.q)
        $scope.setTextOnSearchField($stateParams.q);
    var cipher = $stateParams.cipher.replace(/%40/gi, '@').
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%2F/gi, '/');


    var q = $stateParams.q;
    if (q) {
        setTimeout(function () {
            $("#members input").focus();
            angular.element(document.querySelector('#members')).children().children()[0].value = q;
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


