'use strict';

angular.module('relcyApp')
    .service("Session", ['$timeout', '$q', '$http', Session]);

/*Session to keep - session specific things*/
function Session($timeout, $q, $http) {
	var self  = this;
	/*The default location if the user doesnot allow his/her location access*/
    this.defaultLoc = {lat: "37.387424", lng: "-122.066635"};
	this.position;
}
