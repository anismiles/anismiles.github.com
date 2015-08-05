angular.module('relcyApp')
    .controller('SearchController', [
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
        '$state',
		'$cookies',
        SearchController]);

function SearchController($scope, $http, $rootScope, $location, $window, $timeout, $stateParams, SearchService, $filter, anchorSmoothScroll, Lightbox, $state,$cookies) {
	
	var loggedIn = $cookies.get('LoggedIn')
if(!loggedIn ){$state.go('login'); $cookies.remove('LoggedIn')
}
    $scope.showDetailPage = false;
    $scope.selected = 0;
    $scope.searchResultsOfRelcy = [];
    $scope.suggestedSearch = false;
    $scope.relatedSearches;
    $scope.defaultErrorImage = '../../favicon.ico';
    $scope.itemType;
    $scope.itemDetails;
    $scope.maxShowSerachRecord = {max:100,increment:100}

    $scope.providedBy = false;
    $scope.searchResultShow = true;

    if (SearchService.searchTxt) { 
        if(SearchService.searchTxt === $stateParams.q)
        {
            $scope.searchTxt = SearchService.searchTxt;
            $("#pageMiddle").css({'margin-top': '0%'});
            $("#container").addClass("body");
        }
        else{
            $scope.searchTxt = $stateParams.q;
            $("#pageMiddle").css({'margin-top': '0%'});
            $("#container").addClass("body");
        }
    }
    else {
        if ($stateParams.q) {
            $scope.searchTxt = $stateParams.q;
            $("#pageMiddle").css({'margin-top': '0%'});
            $("#container").addClass("body");
        }
    }

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
        $scope.selectedTypeIndex = type;
        $scope.resultByType = $scope.types[index]; //.searchResultRelcy.results;
    };
    $rootScope.reload = function () {
        SearchService.searchTxt = '';
        $location.path('/search').search({q: ''});
        $("#container").removeClass("body");
    };

    /*Will be invoked everytime search field will be changed on homepage*/
    $scope.onInputChange = function (q) {
        $scope.query = q;
        if (q && q.length >= 1) {
            $("#pageMiddle").animate({'margin-top': '0%'}, 200);
            $("#pageMiddle").addClass("innerPageMiddle");
            $("#container").addClass("body");
            $("#bigform").addClass("big-form-no-bdr-btm ");
        }
    };

    $scope.setFocusOnSearch = function ()
    {
        $("#searchInputText").focus();
        console.log("focus " )
    }

    var intervalCounter = -1
    $scope.selectedIndexOfSearchItem = -1;
    $scope.keyDown = function(val)
    {
        //console.log(val + " " )
        if( !(val === 40 || val === 38) )
        {
            clearInterval(intervalCounter);
            intervalCounter = setInterval(function(){
                clearInterval(intervalCounter);
                $scope.searchOnRelcy();
            },100);
            return;
        }
        if(val === 40)
        {
            $scope.selectedIndexOfSearchItem++;
            //down
            //console.log(">--->> Down " + val)
        }
        else if(val === 38)
        {
            $scope.selectedIndexOfSearchItem--;
            // up
            //console.log(">--->> Up " + val)
        }

        var max = $scope.maxShowSerachRecord.max <= $scope.searchResultsOfRelcy.length ? $scope.maxShowSerachRecord.max : $scope.searchResultsOfRelcy.length

        if($scope.selectedIndexOfSearchItem <= -1)
        {
            $scope.selectedIndexOfSearchItem = max-1;
        }
        if($scope.selectedIndexOfSearchItem >= max)
        {
            $scope.selectedIndexOfSearchItem = 0;
        }
        console.log(">--->> index " + $scope.selectedIndexOfSearchItem + " = " + max)

        var tmpList = angular.element(document.getElementById('serachResultList')).find('li')
        $(tmpList).removeClass('activeList')
        var t = tmpList[$scope.selectedIndexOfSearchItem]
        $(t).addClass('activeList')
        $scope.searchTxt = $scope.searchResultsOfRelcy[$scope.selectedIndexOfSearchItem].title
        SearchService.searchTxt = $scope.searchTxt;

    }

//
    var temp_Interval
    /* getting search result from server by DT*/
    $scope.query = q;
    var q = $("#searchInputText").val();
    if (q && q.length >= 1) {
        $("#pageMiddle").addClass("innerPageMiddle");
        $("#container").addClass("body");
    }

    $scope.searchOnclick = function(str){
        $scope.searchTxt = str;
        SearchService.searchTxt = str;
        $location.search('q', str);
    }

    $scope.searchOnRelcy = function () {
        console.log("searching....")
        $scope.selectedIndexOfSearchItem = -1;
        $("#bigform").addClass("big-form-no-bdr-btm ");
        $scope.maxShowSerachRecord = {max:100,increment:100}
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
        console.log(" aaila... " + SearchService.searchTxt + " = " + q)

        temp_Interval = setInterval(function () {
            SearchService.searchOnRelcy(SearchService.searchTxt).then(function (data) {
                clearInterval(temp_Interval);
                var qq = $("#searchInputText").val();
                console.log("result ** " + qq)
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
    /**/
    $scope.getRatingCount = function (num) {
        return new Array(parseInt(num));
    };
    //
    $scope.getHalfRating = function (num) {
        var tempStart = (num + "").split(".")[1];
        if (tempStart == "") {
            return false;
        }
        else {
            return true;
        }
    };
    //
    $scope.searchAll = function () {
        if($scope.selectedIndexOfSearchItem !== -1)
        {
            var detailPage = '';
            var item = $scope.searchResultsOfRelcy[$scope.selectedIndexOfSearchItem]
            //detail({q:result.entity_data.common_data.name, cType:cat.key, entity: result.relcy_id.entity_id, cipher: result.relcy_id.cipher_id, img: result.image_info[0].thumbnail.mediaURL })
            try{
                switch (item.content_type_enum) {
                    case 'ENTERTAINMENT_VIDEO_MOVIE':
                    case 'ENTERTAINMENT_VIDEO_TVSHOW':
                        detailPage = 'detail';
                        break;
                    case 'PERSON':
                        detailPage = 'people';
                        break;
                    case 'PERSON_CELEBRITY':
                        detailPage = 'celebrity';
                        break;
                    case 'LOCAL_BUSINESS':
                        detailPage = 'place';
                        break;
                    default:
                        detailPage = '';
                        window.open(item.redirect_url,"_blank")
                        break;
                }
            }catch(err){
                return false;
            }


            if(detailPage != '') {
                if (!item.entity_id && !item.lookIds) {
                    $location.search('q', item.title);
                    return;
                }
                $location.path(detailPage).search({
                    q: item.title,
                    cType: item.content_type_enum,
                    entity: item.lookIds[0],
                    cipher: item.entity_id,
                    img: item.image
                });
            }

            return;
        }
        $("#bigform").addClass("big-form-no-bdr-btm ");
        $scope.suggestedSearch = false;
        $scope.providedBy = false;
        $scope.search($scope.query)
    };
    //

    //q=Avengers:%20Age%20of%20Ultron&
    //cipher=iyvp6LTxP53J12axw1UPXDpkdAjV3YOLJMADFSMKVeg6qK46oa3DMGOvgr6HikKk&
    //cType=ENTERTAINMENT_VIDEO_MOVIE&
    //entity=look:3960841344802438073&
    //img=http:%2F%2Fcdn-serve-s.relcy.com%2Fimagev2%2FImageServerV2%3Ffetchonlycached%26fetchonlyspecified%26d%3D150x200%26f%3Dhttp%253A%252F%252Fcps-static.rovicorp.com%252F2%252FOpen%252FDisney%252FThe%2BAvengers%2BAge%2Bof%2BUltron%252FThe-Avengers-Age-of-Ultron-poster.jpg
    $scope.selectResult = function (item) {
        SearchService.searchTxt = item.title;
        var detailPage = '';
        //detail({q:result.entity_data.common_data.name, cType:cat.key, entity: result.relcy_id.entity_id, cipher: result.relcy_id.cipher_id, img: result.image_info[0].thumbnail.mediaURL })
        try{
            switch (item.content_type_enum) {
                case 'ENTERTAINMENT_VIDEO_MOVIE':
                case 'ENTERTAINMENT_VIDEO_TVSHOW':
                    detailPage = 'detail';
                    break;
                case 'PERSON':
                    detailPage = 'people';
                    break;
                case 'PERSON_CELEBRITY':
                    detailPage = 'celebrity';
                    break;
                case 'LOCAL_BUSINESS':
                    detailPage = 'place';
                    break;
                default:
                    detailPage = '';
                    window.open(item.redirect_url,"_blank")
                    break;
            }
        }catch(err){
            return false;
        }
        if(detailPage != '') {
            if (!item.entity_id && !item.lookIds) {
                $location.search('q', item.title);
                return;
            }
            $location.path(detailPage).search({
                q: item.title,
                cType: item.content_type_enum,
                entity: item.lookIds[0],
                cipher: item.entity_id,
                img: item.image
            });
        }
    };

    $scope.$on('search', function (event, q) {
        $scope.search(q);
    });

    $scope.$on('leafletDirectiveMarker.dblclick', function (event, i) {
        //Will do nothing if my location double clicked.
        if (i.modelName == 'mylocation') return;
        $location.path('place').search({
            entity: i.model.point.entity_id,
            cipher: i.model.point.cipher_id,
            q: i.model.label,
            cType: i.model.point.content_type_enum
        });
    });

    /*Will be invoked everytime the marker is clicked*/
    $scope.gotoLocation = function (entity_id, cipher_id, label) {
        $location.path('place').search({entity: entity_id, cipher: cipher_id, q: label, cType: 'LOCAL_BUSINESS'});
    };

    /*Start searching for the input query*/
    $scope.search = function (query) {
        /*Do nothing when no input in field*/
        $("#bigform").addClass("big-form-no-bdr-btm ");
        if (!query) return;
        $location.search('q', query);
        $scope.mapData.markers = {};
        $rootScope.hideLoader = false;
        $scope.searchResults = undefined;
        $scope.relatedSearches = undefined;
        SearchService.getSearchDetails(query).then(function (data) {
            $scope.showDetailPage = false;
            $scope.showingResult = true;
            $scope.providedBy = true;
            $scope.result = data['search_response'];
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
                    if($scope.searchResults[0].values.length > 1){
                        $scope.center.zoom = 8;
                    }
                    else{
                        $scope.center.zoom = 13;
                    }

                } catch (er) {
                    console.log('Unable to center the map');
                }
                $timeout(function () {
                    var mylocationEle = angular.element(document.querySelector('#my-location'));
                    if (mylocationEle) {
                        mylocationEle.parent().css('background', 'url(img-no-min/my-location.svg) center center no-repeat');
                    }
                }, 250);
            }

        }, function (error) {
            $scope.showingResult = false;
            $scope.gridMessage = 'Error while loading data';
            $rootScope.hideLoader = true;
        });
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

    ///*Will hide the auto complete on focus out*/
    //$rootScope.hideSearchDropdown = function (id) {
    //  angular.element(document.querySelector('#searchInputText')).children()[0].classList.remove('angucomplete-dropdown-visible');
    //};

    $rootScope.hideLoader = true;

    var q = $stateParams.q;
    if (q) {
        setTimeout(function () {
            $("#searchInputText").blur();
            $("#pageMiddle").addClass("innerPageMiddle");

            //angular.element(document.querySelector('#searchInputText')).children().children()[0].value = q;

        }, 200);
        $scope.query = q;
        $scope.search(q);
        $("#searchInputText").blur();
    } else {
        $("#searchInputText").focus();
        $(".tran_top").keypress(function (e) {
            $("#pageMiddle").addClass("innerPageMiddle");
        });
    }
    $rootScope.showTopAnchor = false;
    $timeout(function () {
        $("#searchInputText").focus();
    }, 300)

    $scope.locationActiveSort = 1
    $scope.moviesActiveSort = 1
    $scope.tvShowActiveSort = 1

    $scope.ratingAsc = true;
    $scope.sortByRating = function (index) {
        $scope.moviesActiveSort = 1
        $scope.searchResults[index].values = _.sortByOrder($scope.searchResults[index].values, 'score', $scope.ratingAsc)
        $scope.ratingAsc = !$scope.ratingAsc
    }

    $scope.yearAsc = true;
    $scope.sortByYear = function (index) {
        $scope.moviesActiveSort = 2
        $scope.searchResults[index].values = _.sortByOrder($scope.searchResults[index].values, 'entity_data.entertainment_data.common_data.release_year', $scope.yearAsc)
        $scope.yearAsc = !$scope.yearAsc
    }

    $scope.tvShowRatingAsc = true;
    $scope.sortTvShowByRating = function (index) {
        $scope.tvShowActiveSort = 1
        $scope.searchResults[index].values = _.sortByOrder($scope.searchResults[index].values, 'score', $scope.tvShowRatingAsc)
        $scope.tvShowRatingAsc = !$scope.tvShowRatingAsc
    }

    $scope.tvShowYearAsc = true;
    $scope.sortTvShowByYear = function (index) {
        $scope.tvShowActiveSort = 2
        $scope.searchResults[index].values = _.sortByOrder($scope.searchResults[index].values, 'entity_data.entertainment_data.common_data.release_year', $scope.tvShowYearAsc)
        $scope.tvShowYearAsc = !$scope.tvShowYearAsc
    }


    $scope.locationRatingAsc = true;
    $scope.sortByLocationRating = function (index) {
        $scope.locationActiveSort = 1;
        $scope.searchResults[index].values = _.sortByOrder($scope.searchResults[index].values, 'entity_data.common_data.display_rating[0].rating', $scope.locationRatingAsc)
        $scope.locationRatingAsc = !$scope.locationRatingAsc
    }

    $scope.distanceAsc = true;
    $scope.sortByDistance = function (index) {
        $scope.locationActiveSort = 2
        $scope.searchResults[index].values = _.sortByOrder($scope.searchResults[index].values, 'entity_data.local_data.location_info.distance', $scope.distanceAsc)
        $scope.distanceAsc = !$scope.distanceAsc
    }

    $scope.openAsc = true;
    $scope.sortByOpen = function (index) {
        $scope.locationActiveSort = 3
        $scope.searchResults[index].values = _.sortByOrder($scope.searchResults[index].values, 'entity_data.local_data.open_status', $scope.openAsc)
        $scope.openAsc = !$scope.openAsc
    }
}

