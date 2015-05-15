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

function EntityController($scope, $http, $rootScope, $location, $window, $timeout,
 $stateParams, SearchService, $filter, anchorSmoothScroll, Lightbox){

		console.log('stateParams: '+ $stateParams.entity);
		console.log('stateParams: '+ $stateParams.cipher);
		console.log('stateParams: '+ $stateParams.cType);
		console.log('stateParams: '+ $stateParams.q);
		
        $scope.showDetailPage = false;
        $scope.selected = 0;
        $scope.showingResult = false;
        $scope.hideMainSearch = false;
        $scope.relatedSearches;
        $scope.defaultErrorImage = '../../favicon.ico';
        $scope.showTopAnchor = false;
        $scope.itemType;
        $scope.itemDetails;

        angular.extend($scope, {
            center: {
                lat: 0,
                lng: 0,
                zoom: 8
            },
            mapData: {markers: {}}
        });
        /*The query in the search field of home page*/
        $scope.query;

        $scope.showResult = function (type, index) {
            $scope.selectedTypeIndex = type
            $scope.resultByType = $scope.types[index]//.searchResultRelcy.results;
        }

        

        /*Will be invoked everytime search field will be changed on homepage*/
        $scope.onInputChange = function (q) {
            $scope.query = q;
        }

        $scope.searchForSelection = function (selection) {
            if (selection && selection.title) {
                $scope.search(selection.title);
            }
        };

        /*Will be invoked on clicking related search item*/
        $scope.goForRelatedSearch = function (query) {

            $scope.$broadcast('angucomplete-alt:clearInput', 'members');
            $timeout(function () {
                angular.element(document.querySelector('#members')).children().children()[0].value = query;
            }, 250);

            $scope.search(query);
            $scope.query = query;
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
        }

        $scope.onAutoCompleteSelect = function (item) {
            if (!item) return;
            if (item.originalObject.lookIds && item.originalObject.lookIds[0]) {
                $scope.showDetails(item);
            } else {
                $scope.searchForSelection(item);
            }
        }

        /*Will increase the resuls and will take u to the last one.*/
        $scope.incrementAndScroll = function (cat) {
            // var allItems = cat.values;
            cat.maxIndex = cat.maxIndex + cat.incrementBy;
        };

        /*Will take you to the next page to view the details*/
        $scope.showDetails = function (item) {
            $scope.showingResult = false;
            $scope.hideMainSearch = true;

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
                    SearchService.selectedItem = item;
                    $scope.itemDetails = SearchService.transformDetails(data);
                    $scope.searchResults = $scope.itemDetails.categories;

                    var tQuery = SearchService.transformQuery($scope.itemDetails, $scope.itemType)
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
        }

        $scope.openCastLightbox = function (data, type, index) {
            //console.log("hello openCastLightbox")
            Lightbox.type = type;
            //data = 'http://www.youtube.com/embed/XGSy3_Czz8k?autoplay=1';
            Lightbox.data = data;

            if (type == 'VIDEO') {
                for (var i = 0; i < data.length; i++) {
                    try {
                        if (data[i].contentUrl.indexOf("youtube") > -1) {
                            var url = data[i].contentUrl.replace("watch?v=", "embed/");
                            url = url + '?autoplay=1'
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
                Lightbox.openModal([Lightbox.data], 0);
            }
        };

        /*Asking and fetching the current location*/
        $window.navigator.geolocation.getCurrentPosition(function (position) {
            $scope.$apply(function () {
                SearchService.position = position;
                console.log(position);
            });
        }, function (error) {
        });

        /*Will hide the auto complete on focus out*/
        $rootScope.hideSearchDropdown = function (id) {
            angular.element(document.querySelector('#members')).children()[0].classList.remove('angucomplete-dropdown-visible');
        }

        $rootScope.hideLoader = true;
        $scope.hasLocalBusiness = false;
        if($stateParams.q)
		$scope.setTextOnSearchField($stateParams.q);
		var cipher = $stateParams.cipher.replace(/%40/gi, '@').
             replace(/%3A/gi, ':').
             replace(/%24/g, '$').
             replace(/%2C/gi, ',').
             replace(/%2F/gi, '/');
        $scope.showDetails({
            content_type_enum: $stateParams.cType,
            relcy_id: {entity_id: $stateParams.entity, cipher_id: cipher}
        });
    }


function getMapUrl(mapinfo, token, category) {
    if ('Bars' == category || 'bars' == category) {
        category = '-bar';
    } else {
        category = '';
    }
    return 'http://api.tiles.mapbox.com/v4/hunterowens2.m0lnepeh/' + 'pin-l' + category + '+3397DA(' + mapinfo.longitude + ',' + mapinfo.latitude + ',1)/' + mapinfo.longitude + ',' + mapinfo.latitude + ',' + '13' + '/898x359.png?access_token=' + token;
}


