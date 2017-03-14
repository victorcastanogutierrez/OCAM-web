(function() {
"use strict";

/**
Application main module
*/
angular.module('ocam', ['public', 'common', 'private', 'ngMaterial', 'md.data.table'])
.config(config)
.run(authConfig);

config.$inject = ['$urlRouterProvider', '$mdThemingProvider', '$mdAriaProvider'];
function config($urlRouterProvider, $mdThemingProvider, $mdAriaProvider) {

  // Si va a una ruta no conocida le mandamos a /actividades
  // que es la lista de actividades de la zona privada.
  // En caso de no estar logueado la aplicación le redirigirá a la Lista
  // pública
  $urlRouterProvider.otherwise('/activities');

  // Theme de la aplicación
  $mdThemingProvider.theme('default')
    .primaryPalette('green')
    .accentPalette('brown');

  //Disable some kind of warnings
  $mdAriaProvider.disableWarnings();
}

authConfig.$inject = ['Auth']
function authConfig(Auth) {
  // Comprueba si el usuario aún tiene un token válido, en cuyo caso
  // configuramos las peticiones http
  Auth.configureHttpAuth();
}

})();
