/*For showing a default image in case of failure*/
angular.module('relcyApp')
.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
      
      attrs.$observe('ngSrc', function(value) {
        if (!value && attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
}).directive('popoverClose', function($timeout){
  return{
    scope: {
      excludeClass: '@'
    },
    link: function(scope, element, attrs) {
      var trigger = document.getElementsByClassName('trigger');
      element.on('click', function(event){
        var etarget = angular.element(event.target);
        if(!etarget.hasClass('trigger') && !etarget.hasClass(scope.excludeClass)) {
          $timeout(function(){
            angular.element(trigger[0]).triggerHandler('click') 
            var t = angular.element(trigger[0])
            t.removeClass("trigger")
            /*for(var i=0;i<trigger.length;i++)
            {
              angular.element(trigger[i]).triggerHandler('click')
            }*/
          });
        }
      });
    }
  };
}).directive('popoverElem', function(){
  return{
    link: function(scope, element, attrs) {
      //var trigger = document.getElementsByClassName('trigger');
      element.on('click', function(){
        var t = angular.element(".trigger")
        for(var k=0;k < t.length; k++)
        {
          var c = t[k]
          c.click()  
          angular.element(c).removeClass("trigger")
        }

        element.addClass('trigger');
      });
    }
  };
}).directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});