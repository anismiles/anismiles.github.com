
angular.module('relcyApp')
.controller("SearchController", function($scope, $http, $rootScope,  $location, $window, $timeout, SearchService, $filter, anchorSmoothScroll, Lightbox) {
	$scope.selectedTypeIndex = 0;
	$scope.selectedCategory;
	$scope.showDetailPage = false;
	$scope.selected = 0;
	$scope.showingResult = false;
	$scope.hideMainSearch = false;
	$scope.relatedSearches;
	$scope.defaultErrorImage = 'https://www.google.com/favicon.ico';
	$scope.showTopAnchor = false;
	/*The query in the search field of home page*/
	$scope.query;

	$scope.showResult = function(type,index){
		 $scope.selectedTypeIndex = type
		 $scope.resultByType = $scope.types[index]//.searchResultRelcy.results;
	}

	//TODO: Can we remove hardcoding of categories?
	/*Will check if the catagory have results or not*/
	$scope.hasResults = function(type,index){
		switch(type){
			case 'ENTERTAINMENT_VIDEO_MOVIE':
				return ($scope.types[index] && $scope.types[index].searchResultRelcy && $scope.types[index].searchResultRelcy.results && $scope.types[index].searchResultRelcy.results.length);
			break;
			case 'WEB_VIDEOS':
				return ($scope.types[index] && $scope.types[index].videoSearchResult && $scope.types[index].videoSearchResult.videoSearchResults && $scope.types[index].videoSearchResult.videoSearchResults.length);
			break;
			case 'WEB':
				return ($scope.types[index] && $scope.types[index].webSearchResult && $scope.types[index].webSearchResult.searchResults && $scope.types[index].webSearchResult.searchResults.length);
			break;
			case 'APP':
				return ($scope.types[index] && $scope.types[index].searchResultRelcy && $scope.types[index].searchResultRelcy.results && $scope.types[index].searchResultRelcy.results.length);
			break;
			case 'RELATED_SEARCHES':
				return ($scope.types[index] && $scope.types[index].relatedSearchesResult && $scope.types[index].relatedSearchesResult.relatedSearchResults && $scope.types[index].relatedSearchesResult.relatedSearchResults.length);
			break;
			default:
				return false;
			break;
		}
		 
	}
	
	/*Will be called to get an array out of score field*/
	function getScoreArray(score) {
		if(!score) return [];
	    return new Array(Math.floor(score));  
	}

	function showHalfRating(score){
		return (score%1)>0;
	}

	/*Will add ratings to auto search results*/
	$scope.addScores = function(results){
		if(!results) return;
		angular.forEach(results.auto_complete_response.auto_complete_item, function(a){
			a.scoreArray = getScoreArray(a.score);
			a.showHalfRating = showHalfRating(a.score);
		});
		return results.auto_complete_response;
	}

	/*Will add rating array to app resutls*/
	$scope.addScoresToAppResluts = function(results){
		if(!results) return;
		angular.forEach(results, function(a){
			a.scoreArray = getScoreArray(a.app_result[0].score);
			a.showHalfRating = showHalfRating(a.app_result[0].score);
		});
		return results;
	}

	/*Will add rating array to app resutls*/
	$scope.addScoresToVideoMovies = function(results){
		if(!results) return;
		angular.forEach(results, function(a){
			var score  = a.score/20;
			a.scoreArray = getScoreArray(score);
			a.showHalfRating = showHalfRating(score);
		});
		return results;
	}

	/*Will be invoked everytime search field will be changed on homepage*/
	$scope.onInputChange = function(q){
		$scope.query = q;
	}

	$scope.searchForSelection = function(selection){
		if(selection && selection.title){
			$scope.search(selection.title);
		}
	};

	/*Will be invoked on clicking related search item*/
	$scope.goForRelatedSearch = function(query){
		$scope.$broadcast('angucomplete-alt:clearInput', 'members');
		$timeout(function() {
			angular.element( document.querySelector( '#members' ) ).children().children()[0].value=query;
		}, 250);

		$scope.search(query);
	};
	 /*Start searching for the input query*/
	$scope.search = function(query)
	{
		/*Do nothing when no input in field*/
	 	if(!query) return;
		$scope.searchResults=undefined;
		$scope.relatedSearches = undefined;
		SearchService.getSearchDetails(query).then(function(data) 
		{	
			$scope.showDetailPage = false;
			$scope.showingResult = true;
			$scope.result = data['search_response']
			if(!$scope.result.verticalResult) {
				$scope.showingResult = false;
				return;
			}
			$scope.searchResults = SearchService.transformSearchResults($scope.result.verticalResult, $scope);
			$scope.selectedCategory = $scope.searchResults[0].key;
			$scope.types = $scope.result.verticalResult;
			setDefaultCategory();
			
		}, function(error)
		{
			$scope.showingResult = false;
			$scope.gridMessage = 'Error while loading data';
		});
	}
		
	$scope.reload = function(){
		window.location.reload();
	}
	/*Will clear the search field of auto complete with given id.*/
	$scope.clearSearchInput = function(id) {
		$scope.hideMainSearch = false;
		$scope.showDetailPage = false;
		$scope.$broadcast('angucomplete-alt:clearInput', 'members');
		/*Hides the search results*/
		$scope.showingResult = false;
		$scope.$broadcast('angucomplete-alt:clearInput', id);		
	}

	/*Will set the default selected category once results come*/
	function setDefaultCategory(){
		for(var i=0;i<$scope.types.length;i++){
			if($scope.hasResults($scope.types[i].content_type_enum,i)){
				$scope.showResult($scope.types[i].content_type_enum,i);	
				break;	
			}
		}
	}

	/*Will scroll to this id*/
	$scope.scrollTo = function(id) {
		$scope.selectedCategory = id;
		if(id=='container'){
			$scope.showTopAnchor = false;
			/*Set first element in categories as selected*/
			if($scope.searchResults.length>0){
				$scope.selectedCategory = $scope.searchResults[0].key;	
			}
		}else{
			try{
				if($scope.searchResults[0].key==id){
					$scope.showTopAnchor = false;
				}else{
					$scope.showTopAnchor = true;					
				}
			}catch(err){
				console.log('nothing there in first category!');
			}
		}
		
		$location.hash(id);
      	// $anchorScroll();
      	anchorSmoothScroll.scrollTo(id);
	}

	$scope.onAutoCompleteSelect = function(item){
		if(!item) return;
		if(item.originalObject.lookIds && item.originalObject.lookIds[0]){
			$scope.showDetails(item);
		}else{
			$scope.searchForSelection(item);
		}
	}

	/*Will increase the resuls and will take u to the last one.*/
	$scope.incrementAndScroll = function(cat){
		// var allItems = cat.values;
		cat.maxIndex=cat.maxIndex+cat.incrementBy;
		/*var item;
		var id;
		if(allItems[cat.maxIndex]){
			item = allItems[cat.maxIndex];
			id = cat.maxIndex;
		}else{
			id = cat.length-1;
			item = allItems[id];
		}
		id = cat.key;
		$timeout(function(){
			$scope.scrollTo(id);
		},1100);*/
	};

	/*Will take you to the next page to view the details*/
	$scope.showDetails = function (item) {
		$scope.showingResult = false;
		$scope.hideMainSearch = true;
		var relcyId;
		if(item.relcy_id && item.relcy_id.entity_id){
			relcyId = item.relcy_id.entity_id;
		} else if(item.originalObject.lookIds && item.originalObject.lookIds[0]){
			relcyId = item.originalObject.lookIds[0];
		}
		if(relcyId){
			$scope.showDetailPage = false;
			SearchService.getEntityDetails(relcyId).then(function(data) {
				$scope.showDetailPage = true;
				SearchService.selectedItem = item;
				$scope.itemDetails = SearchService.transformDetails(data);
				$scope.searchResults = $scope.itemDetails.categories;
				if($scope.searchResults.length>0){
					$scope.selectedCategory = $scope.searchResults[0].key;	
				}
				
			}, function(error){
				console.log('Error while fetching details!!!');
			});
		}else{
			console.log('Relcy id not found!');
			return;
		}	
	}

	 $scope.openCastLightbox = function (data,type,index) {
		//console.log("hello openCastLightbox")
	 	Lightbox.type = type;
	 	//data = 'http://www.youtube.com/embed/XGSy3_Czz8k?autoplay=1';
	 	Lightbox.data = data;

	 	if(type == 'VIDEO'){
	 		for(var i=0;i<data.length;i++){
	 			try{
		 			if(data[i].contentUrl.indexOf("youtube") > -1){
		 				var url = data[i].contentUrl.replace("watch?v=", "embed/");
		 				url=url+'?autoplay=1'
		 				Lightbox.data = {value: url, title: ''};
		 				break;
		 			}
		 		}catch(err){
		 			console.log('something went wrong!');
		 		}
	 		}
	 		if(!Lightbox.data.value){
	 			Lightbox.data = {value: data[0].contentUrl};
	 		}
	 	}

		if(type == 'IMAGES')
		{
			$scope.images = [];
			for(var i=0;i<data.length; i++)
			{
				$scope.images.push(
				{
				  'url': data[i].contentUrl,
				  'caption': data[i].title,
				  'thumbUrl': data[i].thumbnailUrl,// used only for this example
				  'dimensions': data[i].dimensions				   
				})
			}
			Lightbox.openModal( $scope.images, index);
		}else
		{
			Lightbox.openModal( [Lightbox.data], 0);
		}
	  };

	   /*Asking and fetching the current location*/
	   $window.navigator.geolocation.getCurrentPosition(function(position) {
            $scope.$apply(function() {
                SearchService.position = position;
                console.log(position);
            });
        }, function(error) {
        });

	   /*Will hide the auto complete on focus out*/
	   $rootScope.hideSearchDropdown = function(id){
	   		angular.element( document.querySelector( '#members' ) ).children()[0].classList.remove('angucomplete-dropdown-visible');   
	   }
});


