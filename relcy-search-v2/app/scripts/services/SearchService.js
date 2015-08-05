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

      //response = (
      //{
      //    "verticalResult": [
      //        {
      //            "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE",
      //            "elbowPoint": 1,
      //            "searchResultRelcy": {
      //                "results": [
      //                    {
      //                        "app_action": [
      //                            "Watch",
      //                            "Reviews and More",
      //                            "Tickets"
      //                        ],
      //                        "relcy_id": {
      //                            "entity_id": "look:-5071560213288892831",
      //                            "cipher_id": "Flom8lcAT9xtJ4/q26gNAC6zSC+1NlMHDf4f3bqomf+BCOkZBJMwVtXiQHwHSKxP",
      //                            "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                        },
      //                        "ttl_epoch_ms": 0,
      //                        "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE",
      //                        "image_info": [
      //                            {
      //                                "mediaURL": "http://relc.tmsimg.com/NowShowing/146687/146687_bb.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://relc.tmsimg.com/NowShowing/146687/146687_ba.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://relc.tmsimg.com/NowShowing/146687/146687_be.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://upload.wikimedia.org/wikipedia/en/3/3d/Minions_poster.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://upload.wikimedia.org/wikipedia/ru/thumb/5/51/%D0%9C%D0%B8%D0%BD%D1%8C%D0%BE%D0%BD%D1%8B_%28%D0%BF%D0%BE%D1%81%D1%82%D0%B5%D1%80%29.jpg/250px-%D0%9C%D0%B8%D0%BD%D1%8C%D0%BE%D0%BD%D1%8B_%28%D0%BF%D0%BE%D1%81%D1%82%D0%B5%D1%80%29.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://relc.tmsimg.com/NowShowing/146687/146687_bi.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://relc.tmsimg.com/NowShowing/146687/146687_bf.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://relc.tmsimg.com/NowShowing/146687/146687_bj.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://ia.media-imdb.com/images/M/MV5BMTUwNjcxNzAwOF5BMl5BanBnXkFtZTgwNzEzMzIzNDE@._V1_SX214_AL_.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://relc.tmsimg.com/NowShowing/146687/146687_bl.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://relc.tmsimg.com/NowShowing/146687/146687_bc.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://relc.tmsimg.com/NowShowing/146687/146687_bm.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://upload.wikimedia.org/wikipedia/fr/thumb/3/35/Minions_%28film%29_-_Logo.jpg/290px-Minions_%28film%29_-_Logo.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://ia.media-imdb.com/images/M/MV5BMTg2MTMyMzU0M15BMl5BanBnXkFtZTgwOTU3ODk4NTE@._V1_UY1200_CR90,0,630,1200_AL_.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://relc.tmsimg.com/NowShowing/146687/146687_bd.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://upload.wikimedia.org/wikipedia/zh/thumb/3/3d/Minions_poster.jpg/220px-Minions_poster.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://relc.tmsimg.com/NowShowing/146687/146687_bh.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://relc.tmsimg.com/NowShowing/146687/146687_bk.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://relc.tmsimg.com/NowShowing/146687/146687_bg.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "https://resizing.flixster.com/BagAGysk6J1jrfbCukDupvhT5i4\u003d/303x480/dkpu1ddg7pbsk.cloudfront.net/movie/11/18/13/11181319_ori.jpg"
      //                            },
      //                            {
      //                                "mediaURL": "http://relc.tmsimg.com/NowShowing/146687/146687_bn.jpg"
      //                            }
      //                        ],
      //                        "entity_data": {
      //                            "common_data": {
      //                                "name": "Minions",
      //                                "summary": {
      //                                    "value": "The story of Minions begins at the dawn of time. Starting as single-celled yellow organisms, Minions evolve through the ages, perpetually serving the most despicable of masters. Continuously unsuccessful at keeping these masters-from T. rex to Napoleon-the Minions find themselves without someone to serve and fall into a deep depression. But one Minion named Kevin has a plan, and he-alongside teenage rebel Stuart and lovable little Bob-ventures out into the world to find a new evil boss for his brethren to follow. The trio embarks upon a thrilling journey that ultimately leads them to their next potential master, Scarlet Overkill, the world\u0027s first-ever female super-villain.  They travel from frigid Antarctica to 1960s New York City, ending in mod London, where they must face their biggest challenge to date: saving all of Minionkind...from annihilation.",
      //                                    "source": "CinemaSource",
      //                                    "url": ""
      //                                },
      //                                "display_rating": [
      //                                    {
      //                                        "rating": "54",
      //                                        "max_rating": "100",
      //                                        "num_votes": "154",
      //                                        "source": "RottenTomatoes",
      //                                        "rating_style": "PERCENTAGE",
      //                                        "source_url": "http://www.rottentomatoes.com/m/minions/"
      //                                    },
      //                                    {
      //                                        "rating": "6.8",
      //                                        "max_rating": "10",
      //                                        "num_votes": "35943",
      //                                        "source": "IMDB",
      //                                        "rating_style": "NUMBER",
      //                                        "source_url": "http://www.imdb.com/title/tt2293640"
      //                                    },
      //                                    {
      //                                        "rating": "56",
      //                                        "max_rating": "100",
      //                                        "source": "MetaCritic",
      //                                        "rating_style": "NUMBER",
      //                                        "source_url": "http://www.metacritic.com"
      //                                    }
      //                                ],
      //                                "live_data": {
      //                                    "value": "In Theatres"
      //                                },
      //                                "contact_info": {
      //                                    "business_url": [
      //                                        "http://www.minionsmovie.com/"
      //                                    ]
      //                                },
      //                                "similar_entity_set": {
      //                                    "header_string": "SIMILAR MOVIES",
      //                                    "footer_string": "See More Similar Movies",
      //                                    "display_sub_entity": [
      //                                        {
      //                                            "title": "Despicable Me 2",
      //                                            "image_info": {
      //                                                "mediaURL": "http://upload.wikimedia.org/wikipedia/en/thumb/2/29/Despicable_Me_2_poster.jpg/220px-Despicable_Me_2_poster.jpg",
      //                                                "source": "http://en.wikipedia.org/wiki/Despicable_Me_2",
      //                                                "width": 220,
      //                                                "height": 348,
      //                                                "fileSize": 28343
      //                                            },
      //                                            "link_info": {
      //                                                "link_id": [
      //                                                    "e5DC0eXnDE55M5svxXcNAG5s9EijQWsB7Tc0QWxvTR2bbl/ZFdRoE+ZjuQgGjXoH"
      //                                                ]
      //                                            },
      //                                            "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                        },
      //                                        {
      //                                            "title": "Despicable Me",
      //                                            "image_info": {
      //                                                "mediaURL": "http://upload.wikimedia.org/wikipedia/en/thumb/d/db/Despicable_Me_Poster.jpg/220px-Despicable_Me_Poster.jpg",
      //                                                "source": "http://en.wikipedia.org/wiki/Despicable_Me",
      //                                                "width": 220,
      //                                                "height": 326,
      //                                                "fileSize": 26655
      //                                            },
      //                                            "link_info": {
      //                                                "link_id": [
      //                                                    "iNU09z6EVrDxXaL92aZtbD0wPtV+jlkjQ+DSFXi0HVhtfkqspdY9JUaGQ2xZELP0"
      //                                                ]
      //                                            },
      //                                            "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                        },
      //                                        {
      //                                            "title": "The SpongeBob Movie: Sponge Out of Water",
      //                                            "image_info": {
      //                                                "mediaURL": "http://upload.wikimedia.org/wikipedia/en/thumb/5/56/SB-2_poster.jpg/220px-SB-2_poster.jpg",
      //                                                "source": "http://en.wikipedia.org/wiki/The_SpongeBob_Movie:_Sponge_Out_of_Water",
      //                                                "width": 220,
      //                                                "height": 343,
      //                                                "fileSize": 31234
      //                                            },
      //                                            "link_info": {
      //                                                "link_id": [
      //                                                    "tKbKRyvz+fQFPoVCftOsVwVmwsXx4vQpHZfxcY/omR82QiKxAgvaoYCquVI7/jiS"
      //                                                ]
      //                                            },
      //                                            "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                        },
      //                                        {
      //                                            "title": "Avengers: Age of Ultron",
      //                                            "image_info": {
      //                                                "mediaURL": "http://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Avengers_Age_of_Ultron.jpg/220px-Avengers_Age_of_Ultron.jpg",
      //                                                "source": "http://en.wikipedia.org/wiki/Avengers:_Age_of_Ultron",
      //                                                "width": 220,
      //                                                "height": 326,
      //                                                "fileSize": 24489
      //                                            },
      //                                            "link_info": {
      //                                                "link_id": [
      //                                                    "iyvp6LTxP53J12axw1UPXDpkdAjV3YOLJMADFSMKVeg6qK46oa3DMGOvgr6HikKk"
      //                                                ]
      //                                            },
      //                                            "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                        },
      //                                        {
      //                                            "title": "Inside Out",
      //                                            "image_info": {
      //                                                "mediaURL": "http://upload.wikimedia.org/wikipedia/en/thumb/0/0a/Inside_Out_%282015_film%29_poster.jpg/220px-Inside_Out_%282015_film%29_poster.jpg",
      //                                                "source": "http://en.wikipedia.org/wiki/Inside_Out_(2015_film)",
      //                                                "width": 220,
      //                                                "height": 314,
      //                                                "fileSize": 18481
      //                                            },
      //                                            "link_info": {
      //                                                "link_id": [
      //                                                    "WrmQQftvBoszMrTLiBCTMlJGTxAVz0yBYIYjuYENn3XKwmtC2gD7MhQArdaVbX52"
      //                                                ]
      //                                            },
      //                                            "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                        },
      //                                        {
      //                                            "title": "Big Hero 6",
      //                                            "image_info": {
      //                                                "mediaURL": "http://upload.wikimedia.org/wikipedia/en/thumb/4/4b/Big_Hero_6_%28film%29_poster.jpg/220px-Big_Hero_6_%28film%29_poster.jpg",
      //                                                "source": "http://en.wikipedia.org/wiki/Big_Hero_6_(film)",
      //                                                "width": 220,
      //                                                "height": 314,
      //                                                "fileSize": 12801
      //                                            },
      //                                            "link_info": {
      //                                                "link_id": [
      //                                                    "n5q5n0YYKpDEBUdRj9jHEdFvDaIsm12qy8PLHL8Kw/namjhGpQpn2eVwAWEor7y4"
      //                                                ]
      //                                            },
      //                                            "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                        },
      //                                        {
      //                                            "title": "Home",
      //                                            "image_info": {
      //                                                "mediaURL": "http://upload.wikimedia.org/wikipedia/en/thumb/8/85/Home_%282015_film%29_poster.jpg/220px-Home_%282015_film%29_poster.jpg",
      //                                                "source": "http://en.wikipedia.org/wiki/Home_(2015_film)",
      //                                                "width": 220,
      //                                                "height": 326,
      //                                                "fileSize": 19956
      //                                            },
      //                                            "link_info": {
      //                                                "link_id": [
      //                                                    "MDUCyOxD2r71CG/OmNzt4hK1gczkIM+usoSp9bsTOE41llR4x+jVQ/iSq/1T74fB"
      //                                                ]
      //                                            },
      //                                            "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                        },
      //                                        {
      //                                            "title": "Jurassic World",
      //                                            "image_info": {
      //                                                "mediaURL": "http://upload.wikimedia.org/wikipedia/en/thumb/6/66/JurassicWorldComicConPoster.jpg/220px-JurassicWorldComicConPoster.jpg",
      //                                                "source": "http://en.wikipedia.org/wiki/Jurassic_World",
      //                                                "width": 220,
      //                                                "height": 330,
      //                                                "fileSize": 18268
      //                                            },
      //                                            "link_info": {
      //                                                "link_id": [
      //                                                    "e5DC0eXnDE5eypR8a78RsSzXxEcyomroLuCASKwrZNwAijbq5yjVaoOQDlYnUn65"
      //                                                ]
      //                                            },
      //                                            "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                        },
      //                                        {
      //                                            "title": "Ant-Man",
      //                                            "image_info": {
      //                                                "mediaURL": "http://upload.wikimedia.org/wikipedia/ru/thumb/7/75/Ant-Man_poster.jpg/200px-Ant-Man_poster.jpg",
      //                                                "source": "http://ru.wikipedia.org/wiki/???????-???????_(?????)",
      //                                                "width": 200,
      //                                                "height": 307,
      //                                                "fileSize": 22436
      //                                            },
      //                                            "link_info": {
      //                                                "link_id": [
      //                                                    "I5IYWe/5S8lLQtMZbXpUyg42SiQSuJyW0c3JVCL4yT/plSJ9g2Wh6xcmYRR+rIZk"
      //                                                ]
      //                                            },
      //                                            "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                        },
      //                                        {
      //                                            "title": "Star Wars: The Force Awakens",
      //                                            "image_info": {
      //                                                "mediaURL": "http://cdn-images.9cloud.us/857/piccit_star_wars_the_force_awakens__450527254.640x0.jpg",
      //                                                "source": "http://picc.it/c/artistic/pictures/album/movie-posters_36512/id/7364208/@star-wars-the-force-awakens-2015-7201110",
      //                                                "width": 640,
      //                                                "height": 986,
      //                                                "fileSize": 108713
      //                                            },
      //                                            "link_info": {
      //                                                "link_id": [
      //                                                    "iyvp6LTxP50VQ4cmGrn6qJvNL8VaVfz0JntkcUcR6xoW2KsxrjIAUi6wmyyBrqNu"
      //                                                ]
      //                                            },
      //                                            "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                        },
      //                                        {
      //                                            "title": "Hotel Transylvania 2",
      //                                            "image_info": {
      //                                                "mediaURL": "http://ia.media-imdb.com/images/M/MV5BOTY0NDU0NzQwOF5BMl5BanBnXkFtZTgwNTQ2MjQ1MzE@._V1_SY317_CR127,0,214,317_AL_.jpg",
      //                                                "source": "http://www.imdb.com/title/tt2510894/",
      //                                                "width": 214,
      //                                                "height": 317,
      //                                                "fileSize": 14359
      //                                            },
      //                                            "link_info": {
      //                                                "link_id": [
      //                                                    "WrmQQftvBosqWKCM/YbYweOlMmTpEDqALYLQdVIS5y1HCqt3ebMH50KiUcsK1vY+"
      //                                                ]
      //                                            },
      //                                            "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                        }
      //                                    ]
      //                                }
      //                            },
      //                            "entertainment_data": {
      //                                "common_data": {
      //                                    "release_year": "2015",
      //                                    "genre": [
      //                                        "Animation",
      //                                        "Comedy",
      //                                        "Family"
      //                                    ],
      //                                    "parental_rating": "PG",
      //                                    "trailer": [
      //                                        {
      //                                            "value": "http://www.fandango.com/movie-trailer/exclusive:minionsliveitup-trailer/178100?autoplay\u003dtrue\u0026mpxId\u003d2671585689"
      //                                        },
      //                                        {
      //                                            "value": "http://trailers.apple.com/trailers/universal/minions/"
      //                                        }
      //                                    ],
      //                                    "performer_set": {
      //                                        "display_sub_entity": [
      //                                            {
      //                                                "title": "Pierre Coffin",
      //                                                "image_info": {
      //                                                    "mediaURL": "http://upload.wikimedia.org/wikipedia/commons/1/16/Pierre_Coffin.jpg",
      //                                                    "source": "http://en.wikipedia.org/wiki/Pierre_Coffin",
      //                                                    "width": 141,
      //                                                    "height": 174,
      //                                                    "fileSize": 7122
      //                                                },
      //                                                "link_info": {
      //                                                    "link_id": [
      //                                                        "SquHHfE4Q4mDlfj9f5hEeUniXHjQwArbJYm3kez8Qald0J/E3GxJ2caS55e9HVcQ"
      //                                                    ]
      //                                                },
      //                                                "content_type_enum": "PERSON_CELEBRITY"
      //                                            },
      //                                            {
      //                                                "title": "Kyle Balda",
      //                                                "link_info": {
      //                                                    "link_id": [
      //                                                        "NAVpOeHQ/6lftAkFM03roDMUyRiD/o33h/MiSL9E+wfJgfyEkjtGz571qwF6spm6"
      //                                                    ]
      //                                                },
      //                                                "content_type_enum": "PERSON_CELEBRITY"
      //                                            },
      //                                            {
      //                                                "title": "Sandra Bullock",
      //                                                "relationship_title": "Scarlett Overkill",
      //                                                "image_info": {
      //                                                    "mediaURL": "http://ia.media-imdb.com/images/M/MV5BMTI5NDY5NjU3NF5BMl5BanBnXkFtZTcwMzQ0MTMyMw@@._V1_SY317_CR1,0,214,317_.jpg",
      //                                                    "source": "http://www.imdb.com/name/nm0000113",
      //                                                    "width": 214,
      //                                                    "height": 317,
      //                                                    "fileSize": 17710
      //                                                },
      //                                                "link_info": {
      //                                                    "link_id": [
      //                                                        "n5q5n0YYKpAZBe66Twfu3s2W5j0z3rwhWtt9x6ZZutvKzr4kJKkhkmXmazLFbIvh"
      //                                                    ]
      //                                                },
      //                                                "content_type_enum": "PERSON_CELEBRITY"
      //                                            },
      //                                            {
      //                                                "title": "Jon Hamm",
      //                                                "relationship_title": "Herb Overkill (voice)",
      //                                                "image_info": {
      //                                                    "mediaURL": "http://ia.media-imdb.com/images/M/MV5BNzg0MzA4MTY5M15BMl5BanBnXkFtZTcwODg2MTIwOQ@@._V1_SY317_CR2,0,214,317_AL_.jpg",
      //                                                    "source": "http://www.imdb.com/name/nm0358316/",
      //                                                    "width": 214,
      //                                                    "height": 317,
      //                                                    "fileSize": 11391
      //                                                },
      //                                                "link_info": {
      //                                                    "link_id": [
      //                                                        "I5IYWe/5S8m+i8KVbCM7o3pe25/ouRjGdv+MstCGDUgSrwYqkoa3e/rIUxOBFRlV"
      //                                                    ]
      //                                                },
      //                                                "content_type_enum": "PERSON_CELEBRITY"
      //                                            }
      //                                        ]
      //                                    },
      //                                    "director_set": {
      //                                        "display_sub_entity": [
      //                                            {
      //                                                "title": "Pierre Coffin",
      //                                                "image_info": {
      //                                                    "mediaURL": "http://upload.wikimedia.org/wikipedia/commons/1/16/Pierre_Coffin.jpg",
      //                                                    "source": "http://en.wikipedia.org/wiki/Pierre_Coffin",
      //                                                    "width": 141,
      //                                                    "height": 174,
      //                                                    "fileSize": 7122
      //                                                },
      //                                                "link_info": {
      //                                                    "link_id": [
      //                                                        "SquHHfE4Q4mDlfj9f5hEeUniXHjQwArbJYm3kez8Qald0J/E3GxJ2caS55e9HVcQ"
      //                                                    ]
      //                                                },
      //                                                "content_type_enum": "PERSON_CELEBRITY"
      //                                            },
      //                                            {
      //                                                "title": "Kyle Balda",
      //                                                "link_info": {
      //                                                    "link_id": [
      //                                                        "NAVpOeHQ/6lftAkFM03roDMUyRiD/o33h/MiSL9E+wfJgfyEkjtGz571qwF6spm6"
      //                                                    ]
      //                                                },
      //                                                "content_type_enum": "PERSON_CELEBRITY"
      //                                            }
      //                                        ]
      //                                    }
      //                                },
      //                                "movie_data": {
      //                                    "length": "91 min",
      //                                    "theatre_showtime": {
      //                                        "showtimes": [
      //                                            {
      //                                                "playing_entity": {
      //                                                    "title": "Century Cinema 16",
      //                                                    "location": {
      //                                                        "address": {
      //                                                            "street_address": "1500 N. Shoreline Blvd.",
      //                                                            "city": "Mountain View",
      //                                                            "state": "CA",
      //                                                            "country": "USA",
      //                                                            "postal_code": "94043"
      //                                                        },
      //                                                        "latitude": 37.4156,
      //                                                        "longitude": -122.0781,
      //                                                        "display_distance": "8 min drive"
      //                                                    },
      //                                                    "link_info": {
      //                                                        "link_id": [
      //                                                            "yl2dZeD3pRqtkNPCt/95hg\u003d\u003d"
      //                                                        ]
      //                                                    },
      //                                                    "content_type_enum": "LOCAL_BUSINESS"
      //                                                },
      //                                                "shows": {
      //                                                    "days": [
      //                                                        {
      //                                                            "hours": [
      //                                                                {
      //                                                                    "open_time": "1438202400000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+13:40"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "01:40 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438204800000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+14:20"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "02:20 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438212000000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+16:20"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "04:20 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438214100000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+16:55"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "04:55 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438221600000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+19:00"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "07:00 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438224000000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+19:40"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "07:40 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438231200000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+21:40"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "09:40 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438233300000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+22:15"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "10:15 PM"
      //                                                                }
      //                                                            ],
      //                                                            "day_of_week": "WEDNESDAY",
      //                                                            "date": 1438202400000
      //                                                        },
      //                                                        {
      //                                                            "hours": [
      //                                                                {
      //                                                                    "open_time": "1438272000000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+09:00"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "09:00 AM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438279200000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+11:00"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "11:00 AM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438281600000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+11:40"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "11:40 AM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438288800000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+13:40"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "01:40 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438291200000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+14:20"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "02:20 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438298400000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+16:20"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "04:20 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438300500000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+16:55"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "04:55 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438308000000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+19:00"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "07:00 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438310400000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+19:40"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "07:40 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438317600000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+21:40"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "09:40 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438319700000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+22:15"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "10:15 PM"
      //                                                                }
      //                                                            ],
      //                                                            "day_of_week": "THURSDAY",
      //                                                            "date": 1438272000000
      //                                                        },
      //                                                        {
      //                                                            "hours": [
      //                                                                {
      //                                                                    "open_time": "1438358400000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+09:00"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "09:00 AM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438362900000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+10:15"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "10:15 AM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438367400000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+11:30"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "11:30 AM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438371900000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+12:45"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "12:45 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438376400000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+14:00"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "02:00 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438380900000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+15:15"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "03:15 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438385400000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+16:30"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "04:30 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438389900000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+17:45"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "05:45 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438395300000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+19:15"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "07:15 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438399800000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+20:30"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "08:30 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438404000000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+21:40"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "09:40 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438408500000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+22:55"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "10:55 PM"
      //                                                                }
      //                                                            ],
      //                                                            "day_of_week": "FRIDAY",
      //                                                            "date": 1438358400000
      //                                                        },
      //                                                        {
      //                                                            "hours": [
      //                                                                {
      //                                                                    "open_time": "1438444800000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-08-01+09:00"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "09:00 AM"
      //                                                                }
      //                                                            ],
      //                                                            "day_of_week": "SATURDAY",
      //                                                            "date": 1438444800000
      //                                                        }
      //                                                    ],
      //                                                    "timezone": "America/Los_Angeles"
      //                                                }
      //                                            },
      //                                            {
      //                                                "playing_entity": {
      //                                                    "title": "AMC Cupertino Square 16",
      //                                                    "location": {
      //                                                        "address": {
      //                                                            "street_address": "10123 N. Wolfe Rd.",
      //                                                            "city": "Cupertino",
      //                                                            "state": "CA",
      //                                                            "country": "USA",
      //                                                            "postal_code": "95014"
      //                                                        },
      //                                                        "latitude": 37.3262,
      //                                                        "longitude": -122.0144,
      //                                                        "display_distance": "15 min drive"
      //                                                    },
      //                                                    "link_info": {
      //                                                        "link_id": [
      //                                                            "yl2dZeD3pRpaqeyHvFkL3g\u003d\u003d"
      //                                                        ]
      //                                                    },
      //                                                    "content_type_enum": "LOCAL_BUSINESS"
      //                                                },
      //                                                "shows": {
      //                                                    "days": [
      //                                                        {
      //                                                            "hours": [
      //                                                                {
      //                                                                    "open_time": "1438211700000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-29+16:15"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "04:15 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438230600000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-29+21:30"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "09:30 PM"
      //                                                                }
      //                                                            ],
      //                                                            "day_of_week": "WEDNESDAY",
      //                                                            "date": 1438211700000
      //                                                        },
      //                                                        {
      //                                                            "hours": [
      //                                                                {
      //                                                                    "open_time": "1438282800000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-30+12:00"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "12:00 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438291800000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-30+14:30"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "02:30 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438298100000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-30+16:15"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "04:15 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438317000000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-30+21:30"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "09:30 PM"
      //                                                                }
      //                                                            ],
      //                                                            "day_of_week": "THURSDAY",
      //                                                            "date": 1438282800000
      //                                                        },
      //                                                        {
      //                                                            "hours": [
      //                                                                {
      //                                                                    "open_time": "1438363800000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-31+10:30"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "10:30 AM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438374000000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-31+13:20"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "01:20 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438384200000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-31+16:10"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "04:10 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438394100000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-31+18:55"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "06:55 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438403100000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-31+21:25"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "09:25 PM"
      //                                                                }
      //                                                            ],
      //                                                            "day_of_week": "FRIDAY",
      //                                                            "date": 1438363800000
      //                                                        },
      //                                                        {
      //                                                            "hours": [
      //                                                                {
      //                                                                    "open_time": "1438450200000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-08-01+10:30"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "10:30 AM"
      //                                                                }
      //                                                            ],
      //                                                            "day_of_week": "SATURDAY",
      //                                                            "date": 1438450200000
      //                                                        }
      //                                                    ],
      //                                                    "timezone": "America/Los_Angeles"
      //                                                }
      //                                            },
      //                                            {
      //                                                "playing_entity": {
      //                                                    "title": "AMC Mercado 20",
      //                                                    "location": {
      //                                                        "address": {
      //                                                            "street_address": "3111 Mission College Blvd.",
      //                                                            "city": "Santa Clara",
      //                                                            "state": "CA",
      //                                                            "country": "USA",
      //                                                            "postal_code": "95054"
      //                                                        },
      //                                                        "latitude": 37.3881,
      //                                                        "longitude": -121.9836,
      //                                                        "display_distance": "14 min drive"
      //                                                    },
      //                                                    "link_info": {
      //                                                        "link_id": [
      //                                                            "yl2dZeD3pRqp9d/7ynelGw\u003d\u003d"
      //                                                        ]
      //                                                    },
      //                                                    "content_type_enum": "LOCAL_BUSINESS"
      //                                                },
      //                                                "shows": {
      //                                                    "days": [
      //                                                        {
      //                                                            "hours": [
      //                                                                {
      //                                                                    "open_time": "1438206900000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-29+14:55"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "02:55 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438215600000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-29+17:20"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "05:20 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438224300000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-29+19:45"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "07:45 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438232700000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-29+22:05"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "10:05 PM"
      //                                                                }
      //                                                            ],
      //                                                            "day_of_week": "WEDNESDAY",
      //                                                            "date": 1438206900000
      //                                                        },
      //                                                        {
      //                                                            "hours": [
      //                                                                {
      //                                                                    "open_time": "1438276200000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+10:10"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "10:10 AM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438284900000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+12:35"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "12:35 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438293300000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+14:55"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "02:55 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438302000000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+17:20"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "05:20 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438310700000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+19:45"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "07:45 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438319100000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+22:05"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "10:05 PM"
      //                                                                }
      //                                                            ],
      //                                                            "day_of_week": "THURSDAY",
      //                                                            "date": 1438276200000
      //                                                        },
      //                                                        {
      //                                                            "hours": [
      //                                                                {
      //                                                                    "open_time": "1438363200000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+10:20"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "10:20 AM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438372200000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+12:50"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "12:50 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438380900000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+15:15"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "03:15 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438389600000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+17:40"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "05:40 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438398600000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+20:10"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "08:10 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438407300000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+22:35"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "10:35 PM"
      //                                                                }
      //                                                            ],
      //                                                            "day_of_week": "FRIDAY",
      //                                                            "date": 1438363200000
      //                                                        },
      //                                                        {
      //                                                            "hours": [
      //                                                                {
      //                                                                    "open_time": "1438449600000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-08-01+10:20"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "10:20 AM"
      //                                                                }
      //                                                            ],
      //                                                            "day_of_week": "SATURDAY",
      //                                                            "date": 1438449600000
      //                                                        }
      //                                                    ],
      //                                                    "timezone": "America/Los_Angeles"
      //                                                }
      //                                            },
      //                                            {
      //                                                "playing_entity": {
      //                                                    "title": "AMC Saratoga 14",
      //                                                    "location": {
      //                                                        "address": {
      //                                                            "street_address": "700 El Paseo De Saratoga",
      //                                                            "city": "San Jose",
      //                                                            "state": "CA",
      //                                                            "country": "USA",
      //                                                            "postal_code": "95130"
      //                                                        },
      //                                                        "latitude": 37.2899,
      //                                                        "longitude": -121.9918,
      //                                                        "display_distance": "24 min drive"
      //                                                    },
      //                                                    "link_info": {
      //                                                        "link_id": [
      //                                                            "yl2dZeD3pRrQbOSWovHJQA\u003d\u003d"
      //                                                        ]
      //                                                    },
      //                                                    "content_type_enum": "LOCAL_BUSINESS"
      //                                                },
      //                                                "shows": {
      //                                                    "days": [
      //                                                        {
      //                                                            "hours": [
      //                                                                {
      //                                                                    "open_time": "1438203300000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-29+13:55"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "01:55 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438212300000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-29+16:25"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "04:25 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438220700000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-29+18:45"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "06:45 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438230000000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-29+21:20"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "09:20 PM"
      //                                                                }
      //                                                            ],
      //                                                            "day_of_week": "WEDNESDAY",
      //                                                            "date": 1438203300000
      //                                                        },
      //                                                        {
      //                                                            "hours": [
      //                                                                {
      //                                                                    "open_time": "1438281300000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-30+11:35"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "11:35 AM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438289700000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-30+13:55"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "01:55 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438298700000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-30+16:25"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "04:25 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438307100000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-30+18:45"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "06:45 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438316400000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-30+21:20"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "09:20 PM"
      //                                                                }
      //                                                            ],
      //                                                            "day_of_week": "THURSDAY",
      //                                                            "date": 1438281300000
      //                                                        },
      //                                                        {
      //                                                            "hours": [
      //                                                                {
      //                                                                    "open_time": "1438359600000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+09:20"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "09:20 AM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438370100000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+12:15"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "12:15 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438378500000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+14:35"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "02:35 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438386900000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+16:55"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "04:55 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438397400000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+19:50"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "07:50 PM"
      //                                                                },
      //                                                                {
      //                                                                    "open_time": "1438405800000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+22:10"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "10:10 PM"
      //                                                                }
      //                                                            ],
      //                                                            "day_of_week": "FRIDAY",
      //                                                            "date": 1438359600000
      //                                                        },
      //                                                        {
      //                                                            "hours": [
      //                                                                {
      //                                                                    "open_time": "1438446000000",
      //                                                                    "link_info": {
      //                                                                        "link_id": [
      //                                                                            "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-08-01+09:20"
      //                                                                        ]
      //                                                                    },
      //                                                                    "open_display_string": "09:20 AM"
      //                                                                }
      //                                                            ],
      //                                                            "day_of_week": "SATURDAY",
      //                                                            "date": 1438446000000
      //                                                        }
      //                                                    ],
      //                                                    "timezone": "America/Los_Angeles"
      //                                                }
      //                                            }
      //                                        ],
      //                                        "link_info": {
      //                                            "link_id": [
      //                                                "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687"
      //                                            ]
      //                                        }
      //                                    }
      //                                }
      //                            },
      //                            "local_data": {
      //                                "location_info": {}
      //                            }
      //                        },
      //                        "link": [
      //                            {
      //                                "link_id": "e5DC0eXnDE55M5svxXcNAG5s9EijQWsB7Tc0QWxvTR2bbl/ZFdRoE+ZjuQgGjXoH",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:-2821445890390494076",
      //                                        "cipher_id": "e5DC0eXnDE55M5svxXcNAG5s9EijQWsB7Tc0QWxvTR2bbl/ZFdRoE+ZjuQgGjXoH",
      //                                        "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                    },
      //                                    "extra_info": "despicable me 2"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "iNU09z6EVrDxXaL92aZtbD0wPtV+jlkjQ+DSFXi0HVhtfkqspdY9JUaGQ2xZELP0",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:7912832939132849474",
      //                                        "cipher_id": "iNU09z6EVrDxXaL92aZtbD0wPtV+jlkjQ+DSFXi0HVhtfkqspdY9JUaGQ2xZELP0",
      //                                        "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                    },
      //                                    "extra_info": "despicable me 2010"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "tKbKRyvz+fQFPoVCftOsVwVmwsXx4vQpHZfxcY/omR82QiKxAgvaoYCquVI7/jiS",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:8836706364704860303",
      //                                        "cipher_id": "tKbKRyvz+fQFPoVCftOsVwVmwsXx4vQpHZfxcY/omR82QiKxAgvaoYCquVI7/jiS",
      //                                        "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                    },
      //                                    "extra_info": "sponge out of water"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "iyvp6LTxP53J12axw1UPXDpkdAjV3YOLJMADFSMKVeg6qK46oa3DMGOvgr6HikKk",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:3960841344802438073",
      //                                        "cipher_id": "iyvp6LTxP53J12axw1UPXDpkdAjV3YOLJMADFSMKVeg6qK46oa3DMGOvgr6HikKk",
      //                                        "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                    },
      //                                    "extra_info": "avengers age of ultron"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "WrmQQftvBoszMrTLiBCTMlJGTxAVz0yBYIYjuYENn3XKwmtC2gD7MhQArdaVbX52",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:-9104758517044025229",
      //                                        "cipher_id": "WrmQQftvBoszMrTLiBCTMlJGTxAVz0yBYIYjuYENn3XKwmtC2gD7MhQArdaVbX52",
      //                                        "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                    },
      //                                    "extra_info": "inside out 2015"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "n5q5n0YYKpDEBUdRj9jHEdFvDaIsm12qy8PLHL8Kw/namjhGpQpn2eVwAWEor7y4",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:974046808228871023",
      //                                        "cipher_id": "n5q5n0YYKpDEBUdRj9jHEdFvDaIsm12qy8PLHL8Kw/namjhGpQpn2eVwAWEor7y4",
      //                                        "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                    },
      //                                    "extra_info": "big hero 6 2014"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "MDUCyOxD2r71CG/OmNzt4hK1gczkIM+usoSp9bsTOE41llR4x+jVQ/iSq/1T74fB",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:-4711838244624170122",
      //                                        "cipher_id": "MDUCyOxD2r71CG/OmNzt4hK1gczkIM+usoSp9bsTOE41llR4x+jVQ/iSq/1T74fB",
      //                                        "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                    },
      //                                    "extra_info": "home 2015"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "e5DC0eXnDE5eypR8a78RsSzXxEcyomroLuCASKwrZNwAijbq5yjVaoOQDlYnUn65",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:7257752198088783084",
      //                                        "cipher_id": "e5DC0eXnDE5eypR8a78RsSzXxEcyomroLuCASKwrZNwAijbq5yjVaoOQDlYnUn65",
      //                                        "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                    },
      //                                    "extra_info": "jurassic world 2015"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "I5IYWe/5S8lLQtMZbXpUyg42SiQSuJyW0c3JVCL4yT/plSJ9g2Wh6xcmYRR+rIZk",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:9216133721507798911",
      //                                        "cipher_id": "I5IYWe/5S8lLQtMZbXpUyg42SiQSuJyW0c3JVCL4yT/plSJ9g2Wh6xcmYRR+rIZk",
      //                                        "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                    },
      //                                    "extra_info": "ant-man movie"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "iyvp6LTxP50VQ4cmGrn6qJvNL8VaVfz0JntkcUcR6xoW2KsxrjIAUi6wmyyBrqNu",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:4037217158081125092",
      //                                        "cipher_id": "iyvp6LTxP50VQ4cmGrn6qJvNL8VaVfz0JntkcUcR6xoW2KsxrjIAUi6wmyyBrqNu",
      //                                        "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                    },
      //                                    "extra_info": "star wars the force awakens"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "WrmQQftvBosqWKCM/YbYweOlMmTpEDqALYLQdVIS5y1HCqt3ebMH50KiUcsK1vY+",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:-7036780382508941747",
      //                                        "cipher_id": "WrmQQftvBosqWKCM/YbYweOlMmTpEDqALYLQdVIS5y1HCqt3ebMH50KiUcsK1vY+",
      //                                        "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                    },
      //                                    "extra_info": "hotel transylvania 2"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "SquHHfE4Q4mDlfj9f5hEeUniXHjQwArbJYm3kez8Qald0J/E3GxJ2caS55e9HVcQ",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:-4220133841875510090",
      //                                        "cipher_id": "SquHHfE4Q4mDlfj9f5hEeUniXHjQwArbJYm3kez8Qald0J/E3GxJ2caS55e9HVcQ",
      //                                        "content_type_enum": "PERSON_CELEBRITY"
      //                                    },
      //                                    "extra_info": "pierre coffin"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "NAVpOeHQ/6lftAkFM03roDMUyRiD/o33h/MiSL9E+wfJgfyEkjtGz571qwF6spm6",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:7737866738663327739",
      //                                        "cipher_id": "NAVpOeHQ/6lftAkFM03roDMUyRiD/o33h/MiSL9E+wfJgfyEkjtGz571qwF6spm6",
      //                                        "content_type_enum": "PERSON_CELEBRITY"
      //                                    },
      //                                    "extra_info": "kyle balda"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "n5q5n0YYKpAZBe66Twfu3s2W5j0z3rwhWtt9x6ZZutvKzr4kJKkhkmXmazLFbIvh",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:1126172252854636044",
      //                                        "cipher_id": "n5q5n0YYKpAZBe66Twfu3s2W5j0z3rwhWtt9x6ZZutvKzr4kJKkhkmXmazLFbIvh",
      //                                        "content_type_enum": "PERSON_CELEBRITY"
      //                                    },
      //                                    "extra_info": "sandra bullock"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "I5IYWe/5S8m+i8KVbCM7o3pe25/ouRjGdv+MstCGDUgSrwYqkoa3e/rIUxOBFRlV",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:4149556856152371251",
      //                                        "cipher_id": "I5IYWe/5S8m+i8KVbCM7o3pe25/ouRjGdv+MstCGDUgSrwYqkoa3e/rIUxOBFRlV",
      //                                        "content_type_enum": "PERSON_CELEBRITY"
      //                                    },
      //                                    "extra_info": "jon hamm"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+13:40",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+13:40"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+14:20",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+14:20"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+16:20",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+16:20"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+16:55",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+16:55"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+19:00",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+19:00"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+19:40",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+19:40"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+21:40",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+21:40"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+22:15",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-29+22:15"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+09:00",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+09:00"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+11:00",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+11:00"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+11:40",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+11:40"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+13:40",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+13:40"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+14:20",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+14:20"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+16:20",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+16:20"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+16:55",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+16:55"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+19:00",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+19:00"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+19:40",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+19:40"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+21:40",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+21:40"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+22:15",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-30+22:15"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+09:00",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+09:00"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+10:15",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+10:15"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+11:30",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+11:30"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+12:45",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+12:45"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+14:00",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+14:00"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+15:15",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+15:15"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+16:30",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+16:30"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+17:45",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+17:45"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+19:15",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+19:15"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+20:30",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+20:30"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+21:40",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+21:40"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+22:55",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-07-31+22:55"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-08-01+09:00",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAACFX\u0026d\u003d2015-08-01+09:00"
      //                            },
      //                            {
      //                                "link_id": "yl2dZeD3pRqtkNPCt/95hg\u003d\u003d",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:1643944173757002693",
      //                                        "cipher_id": "yl2dZeD3pRqtkNPCt/95hg\u003d\u003d",
      //                                        "content_type_enum": "LOCAL_BUSINESS"
      //                                    },
      //                                    "extra_info": "Century Cinema 16"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-29+16:15",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-29+16:15"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-29+21:30",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-29+21:30"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-30+12:00",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-30+12:00"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-30+14:30",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-30+14:30"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-30+16:15",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-30+16:15"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-30+21:30",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-30+21:30"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-31+10:30",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-31+10:30"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-31+13:20",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-31+13:20"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-31+16:10",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-31+16:10"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-31+18:55",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-31+18:55"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-31+21:25",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-07-31+21:25"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-08-01+10:30",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAUJF\u0026d\u003d2015-08-01+10:30"
      //                            },
      //                            {
      //                                "link_id": "yl2dZeD3pRpaqeyHvFkL3g\u003d\u003d",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:-3264376484372469626",
      //                                        "cipher_id": "yl2dZeD3pRpaqeyHvFkL3g\u003d\u003d",
      //                                        "content_type_enum": "LOCAL_BUSINESS"
      //                                    },
      //                                    "extra_info": "AMC Cupertino Square 16"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-29+14:55",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-29+14:55"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-29+17:20",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-29+17:20"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-29+19:45",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-29+19:45"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-29+22:05",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-29+22:05"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+10:10",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+10:10"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+12:35",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+12:35"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+14:55",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+14:55"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+17:20",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+17:20"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+19:45",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+19:45"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+22:05",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-30+22:05"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+10:20",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+10:20"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+12:50",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+12:50"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+15:15",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+15:15"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+17:40",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+17:40"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+20:10",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+20:10"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+22:35",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-07-31+22:35"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-08-01+10:20",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAADYN\u0026d\u003d2015-08-01+10:20"
      //                            },
      //                            {
      //                                "link_id": "yl2dZeD3pRqp9d/7ynelGw\u003d\u003d",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:-3340184196789889903",
      //                                        "cipher_id": "yl2dZeD3pRqp9d/7ynelGw\u003d\u003d",
      //                                        "content_type_enum": "LOCAL_BUSINESS"
      //                                    },
      //                                    "extra_info": "AMC Mercado 20"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-29+13:55",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-29+13:55"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-29+16:25",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-29+16:25"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-29+18:45",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-29+18:45"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-29+21:20",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-29+21:20"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-30+11:35",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-30+11:35"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-30+13:55",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-30+13:55"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-30+16:25",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-30+16:25"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-30+18:45",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-30+18:45"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-30+21:20",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-30+21:20"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+09:20",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+09:20"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+12:15",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+12:15"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+14:35",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+14:35"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+16:55",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+16:55"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+19:50",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+19:50"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+22:10",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-07-31+22:10"
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-08-01+09:20",
      //                                "link_type": "WEB_LINK",
      //                                "web_url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687\u0026t\u003dAAECU\u0026d\u003d2015-08-01+09:20"
      //                            },
      //                            {
      //                                "link_id": "yl2dZeD3pRrQbOSWovHJQA\u003d\u003d",
      //                                "link_type": "RELCY_LINK",
      //                                "relcy_link": {
      //                                    "relcy_id": {
      //                                        "entity_id": "look:8280798394350623144",
      //                                        "cipher_id": "yl2dZeD3pRrQbOSWovHJQA\u003d\u003d",
      //                                        "content_type_enum": "LOCAL_BUSINESS"
      //                                    },
      //                                    "extra_info": "AMC Saratoga 14"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687",
      //                                "link_type": "APP_LINK",
      //                                "app_result": {
      //                                    "app": {
      //                                        "app_id": ""
      //                                    },
      //                                    "url": "http://mobile.fandango.com/tms.asp?a\u003d12970\u0026m\u003d146687",
      //                                    "result_data": {
      //                                        "title": "",
      //                                        "action": ""
      //                                    },
      //                                    "app_url": "",
      //                                    "entity_id": "look:-5071560213288892831",
      //                                    "score": 1.0,
      //                                    "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "https://itunes.apple.com/us/movie/minions/id991372004",
      //                                "link_type": "APP_LINK",
      //                                "app_result": {
      //                                    "app": {
      //                                        "app_id": "iTunes"
      //                                    },
      //                                    "url": "https://itunes.apple.com/us/movie/minions/id991372004",
      //                                    "result_data": {
      //                                        "title": "iTunes",
      //                                        "sub_title": "",
      //                                        "action": "Watch"
      //                                    },
      //                                    "app_url": "https://itunes.apple.com/us/movie/minions/id991372004",
      //                                    "entity_id": "look:-5071560213288892831",
      //                                    "score": 54.0,
      //                                    "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "http://www.imdb.com/title/tt2293640",
      //                                "link_type": "APP_LINK",
      //                                "app_result": {
      //                                    "app": {
      //                                        "app_id": "IMDb",
      //                                        "store_url": "itunes.app.id342792525"
      //                                    },
      //                                    "url": "http://www.imdb.com/title/tt2293640",
      //                                    "result_data": {
      //                                        "title": "IMDb",
      //                                        "sub_title": "6.8/10 . 35K reviews",
      //                                        "action": "Reviews and More"
      //                                    },
      //                                    "app_url": "",
      //                                    "entity_id": "look:-5071560213288892831",
      //                                    "score": 22.0,
      //                                    "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "http://en.wikipedia.org/wiki/Minions_(film)",
      //                                "link_type": "APP_LINK",
      //                                "app_result": {
      //                                    "app": {
      //                                        "app_id": "Wikipedia",
      //                                        "store_url": "itunes.app.id324715238"
      //                                    },
      //                                    "url": "http://en.wikipedia.org/wiki/Minions_(film)",
      //                                    "result_data": {
      //                                        "title": "Wikipedia",
      //                                        "sub_title": "",
      //                                        "action": "Reviews and More"
      //                                    },
      //                                    "app_url": "",
      //                                    "entity_id": "look:-5071560213288892831",
      //                                    "score": 20.0,
      //                                    "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "http://www.flixster.com/movie/771314279",
      //                                "link_type": "APP_LINK",
      //                                "app_result": {
      //                                    "app": {
      //                                        "app_id": "Flixster",
      //                                        "store_url": "itunes.app.id284235722"
      //                                    },
      //                                    "url": "http://www.flixster.com/movie/771314279",
      //                                    "result_data": {
      //                                        "title": "Flixster",
      //                                        "sub_title": "",
      //                                        "action": "Reviews and More"
      //                                    },
      //                                    "app_url": "flixster://?action\u003dmovieDetails\u0026movieId\u003d771314279",
      //                                    "entity_id": "look:-5071560213288892831",
      //                                    "score": 19.0,
      //                                    "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "http://www.rottentomatoes.com/m/minions/",
      //                                "link_type": "APP_LINK",
      //                                "app_result": {
      //                                    "app": {
      //                                        "app_id": "Rotten Tomatoes"
      //                                    },
      //                                    "url": "http://www.rottentomatoes.com/m/minions/",
      //                                    "result_data": {
      //                                        "title": "Rotten Tomatoes",
      //                                        "sub_title": "54% . 154 reviews",
      //                                        "action": "Reviews and More"
      //                                    },
      //                                    "app_url": "",
      //                                    "entity_id": "look:-5071560213288892831",
      //                                    "score": 16.0,
      //                                    "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                }
      //                            },
      //                            {
      //                                "link_id": "http://www.fandango.com/minions2015_178100/movieoverview",
      //                                "link_type": "APP_LINK",
      //                                "app_result": {
      //                                    "app": {
      //                                        "app_id": "Fandango",
      //                                        "store_url": "itunes.app.id307906541"
      //                                    },
      //                                    "url": "http://www.fandango.com/minions2015_178100/movieoverview",
      //                                    "result_data": {
      //                                        "title": "Fandango",
      //                                        "sub_title": "",
      //                                        "action": "Tickets"
      //                                    },
      //                                    "app_url": "fandango:///minions2015_178100/movieoverview",
      //                                    "entity_id": "look:-5071560213288892831",
      //                                    "score": 0.0,
      //                                    "content_type_enum": "ENTERTAINMENT_VIDEO_MOVIE"
      //                                }
      //                            }
      //                        ],
      //                        "is_detail_result": true,
      //                        "social_result": [
      //                            {
      //                                "app": {
      //                                    "app_id": "IMDb"
      //                                },
      //                                "url": "http://www.imdb.com/title/tt2293640",
      //                                "result_data": {
      //                                    "title": "imdbreviewer posted a review",
      //                                    "sub_title": "You\u0027d be hard-pressed to find a historical account that acknowledges the influence (much less the existence of) the Minions throughout time. No matter...",
      //                                    "annotation": "18 days ago"
      //                                },
      //                                "app_url": ""
      //                            }
      //                        ],
      //                        "display_string": "Movie",
      //                        "display_string_plural": "Movies"
      //                    }
      //                ]
      //            },
      //            "headerString": "Movie",
      //            "footerString": "Movie"
      //        },
      //        {
      //            "content_type_enum": "WEB",
      //            "elbowPoint": 3,
      //            "webSearchResult": {
      //                "searchResults": [
      //                    {
      //                        "title": "Minions (2015) - IMDb",
      //                        "displayUrl": "www.imdb.com/title/tt2293640",
      //                        "clickUrl": "http://www.imdb.com/title/tt2293640/",
      //                        "summary": "Minions Stuart, Kevin and Bob are recruited by Scarlet Overkill, a super-villain who, alongside her inventor husband Herb, hatches a plot to take over the world.",
      //                        "pingUrlSuffix": "DevEx,5095.1"
      //                    },
      //                    {
      //                        "title": "Minions (film) - Wikipedia, the free encyclopedia",
      //                        "displayUrl": "en.wikipedia.org/wiki/Minions_(film)",
      //                        "clickUrl": "http://en.wikipedia.org/wiki/Minions_(film)",
      //                        "summary": "Minions is a 2015 American 3D computer-animated family comedy film, and a prequel / spin-off to the Despicable Me franchise. Produced by Illumination Entertainment ...",
      //                        "thumbNameUrl": "https://www.bing.com/th?id\u003dRNL%2fsuMIQC1h5%2fQr3e0t1qgYNq9nsbeTQykwhst5q%2b07w_SXJ9jxr2nl9mKFQ\u0026pid\u003dApi\u0026w\u003d48\u0026c\u003d1",
      //                        "pingUrlSuffix": "DevEx,5124.1"
      //                    },
      //                    {
      //                        "title": "Minions",
      //                        "displayUrl": "www.minionsmovie.com",
      //                        "clickUrl": "http://www.minionsmovie.com/",
      //                        "summary": "Minions. Minions Movie The Secret Life of Pets Despicable Me Despicable Me 2 Fan-Made Behind the Goggles Buy Tickets - Fandango.com Buy Tickets - MovieTickets.com.",
      //                        "pingUrlSuffix": "DevEx,5144.1"
      //                    },
      //                    {
      //                        "title": "Minions (2015) - Rotten Tomatoes",
      //                        "displayUrl": "www.rottentomatoes.com/m/minions",
      //                        "clickUrl": "http://www.rottentomatoes.com/m/minions/",
      //                        "summary": "Movie Info. The story of Universal Pictures and Illumination Entertainment\u0027s Minions begins at the dawn of time. Starting as single-celled yellow organisms, Minions ...",
      //                        "pingUrlSuffix": "DevEx,5169.1"
      //                    },
      //                    {
      //                        "title": "Minions (2015) (2015) | Fandango",
      //                        "displayUrl": "www.fandango.com/minions2015_178100/movieoverview",
      //                        "clickUrl": "http://www.fandango.com/minions2015_178100/movieoverview",
      //                        "summary": "Minions (2015) movie info - movie times, trailers, reviews, tickets, actors and more on Fandango.",
      //                        "pingUrlSuffix": "DevEx,5196.1"
      //                    },
      //                    {
      //                        "title": "Minions (2015) Times - Movie Tickets | Fandango",
      //                        "displayUrl": "www.fandango.com/minions2015_178100/movietimes",
      //                        "clickUrl": "http://www.fandango.com/minions2015_178100/movietimes",
      //                        "summary": "Minions (2015) showtimes and movie theaters. Buy 3D Minions (2015) movie tickets on Fandango.",
      //                        "pingUrlSuffix": "DevEx,5223.1"
      //                    },
      //                    {
      //                        "title": "Minions (2015) Movie Trailer | Movie-List.com",
      //                        "displayUrl": "www.movie-list.com/trailers/minions",
      //                        "clickUrl": "http://www.movie-list.com/trailers/minions",
      //                        "summary": "Watch the movie trailer for Minions (2015) on Movie-List. Directed by Kyle Balda, Pierre Coffin and starring Sandra Bullock, Steve Carell, Jon Hamm and Katy Mixon.",
      //                        "pingUrlSuffix": "DevEx,5238.1"
      //                    },
      //                    {
      //                        "title": "Minions movie",
      //                        "displayUrl": "www.minionsmovie.com/minions.html",
      //                        "clickUrl": "http://www.minionsmovie.com/minions.html",
      //                        "summary": "First Look with Pharrell and The Voice. Minions - Official Trailer 3 (HD) - Illumination. Minions - Official Trailer 2 (HD) - Illumination",
      //                        "pingUrlSuffix": "DevEx,5251.1"
      //                    },
      //                    {
      //                        "title": "\u0027Despicable Me\u0027 Minions Movie Gets a Release Date | Movie ...",
      //                        "displayUrl": "www.movies.com/movie-news/despicable-me-minions-movie/9258",
      //                        "clickUrl": "http://www.movies.com/movie-news/despicable-me-minions-movie/9258",
      //                        "summary": "\u0027Despicable Me\u0027 Minions Movie Gets a Release Date. Read this and other movie news, reviews, and more at Movies.com.",
      //                        "pingUrlSuffix": "DevEx,5271.1"
      //                    },
      //                    {
      //                        "title": "Minions Official Trailer #2 (2015) - Despicable Me Prequel ...",
      //                        "displayUrl": "www.youtube.com/watch?v\u003ddVDk7PXNXB8",
      //                        "clickUrl": "http://www.youtube.com/watch?v\u003ddVDk7PXNXB8",
      //                        "summary": "Subscribe to TRAILERS: http://bit.ly/sxaw6h Subscribe to COMING SOON: http://bit.ly/H2vZUn Like us on FACEBOOK: http://goo.gl/dHs73 Follow us on TWITTER ...",
      //                        "pingUrlSuffix": "DevEx,5295.1"
      //                    },
      //                    {
      //                        "title": "Minions (2015) Movie",
      //                        "displayUrl": "www.movieinsider.com/m10522/minions",
      //                        "clickUrl": "http://www.movieinsider.com/m10522/minions/",
      //                        "summary": "Minions in US theaters July 10, 2015 starring Sandra Bullock, Pierre Coffin, Chris Renaud, Jon Hamm. The story of Universal Pictures and Illumination Entertainment ...",
      //                        "pingUrlSuffix": "DevEx,5308.1"
      //                    },
      //                    {
      //                        "title": "Minions Movie Review \u0026 Film Summary (2015) | Roger Ebert",
      //                        "displayUrl": "www.rogerebert.com/reviews/minions-2015",
      //                        "clickUrl": "http://www.rogerebert.com/reviews/minions-2015",
      //                        "summary": "If those little yellow creatures from Despicable Me and its sequel drove you bananas, you?ll find no respite at Minions, the third chapter in the series.",
      //                        "pingUrlSuffix": "DevEx,5321.1"
      //                    },
      //                    {
      //                        "title": "Box Office: ?Minions? Movie Dominates With $115.2 Million ...",
      //                        "displayUrl": "variety.com/2015/film/news/box-office-minions-dominates-with-115-2...",
      //                        "clickUrl": "http://variety.com/2015/film/news/box-office-minions-dominates-with-115-2-million-debut-1201538640/",
      //                        "summary": "?Minions? ruled the weekend box office, racking up a massive $115.2 million in North America, for the second biggest animated film opening in history.",
      //                        "pingUrlSuffix": "DevEx,5335.1"
      //                    },
      //                    {
      //                        "title": "Minions | Official Movie Website",
      //                        "displayUrl": "www.minionmovie.com.au",
      //                        "clickUrl": "http://www.minionmovie.com.au/",
      //                        "summary": "The official website for the movie Minions. In cinemas June 2015 #Minions",
      //                        "pingUrlSuffix": "DevEx,5348.1"
      //                    },
      //                    {
      //                        "title": "\u0027Minions\u0027 Movie Review | Rolling Stone",
      //                        "displayUrl": "www.rollingstone.com/movies/reviews/minions-20150710",
      //                        "clickUrl": "http://www.rollingstone.com/movies/reviews/minions-20150710",
      //                        "summary": "\u0027Minions\u0027 ? those adorable yellow mini-dudes from \u0027Despicable Me\u0027 ? get their own movie, and the result is a bust.",
      //                        "pingUrlSuffix": "DevEx,5361.1"
      //                    },
      //                    {
      //                        "title": "\u0027Minions\u0027 Movie Review: Does It Stand Up to \u0027Despicable Me ...",
      //                        "displayUrl": "abcnews.go.com/Entertainment/minions-movie-review-stand-despicable/...",
      //                        "clickUrl": "http://abcnews.go.com/Entertainment/minions-movie-review-stand-despicable/story?id\u003d32364224",
      //                        "summary": "In \"Minions,\" we learn the back story of the yellow, Tic Tac-looking, gibberish-speaking henchmen we first met in the \"Despicable Me\" movies. We even learn ...",
      //                        "pingUrlSuffix": "DevEx,5374.1"
      //                    },
      //                    {
      //                        "title": "Minions Movie - YouTube",
      //                        "displayUrl": "www.youtube.com/user/MovieMinions",
      //                        "clickUrl": "http://www.youtube.com/user/MovieMinions",
      //                        "summary": "Minion Short Movies and mini clips: - Puppy - Orientation Day - Minions Audition - Training Wheel - Panic in the mailroom And more...",
      //                        "pingUrlSuffix": "DevEx,5390.1"
      //                    },
      //                    {
      //                        "title": "Minions | Book tickets at Cineworld Cinemas",
      //                        "displayUrl": "www.cineworld.co.uk/films/minions",
      //                        "clickUrl": "http://www.cineworld.co.uk/films/minions",
      //                        "summary": "Watch Minions movie trailer and book Minions tickets online. Cookies notification. This website uses cookies to provide you with a better experience.",
      //                        "pingUrlSuffix": "DevEx,5401.1"
      //                    },
      //                    {
      //                        "title": "Minions - Movie Trailers - iTunes",
      //                        "displayUrl": "trailers.apple.com/trailers/universal/minions",
      //                        "clickUrl": "http://trailers.apple.com/trailers/universal/minions/",
      //                        "summary": "Ever since the dawn of time, the Minions have lived to serve the most despicable of masters. ... Despicable Me 2 Movie; Despicable Me: Minion Rush App;",
      //                        "pingUrlSuffix": "DevEx,5415.1"
      //                    },
      //                    {
      //                        "title": "Minions Movie - Home",
      //                        "displayUrl": "www.minionsmovie.net",
      //                        "clickUrl": "http://www.minionsmovie.net/",
      //                        "summary": "Website all about the Minions and the upcoming Minions Movie - To be released July 2015",
      //                        "pingUrlSuffix": "DevEx,5428.1"
      //                    }
      //                ],
      //                "webSearchUrl": "https://www.bing.com/search?q\u003dMinions+movie",
      //                "totalAvailableResults": 11900000,
      //                "webSearchPingUrlSuffix": ""
      //            }
      //        },
      //        {
      //            "content_type_enum": "WEB_NEWS",
      //            "elbowPoint": 3,
      //            "newsSearchResult": {
      //                "newsSearchResults": [
      //                    {
      //                        "title": "\u0027Minions\u0027 hits comedic sweet-spot that appeals to parents and kids",
      //                        "clickUrl": "http://www.stltoday.com/suburban-journals/illinois/life/matdekinder/minions-hits-comedic-sweet-spot-that-appeals-to-parents-and/article_41e18023-6317-5936-9cfb-8ed703bfaf41.html",
      //                        "description": "Everybody?s favorite part of the ?Despicable Me? movies are the Minions. Oh sure, Gru and the girls are the sweet, emotional center; but the yellow, goggled mischief makers give the movies an anarchic zing of inspiration. Therefore, the only logical ...",
      //                        "publishedTime": "2015-07-29 16:31:00.0",
      //                        "imageContentUrl": "https://www.bing.com/th?id\u003dON.A83A317D91A93515752D8CC5E6E9F38E\u0026pid\u003dNews",
      //                        "publishingOrganization": "St. Louis Post-Dispatch"
      //                    },
      //                    {
      //                        "title": "\u0027Minions\u0027 review: Cute movie that doesn\u0027t quite meet expectations",
      //                        "clickUrl": "http://www.examiner.com/review/minions-review-cute-movie-that-doesn-t-quite-meet-expectations",
      //                        "description": "In this prequel, we follow Stuart, Bob, and Kevin as they embark on a journey to try and find a leader to follow. They think they find the right one in Scarlet Overkill but quickly see that she is not the one for them. On the surface, you would think that ...",
      //                        "publishedTime": "2015-07-28 13:12:00.0",
      //                        "imageContentUrl": "https://www.bing.com/th?id\u003dON.7025CDC4FB77F9097AC7BBF923642EAF\u0026pid\u003dNews",
      //                        "publishingOrganization": "Examiner"
      //                    },
      //                    {
      //                        "title": "Movie review : Minions",
      //                        "clickUrl": "http://www.lusakatimes.com/2015/07/29/movie-review-minions/",
      //                        "description": "Starting as single-celled yellow organisms, Minions evolve through the ages, perpetually serving the most despicable of masters. Continuously unsuccessful at keeping these masters,the Minions find themselves without someone to serve and fall into a deep ...",
      //                        "publishedTime": "2015-07-29 16:40:00.0",
      //                        "imageContentUrl": "https://www.bing.com/th?id\u003dON.C708418427CEA67FF966D36AF226BFA8\u0026pid\u003dNews",
      //                        "publishingOrganization": "Lusaka Times"
      //                    },
      //                    {
      //                        "title": "Movie Addict Headquarters: Comic-Con and ?Minions?",
      //                        "clickUrl": "http://www.beliefnet.com/columnists/moviemom/2015/07/movie-addict-headquarters-comic-con-and-minions.html",
      //                        "description": "Many thanks to Betty Jo Tucker and her co-host A.J. Hakari for inviting me back to Movie Addict Headquarters to talk about Comic-Con and ?Minions.? Your browser does not support iframes. Check Out Movies Podcasts at Blog Talk Radio with Betty Jo Tucker ...",
      //                        "publishedTime": "2015-07-29 15:45:00.0",
      //                        "publishingOrganization": "Belief Net"
      //                    },
      //                    {
      //                        "title": "Why Are Minions So Popular?",
      //                        "clickUrl": "http://www.frontrowreviews.co.uk/news/why-are-minions-so-popular/34596",
      //                        "description": "Minions can have anyone in fits of giggles within seconds. It?s a dynamic combination of their giggles, sound effects and actions that have anyone in stitches whether they?ve seen the movies or not. This infectious giggling quickly spreads, just like ...",
      //                        "publishedTime": "2015-07-29 12:38:00.0",
      //                        "imageContentUrl": "https://www.bing.com/th?id\u003dON.E655168B170067F70ED6A70A3FA48283\u0026pid\u003dNews",
      //                        "publishingOrganization": "Front Row Reviews"
      //                    },
      //                    {
      //                        "title": "Movie Review: ?Minions? proves supporting characters are best left supporting",
      //                        "clickUrl": "http://www.suindependent.com/news/id_9321/Movie-Review:-%E2%80%98Minions%E2%80%99-proves-supporting-characters-are-best-left-supporting.html",
      //                        "description": "Sometimes, supporting characters are best left being supporting characters. That theory has never been more evident than it is in the well-intentioned \"Minions,\" an animated movie that, despite its energy and lively vocal work, has a difficult time ...",
      //                        "publishedTime": "2015-07-22 15:00:00.0",
      //                        "imageContentUrl": "https://www.bing.com/th?id\u003dON.218C38D8C83CC9C4CCED4134B55246F1\u0026pid\u003dNews",
      //                        "publishingOrganization": "The Independent"
      //                    },
      //                    {
      //                        "title": "Minions? find temporary home in Amsterdam",
      //                        "clickUrl": "http://www.dailygazette.com/news/2015/jul/28/7_27_minions/",
      //                        "description": "The little yellow creatures featured in the ?Despicable Me? and ?Minions? movies come in peace. They have simply found a new home on East Main Street thanks to Mayor Ann Thane and a few fanatics. Last Thursday, Thane and her own ?minions ...",
      //                        "publishedTime": "2015-07-29 04:30:00.0",
      //                        "publishingOrganization": "Daily Gazette"
      //                    }
      //                ],
      //                "totalAvailableResults": 0,
      //                "webSearchUrl": "http://www.bing.com/news/search?q\u003dMinions+movie"
      //            }
      //        },
      //        {
      //            "content_type_enum": "WEB_VIDEOS",
      //            "elbowPoint": 3,
      //            "videoSearchResult": {
      //                "videoSearchResults": [
      //                    {
      //                        "contentUrl": "https://www.youtube.com/watch?v\u003ddVDk7PXNXB8",
      //                        "thumbnailUrl": "https://tse4.mm.bing.net/th?id\u003dWN.Vu1OmzQJUMSeBnVRn3GhYA\u0026pid\u003dApi",
      //                        "title": "Minions Official Trailer #2 (2015) - Despicable Me Prequel HD",
      //                        "duration": "2:33",
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "https://www.youtube.com/watch?v\u003dWfql_DoHRKc",
      //                        "thumbnailUrl": "https://tse2.mm.bing.net/th?id\u003dWN.uPsYP3uAPVoC9dq1Qt0jFQ\u0026pid\u003dApi",
      //                        "title": "Minions - Official Trailer 3 (HD) - Illumination",
      //                        "duration": "3:29",
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "https://www.youtube.com/watch?v\u003deisKxhjBnZ0",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dWN.A9Q8RY1kJXatAcnKco5V%2bA\u0026pid\u003dApi",
      //                        "title": "Minions Official Trailer #1 (2015) - Despicable Me Prequel HD",
      //                        "duration": "2:48",
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "https://www.youtube.com/watch?v\u003dSvKmSNxFHyQ",
      //                        "thumbnailUrl": "https://tse3.mm.bing.net/th?id\u003dWN.YweMBq4xrharSEhzZ201Ng\u0026pid\u003dApi",
      //                        "title": "Minions Official Trailer #3 (2015) - Despicable Me Prequel HD",
      //                        "duration": "3:19",
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "https://www.youtube.com/watch?v\u003dniZTzIHvUig",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dWN.kD7zBiINtPAluH0UIRqzzw\u0026pid\u003dApi",
      //                        "title": "MINIONS Official Trailer (Despicable Me Spinoff - 2015)",
      //                        "duration": "2:52",
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "https://www.youtube.com/watch?v\u003dDp3es7YaITk",
      //                        "thumbnailUrl": "https://tse2.mm.bing.net/th?id\u003dWN.j%2fC0O36Su5tNjXkDYwd5Yg\u0026pid\u003dApi",
      //                        "title": "Minions 2015 Official Trailer + Trailer Review : Beyond ...",
      //                        "duration": "5:52",
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "https://www.youtube.com/watch?v\u003dqTSDL94_Y7M",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dWN.XUaPdx3T9sVAy2gjswYXLA\u0026pid\u003dApi",
      //                        "title": "Best Of The Minions - Despicable Me 1 and Despicable Me 2",
      //                        "duration": "8:27",
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "https://www.youtube.com/watch?v\u003djc86EFjLFV4",
      //                        "thumbnailUrl": "https://tse4.mm.bing.net/th?id\u003dWN.LfJkeVPpE%2fuIOhVa5DLhoA\u0026pid\u003dApi",
      //                        "title": "Minions - Official Trailer 2 (HD) - Illumination",
      //                        "duration": "2:43",
      //                        "pingUrlSuffix": ""
      //                    }
      //                ],
      //                "webSearchUrl": "https://www.bing.com/videos/search?q\u003dminions+movie",
      //                "webSearchPingUrlSuffix": "DevEx,5045.1"
      //            }
      //        },
      //        {
      //            "content_type_enum": "WEB_IMAGES",
      //            "elbowPoint": 3,
      //            "imageSearchResult": {
      //                "imageSearchResults": [
      //                    {
      //                        "contentUrl": "http://wallpapershdnow.com/download.php?f\u003dmovies/animation/minions-movie/minions-movie-wallpaper-2.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.rJKmxig%2fbobXgfBKfGwbJA\u0026pid\u003dApi",
      //                        "title": "Minions Movie wallpaper 2",
      //                        "dimensions": "1920x1080",
      //                        "imageSize": 563403,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://www.myboysandtheirtoys.com/wp-content/uploads/2015/05/minions-movie.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.2xXzeaLQWAkzVH7hx94bbg\u0026pid\u003dApi",
      //                        "title": "minions movie",
      //                        "dimensions": "650x1029",
      //                        "imageSize": 113498,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://www.jennsblahblahblog.com/wp-content/uploads/2015/07/minions-movie.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.%2bsqMnEtFYWzkGkEX0Ms0BA\u0026pid\u003dApi",
      //                        "title": "minions movie",
      //                        "dimensions": "1853x1343",
      //                        "imageSize": 738787,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://www.hdwallpapers.in/download/minions_2015_movie-1366x768.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.b6O4IBaqIoBdUqflJjpMVA\u0026pid\u003dApi",
      //                        "title": "Minions 2015 Movie",
      //                        "dimensions": "1366x768",
      //                        "imageSize": 149528,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://www.hdwallpapers.in/download/minions_2015_movie-1600x900.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.lOQ8%2f8Ghs6m5vX4A9QlV1w\u0026pid\u003dApi",
      //                        "title": "Minions 2015 Movie",
      //                        "dimensions": "1600x900",
      //                        "imageSize": 206947,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://img1.rnkr-static.com/list_img/861/2140861/full/minions-movie-quotes.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.YRJ18KsSMeNCml4Iay8ZbQ\u0026pid\u003dApi",
      //                        "title": "minions-movie-quotes.jpg",
      //                        "dimensions": "1024x1024",
      //                        "imageSize": 85080,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://attractionsmagazine.com/wp-content/uploads/2015/07/Minions-movie.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.yWSrOdgXsFQHt6Oi6qmg7w\u0026pid\u003dApi",
      //                        "title": "Minions movie",
      //                        "dimensions": "980x503",
      //                        "imageSize": 132293,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://www.thedigitalspy.com/wp-content/uploads/2014/11/watch-the-minions-movie-trailer.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.hb8QmUoTkyOh3EumqI494w\u0026pid\u003dApi",
      //                        "title": "watch-the-minions-movie-trailer.jpg",
      //                        "dimensions": "1286x720",
      //                        "imageSize": 107427,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://ep.yimg.com/ay/yhst-11683221621812/minions-movie-dracula-costume-2.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.lgOWp4jhKoNm5%2fB7Q7k%2f4g\u0026pid\u003dApi",
      //                        "title": "Home \u003e Kids Costumes \u003e Boys Costumes \u003e Minions Movie Dracula Costume",
      //                        "dimensions": "900x1200",
      //                        "imageSize": 213004,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://www.picnations.com/wp-content/uploads/2015/06/minions-movie-2015-wallpaper-bob-kevin-stuart-scarlet-overkill-sandra-bullock-despicable-me.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.6ku3W6pxZHOhN2rmqF9Ezg\u0026pid\u003dApi",
      //                        "title": "Minions Movie 2015 Wallpaper",
      //                        "dimensions": "1920x1200",
      //                        "imageSize": 238148,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://www.hdwallpapers.in/walls/minions_2015_movie-wide.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.jDOg1nMXmh6gGlgu0kIfUQ\u0026pid\u003dApi",
      //                        "title": "Minions 2015 Movie",
      //                        "dimensions": "2880x1800",
      //                        "imageSize": 817496,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://images.flickdirect.com/movies/minions/minions-poster.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.km2hTCprShEHCLVMMI9VAg\u0026pid\u003dApi",
      //                        "title": "minions-poster.jpg",
      //                        "dimensions": "947x1500",
      //                        "imageSize": 128465,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://minionsonline.net/img/main-bg-full-movie-minions.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.7Z1EzfGUMzYssj4vPJ4VSQ\u0026pid\u003dApi",
      //                        "title": "Minions movie 2015",
      //                        "dimensions": "1920x1080",
      //                        "imageSize": 121321,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "https://whatsontheredcarpet.files.wordpress.com/2015/02/minions-movie-poster.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.lC2ZcCyVtZBFtExI7tN%2bfg\u0026pid\u003dApi",
      //                        "title": "minions-movie-poster.jpg",
      //                        "dimensions": "695x1000",
      //                        "imageSize": 128586,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://www.hdwallpapers.in/walls/2015_minions_movie-wide.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.V9eEh%2b%2b3%2bLByVXVx1ICYkg\u0026pid\u003dApi",
      //                        "title": "2015 Minions Movie",
      //                        "dimensions": "2880x1800",
      //                        "imageSize": 1027141,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://www.picnations.com/wp-content/uploads/2015/05/minions-movie-2015-poster-wallpaper-bob-kevin-stuart-scarlet-overkill-sandra-bullock-despicable-me.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.Cpi17n9dPF%2fL08TQVBzjWA\u0026pid\u003dApi",
      //                        "title": "minions movie 2015 poster wallpaper bob kevin stuart scarlet overkill ...",
      //                        "dimensions": "1920x1200",
      //                        "imageSize": 424418,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://www.hdwallpapers.in/walls/minions_movie-wide.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.pdffG6ML8Y8ELRkBc0V52w\u0026pid\u003dApi",
      //                        "title": "Minions Movie",
      //                        "dimensions": "2880x1800",
      //                        "imageSize": 795003,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://cdnl.thehollywoodnews.com/wp-content/uploads/minions-movie-2.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.sPo3xb4pp2S0TLexl82Tcw\u0026pid\u003dApi",
      //                        "title": "Minions Movie",
      //                        "dimensions": "2048x1152",
      //                        "imageSize": 218247,
      //                        "pingUrlSuffix": ""
      //                    },
      //                    {
      //                        "contentUrl": "http://www.finewallpaperes.com/wp-content/uploads/2013/10/Minions-movie-of-2015.jpg",
      //                        "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dJN.A4Ic%2fVBZ6tANFLCsjCo1Rw\u0026pid\u003dApi",
      //                        "title": "Minions movie of 2015",
      //                        "dimensions": "1920x1080",
      //                        "imageSize": 274159,
      //                        "pingUrlSuffix": ""
      //                    }
      //                ],
      //                "totalAvailableResults": 0,
      //                "webSearchUrl": "https://www.bing.com/images/search?q\u003dminions+movie\u0026qpvt\u003dMinions+movie",
      //                "webSearchPingUrlSuffix": "DevEx,5024.1"
      //            }
      //        },
      //        {
      //            "content_type_enum": "RELATED_SEARCHES",
      //            "elbowPoint": 3,
      //            "relatedSearchesResult": {
      //                "relatedSearchResults": [
      //                    {
      //                        "text": "Watch Minions Movie Full Movie",
      //                        "displayStr": "Watch Minions Movie Full Movie"
      //                    },
      //                    {
      //                        "text": "The Full Minion Movie",
      //                        "displayStr": "The Full Minion Movie"
      //                    },
      //                    {
      //                        "text": "Despicable Me 2 Movie Full Movie",
      //                        "displayStr": "Despicable Me 2 Movie Full Movie"
      //                    },
      //                    {
      //                        "text": "Minion Movies in Theatre",
      //                        "displayStr": "Minion Movies in Theatre"
      //                    },
      //                    {
      //                        "text": "All Minion Movies",
      //                        "displayStr": "All Minion Movies"
      //                    },
      //                    {
      //                        "text": "Minions Movie Times",
      //                        "displayStr": "Minions Movie Times"
      //                    },
      //                    {
      //                        "text": "Minions Movie Release Date",
      //                        "displayStr": "Minions Movie Release Date"
      //                    },
      //                    {
      //                        "text": "Minions Movie 2015 Release Date",
      //                        "displayStr": "Minions Movie 2015 Release Date"
      //                    }
      //                ]
      //            }
      //        }
      //    ]
      //});


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
              console.log('businessHours unknown');
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
              else if (response.verticalResult[0].content_type_enum == "LIVE_API") {
                keyTitle = 'Flights';
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
                transformedData.genre = transformedData.genre.replace(/&amp;/g, '&');
              } catch (err) {
                console.log('cast not found/unknown');
              }
            } catch (err) {
              console.log('no movie results found');
            }
          }
          /*Extracting web search results*/
          for (var i = 0; i < response.verticalResult.length; i++) {
            if (response.verticalResult[i].content_type_enum === "WEB") {
              try {
                transformedData.webResults = response.verticalResult[i].webSearchResult.searchResults;
                transformedData.webResults.maxIndex = 4;
                transformedData.categories.push({key: 'details_web', keyTitle: 'Web'});
              } catch (err) {
                console.log('no web results found');
              }
            }
            else if (response.verticalResult[i].content_type_enum === "WEB_IMAGES") {
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
            if (data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length) {
              values = data[index].searchResultRelcy.results;
              keyTitle = 'Flights';
              template = 'FLIGHTS';
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
              maxIndex = 3;
              incrementBy = 3;
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
  })

