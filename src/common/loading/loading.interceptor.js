(function() {
"use strict";

angular.module('common')
.factory('loadingHttpInterceptor', LoadingHttpInterceptor);

/**
  Lanza un evento cada vez que una petición http empieza
  y acaba.
  Comprueba además si a alguna petición le llega estado -1
  comprobando así si el servidor no es capaz de responder
  y redireccionar por tanto al usuario a la página de login.
*/
LoadingHttpInterceptor.$inject = ['$rootScope', '$q', 'LOGIN_STATE'];
function LoadingHttpInterceptor($rootScope, $q, LOGIN_STATE) {

  var loadingCount = 0;
  var loadingEventName = 'spinner:activate';

  return {
    request: function (config) {
      if (++loadingCount === 1) {
        $rootScope.$broadcast(loadingEventName, {on: true});
      }

      return config;
    },

    response: function (response) {
      if (--loadingCount === 0) {
        $rootScope.$broadcast(loadingEventName, {on: false});
      }

      return response;
    },

    responseError: function (response) {
      if (--loadingCount === 0) {
        $rootScope.$broadcast(loadingEventName, {on: false});
      }

      //Servidor caído
      if (response.status == -1) {
        //TODO Redireccionar a pagina 404
      }
      return $q.reject(response);
    }
  };
}

})();
