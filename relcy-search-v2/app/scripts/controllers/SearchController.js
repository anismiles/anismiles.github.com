angular.module('relcyApp')
    .controller("SearchController", function ($scope, $http, $rootScope, $location, $window, $timeout, $stateParams,
       SearchService, $filter, anchorSmoothScroll, Lightbox) {

        $scope.showDetailPage = false;
        $scope.selected = 0;

        $scope.relatedSearches;
        $scope.defaultErrorImage = '../../favicon.ico';
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
            if(q && q.length==1){
                $("#pageMiddle").animate({'margin-top': '0%'}, 200);
                $("#pageMiddle").addClass("innerPageMiddle");
            }
        }

        $scope.$on('search', function(event, q){
            $scope.search(q);
        });

        $scope.$on('leafletDirectiveMarker.dblclick', function (event, i) {
            //Will do nothing if my location double clicked.
            if(i.modelName=='mylocation') return;
            $location.path('place').search({entity: i.model.point.entity_id, cipher: i.model.point.cipher_id, q: i.model.label, cType: i.model.point.content_type_enum});
        });

        /*Will be invoked everytime the marker is clicked*/
        $scope.gotoLocation = function (entity_id, cipher_id, label) {
        	$location.path('place').search({entity: entity_id, cipher: cipher_id, q: label, cType: 'LOCAL_BUSINESS'});
        };

        /*Start searching for the input query*/
        $scope.search = function (query) {
            /*Do nothing when no input in field*/
            if (!query) return;
            $location.search('q', query)
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
                $scope.searchResults = SearchService.transformSearchResults($scope.result.verticalResult, $scope, data.search_request.location);
                SearchService.searchResults = $scope.searchResults;
                $rootScope.selectedCategory = $scope.searchResults[0].key;
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
                                $rootScope.selectedCategory = $scope.searchResults[0].key;
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
                    $timeout(function(){
                        var mylocationEle = angular.element(document.querySelector('#my-location'));
                        if(mylocationEle){
                            mylocationEle.parent().css('background', 'url(img-no-min/my-location.svg)center center no-repeat');
                        }
                    }, 250);
                }

            }, function (error) {
                $scope.showingResult = false;
                $scope.gridMessage = 'Error while loading data';
                $rootScope.hideLoader = true;
            });
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

        /*Will increase the resuls and will take u to the last one.*/
        $scope.incrementAndScroll = function (cat) {
            // var allItems = cat.values;
            cat.maxIndex = cat.maxIndex + cat.incrementBy;
        };

        /*Will hide the auto complete on focus out*/
        $rootScope.hideSearchDropdown = function (id) {
            angular.element(document.querySelector('#searchInputText')).children()[0].classList.remove('angucomplete-dropdown-visible');
        }

        $rootScope.hideLoader = true;
        $scope.hasLocalBusiness = false;

        var q = $stateParams.q;
        if(q){
             setTimeout ( function (){

                $( "#searchInputText input" ).focus();

                $("#bighead").removeClass("title");
                $("#bighead").addClass("relcysmall");
                $("#pageMiddle").addClass("innerPageMiddle");
                angular.element(document.querySelector('#searchInputText')).children().children()[0].value = q;

             },200);
            $scope.query = q;
            $scope.search(q);
        }else{
                $("#searchInputText input").focus();
                $(".tran_top").keypress(function (e) {
                    console.log("213456");
                    $("#bighead").removeClass("title");
                    $("#bighead").addClass("relcysmall");
                    $("#pageMiddle").animate({'margin-top': '0%'}, 200);
                    $("#pageMiddle").addClass("innerPageMiddle");

                });
        }
        $rootScope.showTopAnchor = false;
       $timeout(function(){$("#searchInputText input").focus();},300)
    });

