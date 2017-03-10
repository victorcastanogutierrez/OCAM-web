(function() {
"use strict";

/**
Application main module
*/
angular.module('ocam', ['public', 'common', 'private', 'ngMaterial', 'md.data.table'])
.config(config);

config.$inject = ['$urlRouterProvider', '$mdThemingProvider'];
function config($urlRouterProvider, $mdThemingProvider) {

  // Si va a una ruta no conocida le mandamos a /
  $urlRouterProvider.otherwise('/');

  // Theme de la aplicación
  $mdThemingProvider.theme('default')
    .primaryPalette('green')
    .accentPalette('brown');
}

})();
