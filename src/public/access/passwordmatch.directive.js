(function () {

'use strict';
angular.module('public')
.directive('passwordVerify', function () {
  return {
    require: "ngModel",
    scope: {
      passwordVerify: '='
    },
    link: function(scope, element, attrs, ctrl) {
      scope.$watch(function() {
          var combined;

          if (scope.passwordVerify || ctrl.$viewValue) {
             combined = scope.passwordVerify + '_' + ctrl.$viewValue;
          }
          return combined;
      }, function(value) {
          if (value) {
              ctrl.$parsers.unshift(function(viewValue) {
                  var origin = scope.passwordVerify;
                  console.log(origin+", "+viewValue);
                  if (origin !== viewValue) {
                      ctrl.$setValidity("passwordVerify", false);
                      return undefined;
                  } else {
                    console.log("true");
                      ctrl.$setValidity("passwordVerify", true);
                      return viewValue;
                  }
              });
          }
      });
   }
 };

});

})();
