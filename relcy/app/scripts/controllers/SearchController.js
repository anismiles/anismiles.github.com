angular.module('relcyApp')
    .controller("SearchController", function ($scope, $http, $rootScope, $location, $window, $timeout, SearchService, $filter, anchorSmoothScroll, Lightbox) {
        var DEFAULT_BANNER = 'img-no-min/Lighthouse.png';

        $scope.selectedTypeIndex = 0;
        $scope.selectedCategory;
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


        $scope.$on('leafletDirectiveMarker.dblclick', function (event, i) {
        	setTextOnSearchField(i.model.label);
            $scope.showDetails({
                content_type_enum: i.model.point.content_type_enum,
                relcy_id: {entity_id: i.model.point.entity_id, cipher_id: i.model.point.cipher_id}
            });
        });

        /*Will be invoked everytime the marker is clicked*/
        $rootScope.gotoLocation = function (entity_id, cipher_id, label) {
        	setTextOnSearchField(label);
            $scope.showDetails({
                content_type_enum: 'LOCAL_BUSINESS',
                relcy_id: {entity_id: entity_id, cipher_id: cipher_id}
            });

        };
        /*Start searching for the input query*/
        $scope.search = function (query) {
            /*Do nothing when no input in field*/
            if (!query) return;
            $scope.mapData.markers = {};
            $scope.hasLocalBusiness = false;
            $rootScope.hideLoader = false;
            $scope.searchResults = undefined;
            $scope.relatedSearches = undefined;
            SearchService.getSearchDetails(query).then(function (data) {
                $scope.showDetailPage = false;
                $scope.showingResult = true;
                $scope.result = data['search_response']
                if (!$scope.result.verticalResult) {
                    $scope.showingResult = false;
                    return;
                }
                $scope.searchResults = SearchService.transformSearchResults($scope.result.verticalResult, $scope);
                $scope.selectedCategory = $scope.searchResults[0].key;
                $scope.types = $scope.result.verticalResult;
                setDefaultCategory();
                $rootScope.hideLoader = true;
                if ($scope.hasLocalBusiness) {
                    //Moving place results to first place.
                    try {
                        if ($scope.searchResults[0].key != 'LOCAL_BUSINESS') {
                            var lbIndex = 0;
                            for (var n = 1; n < $scope.searchResults.length; n++) {
                                if ($scope.searchResults[n].key == 'LOCAL_BUSINESS') {
                                    lbIndex = n;
                                    break;
                                }
                            }
                            if (lbIndex > 0) {
                                SearchService.moveItem($scope.searchResults, lbIndex, 0);
                                $scope.selectedCategory = $scope.searchResults[0].key;
                            }
                        }
                    } catch (er) {
                        console.log('no results avlbl');
                    }
                    // L.mapbox.accessToken = 'pk.eyJ1IjoiaHVudGVyb3dlbnMyIiwiYSI6ImI5dzd0YWMifQ.fFpJUocWQigRBbrLOqU4oQ';

                    angular.extend($scope.mapData, {
                        markers: $scope.searchResults.points
                    });
                    try {
                        $scope.center.lat = $scope.searchResults.points.p0.lat;
                        $scope.center.lng = $scope.searchResults.points.p0.lng;
                        $scope.center.zoom = 12;
                    } catch (er) {
                        console.log('Unable to center the map');
                    }
                }

            }, function (error) {
                $scope.showingResult = false;
                $scope.gridMessage = 'Error while loading data';
                $rootScope.hideLoader = true;
            });
        }

        $scope.reload = function () {
            window.location.reload();
        }
        
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
    });


function getMapUrl(mapinfo, token, category) {
    if ('Bars' == category || 'bars' == category) {
        category = '-bar';
    } else {
        category = '';
    }
    return 'http://api.tiles.mapbox.com/v4/hunterowens2.m0lnepeh/' + 'pin-l' + category + '+3397DA(' + mapinfo.longitude + ',' + mapinfo.latitude + ',1)/' + mapinfo.longitude + ',' + mapinfo.latitude + ',' + '13' + '/898x359.png?access_token=' + token;
}


