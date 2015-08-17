'use strict';

angular.module('relcyApp')
  .service("SearchService", function ($timeout, $q, $http, Session) {
    this.searchResult = [];
    this.BASE_URL = 'https://dev-w.relcy.com';
    this.ACCESS_TOKEN = 'pk.eyJ1IjoiaHVudGVyb3dlbnMyIiwiYSI6ImI5dzd0YWMifQ.fFpJUocWQigRBbrLOqU4oQ';
    this.searchTxt = '';
    /*Will be used to refer the service itself*/
    var self = this;
    this.getGeoLocation = function () {
      try {
        return {lat: Session.position.coords.latitude, lng: Session.position.coords.longitude};
      } catch (err) {
        /*Retuning default location in case user does not allow for his/her location*/
        return Session.defaultLoc;
      }
    };
    this.getSearchDetails = function (query) {
      var currLoc = self.getGeoLocation();
      var deferred = $q.defer();
      $http.get(self.BASE_URL + '/search?lat=' + currLoc.lat + '&lng=' + currLoc.lng + '&query=' + query)
        .success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          deferred.reject(msg);
        });
      return deferred.promise;
    }
    /* search service adding By DT */
    this.searchOnRelcy = function (searchStr) {
      //var currLoc = self.getGeoLocation();
      var deferred = $q.defer();
      $http({
        method: "GET",
        url: self.BASE_URL + '/autocomplete?&query=' + searchStr
      })
        .success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          deferred.reject(msg);
        });
      return deferred.promise;
    };
    /* end serach service */

    this.getEntityDetails = function (relcyId) {
      var currLoc = self.getGeoLocation();
      var deferred = $q.defer();
      var dataObj = relcyId
      $http({
        method: "POST",
        url: self.BASE_URL + '/detail',
        data: dataObj
      })
        .success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          deferred.reject(msg);
        });
      return deferred.promise;
    };

    this.getBannerUrl = function (query) {
      var deferred = $q.defer();
      $http.get(self.BASE_URL + '/imagefetcher?&query=' + query)
        .success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          deferred.reject(msg);
        });
      return deferred.promise;
    };


    this.transformDetails = function (response) {
      var transformedData = {};
      transformedData.categories = [];
      response = response.detail_response;

      if (response) {
        var searchResults = response.verticalResult;
        if (searchResults) {
          transformedData.hideRSLinks = false;

          if (response.verticalResult[0].content_type_enum == "LOCAL_BUSINESS") {

            try {
              transformedData.placesResult = response.verticalResult[0].content_type_enum;
              transformedData.categories.push({key: 'details_places', keyTitle: 'Places'});
            } catch (err) {
              console.log('no places results found');
            }


            try {
              transformedData.socialActvity = response.verticalResult[0].searchResultRelcy.results[0].social_result;
              transformedData.socialActvity.maxIndex = 5;
              transformedData.socialActvity.incrementBy = 5;
              transformedData.categories.push({key: 'details_social', keyTitle: 'Social Activities'});
            } catch (err) {
              console.log('socialActvity not available');
            }
            try {
              transformedData.similarEntity = response.verticalResult[0].searchResultRelcy.results[0].entity_data.common_data.similar_entity_set.display_sub_entity;
              transformedData.similarEntity.maxIndex = 5;
              transformedData.similarEntity.incrementBy = 5;

              transformedData.categories.push({key: 'details_similar', keyTitle: 'Similar Places'});

            } catch (err) {
              console.log('similarEntity not available');
            }

            // check for other properties in the below code, only for movies
            try {
              var links = response.verticalResult[0].searchResultRelcy.results[0].link;
              if (links && links.length > 0) {
                self.getAppActionForPlaces(transformedData, links, response);
              }
            } catch (err) {
              console.log('Links not available');
            }

            try {
              transformedData.displayRating = response.verticalResult[0].searchResultRelcy.results[0].entity_data.common_data.display_rating;
              // lowercaseRating(transformedData.displayRating);
            } catch (err) {
              console.log('rating not found/unknown');
            }
            try {
              transformedData.title = response.verticalResult[0].searchResultRelcy.results[0].entity_data.common_data.name;
            } catch (err) {
              console.log('title not found/unknown');
            }
            try {
              transformedData.category = response.verticalResult[0].searchResultRelcy.results[0].entity_data.local_data.category.toString();
            } catch (err) {
              console.log('category unknown');
            }
            try {
              transformedData.categoryHero = response.verticalResult[0].searchResultRelcy.results[0].entity_data.local_data.category[0];
            } catch (err) {
              console.log('category unknown');
            }

            try {
              transformedData.mapinfo = response.verticalResult[0].searchResultRelcy.results[0].entity_data.local_data.location_info;
            } catch (err) {
              console.log('address unknown');
            }

            try {
              transformedData.hours = response.verticalResult[0].searchResultRelcy.results[0].entity_data.local_data.business_hours.days;
            } catch (err) {
              console.log('businessHours unknown');
            }

            try {
              transformedData.call = response.verticalResult[0].searchResultRelcy.results[0].entity_data.common_data.contact_info.phone_with_type;
            } catch (err) {
              console.log('call unknown');
            }
            try {
              transformedData.openStatus = response.verticalResult[0].searchResultRelcy.results[0].entity_data.local_data.open_status;
            } catch (err) {
              console.log('openStatus unknown');
            }

            try {
              transformedData.priceRange = response.verticalResult[0].searchResultRelcy.results[0].searchResultRelcy.results[0].entity_data.local_data.price_range.display_price_range;
            } catch (err) {
              console.log('priceRange unknown');
            }
          }
          else {
            var keyTitle = 'Movies';
            try {
              if (response.verticalResult[0].content_type_enum == 'ENTERTAINMENT_VIDEO_TVSHOW') {
                keyTitle = 'TV Shows';
              } else if (response.verticalResult[0].content_type_enum == "ENTERTAINMENT_AUDIO") {
                keyTitle = 'Audio';
              } else if (response.verticalResult[0].content_type_enum == "PERSON_CELEBRITY") {
                keyTitle = 'Celebrity';
              }
              else if (response.verticalResult[0].content_type_enum == "PERSON") {
                keyTitle = 'People';
              }
              else if (response.verticalResult[0].content_type_enum == "LIVE_API"  && response.verticalResult[0].searchResultRelcy.results[0].entity_data.live_data.flight_data) {
                keyTitle = 'Flights';
              }
              else if (response.verticalResult[0].content_type_enum == "LIVE_API"  && response.verticalResult[0].searchResultRelcy.results[0].entity_data.live_data.weather_data) {
                keyTitle = 'Weather';
              }
              transformedData.moviesResult = response.verticalResult[0].content_type_enum;
              transformedData.displayRating = response.verticalResult[0].searchResultRelcy.results[0].entity_data.common_data.display_rating;

              try {
                transformedData.workTitle = response.verticalResult[0].searchResultRelcy.results[0].entity_data.people_data.work_title[0];
              }
              catch (err) {
                console.log('Links not available');
              }

              // lowercaseRating(transformedData.displayRating);
              transformedData.categories.push({key: 'details_movies', keyTitle: keyTitle});

              if (response.verticalResult[0].content_type_enum === "PERSON_CELEBRITY" || response.verticalResult[0].content_type_enum === "PERSON" || response.verticalResult[0].content_type_enum === "ENTERTAINMENT_VIDEO_MOVIE") {
                try {
                  transformedData.socialActvity = response.verticalResult[0].searchResultRelcy.results[0].social_result;
                  transformedData.socialActvity.maxIndex = 5;
                  transformedData.socialActvity.incrementBy = 5;
                  transformedData.categories.push({key: 'details_social', keyTitle: 'Social Activities'});
                } catch (err) {
                  console.log('socialActvity not available');
                }
                try {
                  transformedData.similarEntity = response.verticalResult[0].searchResultRelcy.results[0].entity_data.common_data.similar_entity_set.display_sub_entity;
                  transformedData.similarEntity.maxIndex = 5;
                  transformedData.similarEntity.incrementBy = 5;
                  if (response.verticalResult[0].content_type_enum === "PERSON_CELEBRITY") {
                    transformedData.categories.push({key: 'details_similar', keyTitle: 'Similar Celebrity'});
                  }
                  else if (response.verticalResult[0].content_type_enum === "PERSON") {
                    transformedData.categories.push({key: 'details_similar', keyTitle: 'Similar People'});
                  }
                  else if (response.verticalResult[0].content_type_enum === "ENTERTAINMENT_VIDEO_MOVIE") {
                    transformedData.categories.push({key: 'details_similar', keyTitle: 'Similar Movies'});
                  }
                  else if (response.verticalResult[0].content_type_enum === "ENTERTAINMENT_VIDEO_TVSHOW") {
                    transformedData.categories.push({key: 'details_similar', keyTitle: 'Similar Tv Show'});
                  } else if (response.verticalResult[0].content_type_enum === "ENTERTAINMENT_AUDIO") {
                    transformedData.categories.push({key: 'details_similar', keyTitle: 'Similar Audio'});
                  }
                } catch (err) {
                  console.log('similarEntity not available');
                }
              }

              // check for other properties in the below code, only for movies
              try {
                var links = response.verticalResult[0].searchResultRelcy.results[0].link;
                if (links && links.length > 0) {
                  self.insertReviewsAndWatchesAndShowtimes(transformedData, links, response);
                }
              } catch (err) {
                console.log('Links not available');
              }

              try {
                transformedData.duration = response.verticalResult[0].searchResultRelcy.results[0].entity_data.entertainment_data.movie_data.length;
              } catch (err) {
                console.log('duration unknown');
              }

              try {
                transformedData.releaseYear = response.verticalResult[0].searchResultRelcy.results[0].entity_data.entertainment_data.common_data.release_year;
              } catch (err) {
                console.log('release year unknown');
              }

              try {
                transformedData.title = response.verticalResult[0].searchResultRelcy.results[0].entity_data.common_data.name;
              } catch (err) {
                console.log('title not found/unknown');
              }

              try {
                transformedData.story = response.verticalResult[0].searchResultRelcy.results[0].entity_data.common_data.summary;
              } catch (err) {
                console.log('title not found/unknown');
              }

              try {
                transformedData.parentalRating = response.verticalResult[0].searchResultRelcy.results[0].entity_data.entertainment_data.common_data.parental_rating;
              } catch (err) {
                console.log('parentalRating not found/unknown');
              }

              try {
                transformedData.cast = response.verticalResult[0].searchResultRelcy.results[0].entity_data.entertainment_data.common_data.performer_set.display_sub_entity;
              } catch (err) {
                console.log('cast not found/unknown');
              }

              try {
                if (transformedData.cast) {
                  transformedData.cast.push(response.verticalResult[0].searchResultRelcy.results[0].entity_data.entertainment_data.common_data.director);
                } else {
                  transformedData.cast = [response.verticalResult[0].searchResultRelcy.results[0].entity_data.entertainment_data.common_data.director];
                }
              } catch (err) {
                console.log('director not found/unknown');
              }

              try {
                transformedData.genre = response.verticalResult[0].searchResultRelcy.results[0].entity_data.entertainment_data.common_data.genre.join();
                transformedData.genre = transformedData.genre.replace(/,/g, ', ');
              } catch (err) {
                console.log('cast not found/unknown');
              }
            } catch (err) {
              console.log('no movie results found');
            }
          }
          /*Extracting web search results*/
for (var i = 0; i < response.verticalResult.length; i++) {
            if (response.verticalResult[i].content_type_enum === "WEB_IMAGES") {
              /*Extracting image search results*/
              try {
                transformedData.imageResults = response.verticalResult[i].imageSearchResult.imageSearchResults;
                transformedData.imageResults.maxIndex = 6;
                transformedData.categories.push({key: 'details_images', keyTitle: 'Images'});
              } catch (err) {
                console.log('no image results found');
              }
            }
            else if (response.verticalResult[i].content_type_enum === "WEB_VIDEOS") {
              /*Extracting video search results*/
              try {
                transformedData.videoResults = response.verticalResult[i].videoSearchResult.videoSearchResults;
                transformedData.videoResults.maxIndex = 3;
                transformedData.categories.push({key: 'details_videos', keyTitle: 'Videos'});
              } catch (err) {
                console.log('no video results found');
              }
            }
            else if (response.verticalResult[i].content_type_enum === "WEB") {
              try {
                transformedData.webResults = response.verticalResult[i].webSearchResult.searchResults;
                transformedData.webResults.maxIndex = 4;
                transformedData.categories.push({key: 'details_web', keyTitle: 'Web'});
              } catch (err) {
                console.log('no web results found');
              }
            }
            else if (response.verticalResult[i].content_type_enum === "WEB_NEWS") {
              try {
                transformedData.newsResults = response.verticalResult[i].newsSearchResult.newsSearchResults;
                transformedData.newsResults.maxIndex = 4;
                transformedData.categories.push({key: 'details_news', keyTitle: 'News'});
              } catch (err) {
                console.log('no news results found');
              }
            }
            else if (response.verticalResult[i].content_type_enum === "WEB_PLACES") {
              /*Extracting places search results*/
              try {
                transformedData.placesResults = response.verticalResult[i].placesSearchResult.placesSearchResult;
                transformedData.placesResults.maxIndex = 5;
                transformedData.categories.push({key: 'details_places', keyTitle: 'Places'});
              } catch (err) {
                console.log('no places results found');
              }
            }
            else if (response.verticalResult[i].content_type_enum === "RELATED_SEARCHES") {
              /*Extracting places search results*/
              try {
                transformedData.relatedSearches = response.verticalResult[i].relatedSearchesResult.relatedSearchResults;
                transformedData.relatedSearches.maxIndex = 5;
                transformedData.relatedSearches.incrementBy = 5;
              } catch (err) {
                console.log('no RELATED_SEARCHES found');
              }
            }
          }
        }


      }

      return transformedData;
    };

    /*Will transform the search results so as to be used on UI*/
    this.transformSearchResults = function (data, $scope, location) {
      var transformedData = [];
      for (var index = 0; index < data.length; index++) {
        var key = data[index].content_type_enum;
        var values = undefined;
        var keyTitle = undefined;
        var template = undefined;
        var maxIndex = undefined, incrementBy = undefined;
        switch (key) {
          case 'ENTERTAINMENT_VIDEO_MOVIE':
            if (data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length) {
              values = data[index].searchResultRelcy.results;
              keyTitle = 'Movies';
              template = 'ENTERTAINMENT_VIDEO_MOVIE';
              maxIndex = 3;
              incrementBy = 3;
              $scope.addScoresToVideoMovies(values);
            }
            break;
          case 'LIVE_API':
            if (data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length && data[index] && data[index].searchResultRelcy.results[0].entity_data.live_data.flight_data) {
              values = data[index].searchResultRelcy.results.entity_data.live_data.flight_data;
              keyTitle = 'Flights';
              template = 'FLIGHTS';
              maxIndex = 3;
              incrementBy = 3;
            }
            else if (data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length && data[index] && data[index].searchResultRelcy.results[0].entity_data.live_data.weather_data) {
              values = data[index].searchResultRelcy.results[0].entity_data.live_data.weather_data;
              keyTitle = 'Weather';
              template = 'WEATHER';
              maxIndex = 3;
              incrementBy = 3;
            }
            else if (data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length && data[index] && data[index].searchResultRelcy.results[0].entity_data.live_data.stock_data) {
              values = data[index].searchResultRelcy.results;
              keyTitle = 'Stocks';
              template = 'STOCKS';
              maxIndex = 3;
              incrementBy = 3;
            }
            else if (data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length && data[index] && data[index].searchResultRelcy.results[0].entity_data.live_data.sports_data) {
              values = data[index].searchResultRelcy.results;
              keyTitle = 'Sports';
              template = 'SPORTS';
              maxIndex = 3;
              incrementBy = 3;
            }
            break;
          case 'ENTERTAINMENT_VIDEO_TVSHOW':
            if (data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length) {
              values = data[index].searchResultRelcy.results;
              keyTitle = 'TV Shows';
              template = 'ENTERTAINMENT_VIDEO_TVSHOW';
              maxIndex = 3;
              incrementBy = 3;
              $scope.addScoresToVideoMovies(values);
            }
            break;
          case 'WEB_VIDEOS':
            if (data[index] && data[index].videoSearchResult && data[index].videoSearchResult.videoSearchResults && data[index].videoSearchResult.videoSearchResults.length) {
              values = data[index].videoSearchResult.videoSearchResults;
              keyTitle = 'Videos';
              template = 'WEB_VIDEOS';
              maxIndex = 3;
              incrementBy = 3;
            }
            break;
          case 'WEB_IMAGES':
            if (data[index] && data[index].imageSearchResult && data[index].imageSearchResult.imageSearchResults && data[index].imageSearchResult.imageSearchResults.length) {
              values = data[index].imageSearchResult.imageSearchResults;
              keyTitle = 'Images';
              template = 'WEB_IMAGES';
              maxIndex = 6;
              incrementBy = 6;
            }
            break;
          case 'WEB':
            if (data[index] && data[index].webSearchResult && data[index].webSearchResult.searchResults && data[index].webSearchResult.searchResults.length) {
              values = data[index].webSearchResult.searchResults;
              keyTitle = 'Web';
              template = 'WEB';
              maxIndex = 4;
              incrementBy = 4;
            }
            break;
          case 'WEB_NEWS':
            if (data[index] && data[index].newsSearchResult && data[index].newsSearchResult.newsSearchResults && data[index].newsSearchResult.newsSearchResults.length) {
              values = data[index].newsSearchResult.newsSearchResults;
              keyTitle = 'News';
              template = 'WEB_NEWS';
              maxIndex = 4;
              incrementBy = 4;
            }
            break;
          case 'APP':
            if (data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length) {
              values = data[index].searchResultRelcy.results;
              keyTitle = 'App';
              template = 'APP';
              maxIndex = 6;
              incrementBy = 6;
              $scope.addScoresToAppResluts(values);
            }
            break;
          case 'PERSON':
            var foundCelebrity = false;
            try {
              for (var i = 0; i < transformedData.length; i++) {
                if (transformedData[i].key == 'PEOPLE') {
                  foundCelebrity = true;
                  transformedData[i].values = transformedData[i].values.concat(data[index].searchResultRelcy.results);
                }
              }
              if (!foundCelebrity) {
                values = data[index].searchResultRelcy.results;
                maxIndex = 3;
                incrementBy = 3;
                key = 'PEOPLE';
                keyTitle = 'People';
                template = 'PEOPLE';
              } else {
                values = '';
              }

            } catch (err) {
              values = '';
              console.log('celebrity results empty');
            }
            break;
          case 'PERSON_CELEBRITY':
            var foundCelebrity = false;
            try {
              for (var i = 0; i < transformedData.length; i++) {
                if (transformedData[i].key == 'CELEBRITY') {
                  foundCelebrity = true;
                  transformedData[i].values = transformedData[i].values.concat(data[index].searchResultRelcy.results);
                }
              }
              if (!foundCelebrity) {
                values = data[index].searchResultRelcy.results;
                maxIndex = 3;
                incrementBy = 3;
                key = 'CELEBRITY';
                keyTitle = 'Celebrity';
                template = 'CELEBRITY';
              } else {
                values = '';
              }

            } catch (err) {
              values = '';
              console.log('celebrity results empty');
            }
            break;
          case 'RELATED_SEARCHES':
            if (data[index] && data[index].relatedSearchesResult && data[index].relatedSearchesResult.relatedSearchResults && data[index].relatedSearchesResult.relatedSearchResults.length) {
              $scope.relatedSearches = {};
              $scope.relatedSearches.data = data[index].relatedSearchesResult.relatedSearchResults;
              $scope.relatedSearches.maxIndex = 5;
              $scope.relatedSearches.incrementBy = 5;

            }
            values = undefined;
            break;
          case 'ENTERTAINMENT_AUDIO':
            if (data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length) {
              values = data[index].searchResultRelcy.results;
              keyTitle = 'Songs';
              template = 'ENTERTAINMENT_AUDIO';
              maxIndex = 3;
              incrementBy = 3;
              $scope.addScoresToVideoMovies(values);
              self.extractPerformers(values);
            }
            break;
          case 'LOCAL_BUSINESS':
            if (data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length) {
              values = data[index].searchResultRelcy.results;
              keyTitle = 'Places';
              template = 'LOCAL_BUSINESS';
              maxIndex = 3;
              incrementBy = 3;
              $scope.addScoresToPlaceResluts(values);
              $scope.hasLocalBusiness = true;

              var mapUrl = 'http://api.tiles.mapbox.com/v4/hunterowens2.m0lnepeh/';
              var currItem;
              transformedData.points = {};
              if (values.length > 0) {
                for (var d = 0; d < values.length; d++) {
                  try {
                    currItem = values[d].entity_data.local_data.location_info;
                    var l = values[d].entity_data.common_data.name;
                    transformedData.points['p' + d] = {
                      lat: currItem.latitude,
                      lng: currItem.longitude,
                      message: "<p>" + currItem.address.display_address + "</p><a class=\"pointer\" ng-click=\"gotoLocation('" + values[d].relcy_id.entity_id + "'" + ",'" + values[d].relcy_id.cipher_id + "'" + ",'" + l + "')\">Go</a>",
                      draggable: false,
                      compileMessage: true,
                      point: values[d].relcy_id,
                      label: l,
                      icon: {
                        type: 'div',
                        iconSize: [200, 0],
                        popupAnchor: [0, 0],
                        html: '<span>' + (d + 1) + '</span>'
                      }
                    };
                  } catch (errr) {
                    console.log('Location not present!');
                  }
                }
                if (location && location.latitude) {
                  transformedData.points['mylocation'] = {
                    lat: location.latitude,
                    lng: location.longitude,
                    message: "<p>My Location</p>",
                    draggable: false,
                    compileMessage: true,
                    icon: {
                      type: 'div',
                      iconSize: [200, 0],
                      popupAnchor: [0, 0],
                      html: '<span id="my-location"> </span>'
                    }
                  };
                }
              }


            }
            break;
          default:
            continue;
            break;
        }
        if (values) {
          transformedData.push({
            key: key,
            values: values,
            keyTitle: keyTitle,
            maxIndex: maxIndex,
            incrementBy: incrementBy,
            template: template
          });
        }
      }
      return transformedData;
    };

    this.extractPerformers = function (list) {
      angular.forEach(list, function (listItem) {
        listItem.performer = '';
        try {
          var performerList = listItem.entity_data.entertainment_data.common_data.performer;
          angular.forEach(performerList, function (p) {
            listItem.performer += (' ' + p.title);
          });
        } catch (err) {
          console.log('no performers');
        }
      });
    };

    /*Will insert the reviews and watches into the transformedData*/
    this.getAppActionForPlaces = function (transformedData, links, response) {
      transformedData.reviews = [];
      transformedData.delivery = [];
      transformedData.social = [];
      transformedData.reserve = [];
      transformedData.deals = [];
      transformedData.call = [];
      transformedData.map = [];

      transformedData.getThere = [];
      transformedData.menu = [];
      transformedData.reviewsAndMore = [];

      angular.forEach(links, function (l) {
        try {
          var action = l.app_result.result_data.action;
          switch (action.toLowerCase()) {
            case 'reviews':
              transformedData.reviews.push(l);
              break;
            case 'delivery':
              transformedData.delivery.push(l);
              break;
            case 'social':
              transformedData.social.push(l);
              break;
            case 'reserve':
              transformedData.reserve.push(l);
              break;
            case 'deals':
              transformedData.deals.push(l);
              break;
            case 'call':
              transformedData.call.push(l);
              break;
            case 'map':
              transformedData.map.push(l);
              break;
            case 'get there':
              transformedData.getThere.push(l);
              break;
            case 'menu':
              transformedData.menu.push(l);
              break;
            case 'reviews and more':
              transformedData.reviewsAndMore.push(l);
              break;
          }
        } catch (err) {
          console.log('invalid link');
        }
      });
    };

    /*Will insert the reviews and watches into the transformedData*/
    this.insertReviewsAndWatchesAndShowtimes = function (transformedData, links, response) {
      transformedData.reviews = [];
      transformedData.watches = [];
      transformedData.profiles = [];
      transformedData.blog = [];
      transformedData.infos = [];
      transformedData.plays = [];
      transformedData.tickets = [];
      transformedData.reviewsAndMore = [];
      transformedData.social = [];
      transformedData.rent = [];
	  transformedData.lyrics = [];


      angular.forEach(links, function (l) {
        try {
          var action = l.app_result.result_data.action;
          switch (action.toLowerCase()) {
            case 'reviews':
              transformedData.reviews.push(l);
              break;
            case 'watch':
              transformedData.watches.push(l);
              break;
            case 'profile':
              transformedData.profiles.push(l);
              break;
            case 'blog':
              transformedData.blog.push(l);
              break;
            case 'info':
              transformedData.infos.push(l);
              break;
            case 'play':
              transformedData.plays.push(l);
              break;
            case 'reviews and more':
              transformedData.reviewsAndMore.push(l);
              break;
            case 'tickets':
              transformedData.tickets.push(l);
              break;
            case 'social':
              transformedData.social.push(l);
              break;
            case 'rent':
              transformedData.rent.push(l);
              break;
			case 'lyrics':
		  		transformedData.lyrics.push(l);
		  		break;
          }
        } catch (err) {
          console.log('invalid link');
        }
      });

      var showTimes = [];
      try {
        showTimes = response.verticalResult[0].searchResultRelcy.results[0].entity_data.entertainment_data.movie_data.tv_showtime.showtimes
      } catch (err) {
        console.log('No tv shows');
        try {
          showTimes = response.verticalResult[0].searchResultRelcy.results[0].entity_data.entertainment_data.movie_data.theatre_showtime.showtimes
        } catch (err) {
          console.log('No movie shows');
        }

      }
      transformedData.showTimes = showTimes;
    };

    /*Will check if the response contains this type of action or not*/
    this.hasLinkType = function (type, response) {
      var actions = response.results[0].app_action;
      for (var i = 0; i < actions.length; i++) {
        if (actions[i] == type) {
          return true;
        }
      }
    };
    // feching hero image
    this.transformQuery = function (item, cat, title) {
      switch (cat) {
        case 'ENTERTAINMENT_VIDEO_MOVIE':
          return item.title + "+" + item.releaseYear;
          break;
        case 'ENTERTAINMENT_VIDEO_TVSHOW':
          return item.title + "+TV";
          break;
        case 'WEB_VIDEOS':
          //return ($scope.types[index] && $scope.types[index].videoSearchResult && $scope.types[index].videoSearchResult.videoSearchResults && $scope.types[index].videoSearchResult.videoSearchResults.length);
          break;
        case 'LOCAL_BUSINESS':
          return item.categoryHero;
          break;
        case 'ENTERTAINMENT_AUDIO':
          return title;
          break;
        default:
          return title;
          break;
      }
    }

    this.moveItem = function (arr, fromIndex, toIndex) {
      var element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
    };

    this.hasResults = function (type, index, types) {
      try {
        switch (type) {
          case 'ENTERTAINMENT_VIDEO_MOVIE':
          case 'ENTERTAINMENT_VIDEO_TVSHOW':
          case 'LIVE_API':
            return types[index].searchResultRelcy.results.length > 0;
            break;
          case 'WEB_VIDEOS':
            return types[index].videoSearchResult.videoSearchResults.length > 0;
            break;
          case 'WEB':
            return types[index].webSearchResult.searchResults.length > 0;
            break;
          case 'WEB_NEWS':
            return types[index].newsSearchResult.newsSearchResults.length > 0;
            break;
          case 'WEB_IMAGES':
            return types[index].imageSearchResult.imageSearchResults.length > 0;
            break;
          case 'APP':
            return types[index].searchResultRelcy.results.length > 0;
            break;
          case 'RELATED_SEARCHES':
            return types[index].relatedSearchesResult.relatedSearchResults.length > 0;
            break;
          case 'LOCAL_BUSINESS':
            return types[index].relatedSearchesResult.relatedSearchResults.length > 0;
            break;
          default:
            return false;
            break;
        }
      } catch (err) {
        return false;
      }
    }

    function lowercaseRating(displayRating) {
      angular.forEach(displayRating, function (i) {
        i.source = i.source.toLowerCase();
      });
    }

    this.handleError = function (response) {
      console.log(response);
      if (response.status == 404 && response.data == 'Result not available.') {
        return response;
      }
      console.log(response);
      // The API response from the server should be returned in a
      // nomralized format. However, if the request was not handled by the
      // server (or what not handles properly - ex. server error), then we
      // may have to normalize it on our end, as best we can.
      if (
        !angular.isObject(response.data) || !response.data.message
      ) {

        return ( $q.reject(response) );

      }

      // Otherwise, use expected error message.
      return ( $q.reject(response) );

    }
    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    this.handleSuccess = function (response) {
      var result = response.data;
      return ( result );
    }
 });

angular.module('relcyApp')
.filter('urlFilter', function ($document) {
    return function (input) {
      var parser = document.createElement('a');
      parser.href = input;
      return parser.hostname;
  };
});
