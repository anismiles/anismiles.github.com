
angular.module('relcyApp')
.controller("SearchController", function($scope, $http, $rootScope,  $location, SearchService, $filter, anchorSmoothScroll, Lightbox) {
	$scope.selectedTypeIndex = 0;
	$scope.selectedCategory;
	$scope.showDetailPage = false;
	$scope.selected = 0;
	$scope.showingResult = false;
	$scope.hideMainSearch = false;
	$scope.relatedSearches;
	$scope.defaultErrorImage = 'https://www.google.com/favicon.ico';
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

	$scope.addScores = function(results){
		if(!results) return;
		angular.forEach(results.auto_complete_response.auto_complete_item, function(a){
			a.scoreArray = getScoreArray(a.score);
			a.showHalfRating = showHalfRating(a.score);
		});
		return results.auto_complete_response;
	}

	/*Will be invoked everytime search field will be changed on homepage*/
	$scope.onInputChange = function(q){
		$scope.query = q;
	}

	$scope.searchForSelection = function(selection){
		if(selection && selection.title){
			$scope.search(selection.title);
		}
	}

	 /*Start searching for the input query*/
	$scope.search = function(query)
	{
		/*Do nothing when no input in field*/
	 	if(!query) return;
		console.log(query)
		SearchService.getSearchDetails(query).then(function(data) 
		{	
			$scope.showDetailPage = false;
			$scope.showingResult = true;
			$scope.result = data['search_response']
			if(!$scope.result.verticalResult) {
				$scope.showingResult = false;
				return;
			}
			$scope.searchResults = transformSearchResults($scope.result.verticalResult, $scope);
			$scope.selectedCategory = $scope.searchResults[0].key;
			$scope.types = $scope.result.verticalResult;
			setDefaultCategory();
			
		}, function(error)
		{
			$scope.showingResult = false;
			$scope.gridMessage = 'Error while loading data';
		});
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

	$scope.scrollTo = function(id) {
		$scope.selectedCategory = id;
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
				$scope.selectedCategory = $scope.searchResults[0].key;
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
	 	//cast = 'Ashish, Devendra';
	 	Lightbox.type = type;
	 	Lightbox.data = data;
		if(type == 'IMAGES')
		{
			$scope.images = [];
			for(var i=0;i<data.length; i++)
			{
				$scope.images.push(
				{
				  'url': data[i].contentUrl,
				  'caption': data[i].title,
				  'thumbUrl': data[i].thumbnailUrl // used only for this example
				})
			}
			Lightbox.openModal( $scope.images, index);
		}
		else
		{
			Lightbox.openModal( [data], 0);
		}
	  };

	$scope.images = [
    {
      'url': 'images/logo.png',
      'caption': 'Optional caption',
      'thumbUrl': 'images/logo.png' // used only for this example
    },
    {
      'url': '2.gif',
      'thumbUrl': 'thumb2.jpg'
    },
    {
      'url': '3.png',
      'thumbUrl': 'thumb3.png'
    }
  ];
  
});

/*Will transform the search results so as to be used on UI*/
function transformSearchResults(data, $scope){
	var transformedData = [];
	for(var index=0;index<data.length;index++){
		var key = data[index].content_type_enum;
		var values;
		var keyTitle;
		switch(key){
			case 'ENTERTAINMENT_VIDEO_MOVIE':
				if(data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length){
					values = data[index].searchResultRelcy.results;
					keyTitle = 'Movies';
				}
			break;
			case 'ENTERTAINMENT_VIDEO_TVSHOW':
				if(data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length){
					values = data[index].searchResultRelcy.results;
					keyTitle = 'TV Shows';
				}
			break;
			case 'WEB_VIDEOS':
				if(data[index] && data[index].videoSearchResult && data[index].videoSearchResult.videoSearchResults && data[index].videoSearchResult.videoSearchResults.length){
					values = data[index].videoSearchResult.videoSearchResults;
					keyTitle = 'Videos';
				}
			break;
			case 'WEB_IMAGES':
				if(data[index] && data[index].imageSearchResult && data[index].imageSearchResult.imageSearchResults && data[index].imageSearchResult.imageSearchResults.length){
					values = data[index].imageSearchResult.imageSearchResults;
					keyTitle = 'Images';
				}
			break;
			case 'WEB':
				if(data[index] && data[index].webSearchResult && data[index].webSearchResult.searchResults && data[index].webSearchResult.searchResults.length){
					values = data[index].webSearchResult.searchResults;
					keyTitle = 'WEB';
				}
			break;
			case 'WEB_NEWS':
				if(data[index] && data[index].newsSearchResult && data[index].newsSearchResult.newsSearchResults && data[index].newsSearchResult.newsSearchResults.length){
					values = data[index].newsSearchResult.newsSearchResults;
					keyTitle = 'News';
				}
			break;
			case 'APP':
				if(data[index] && data[index].searchResultRelcy && data[index].searchResultRelcy.results && data[index].searchResultRelcy.results.length){
					values = data[index].searchResultRelcy.results;
					keyTitle = 'APP';
				}
			break;
			case 'RELATED_SEARCHES':
				if(data[index] && data[index].relatedSearchesResult && data[index].relatedSearchesResult.relatedSearchResults && data[index].relatedSearchesResult.relatedSearchResults.length){
					$scope.relatedSearches = data[index].relatedSearchesResult.relatedSearchResults;
				}
				values=undefined;
			break;
		}
		if(values){
			transformedData.push({key: key, values: values,keyTitle: keyTitle,  maxIndex: 2, incrementBy: 2});
		}
	}
	return transformedData;
}
