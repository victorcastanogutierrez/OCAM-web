(function() {
"use strict";

angular.module('common')
.factory('errorHandlerInterceptor', errorHandlerInterceptor);

/**
  Captura errores del servidor, ya sean 500 por errores internos o bien
  caducidades de la sesión (token)
*/
errorHandlerInterceptor.$inject = ['$q', '$rootScope'];
function errorHandlerInterceptor($q, $rootScope) {

  return {
    responseError: function (response) {
      if (response) {
        $rootScope.$emit("errorHandler", {code : response.status});
      }
      return $q.reject(response);
    }
  };
}

})();
