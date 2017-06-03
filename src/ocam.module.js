(function() {
"use strict";

/**
Application main module
*/
angular.module('ocam', ['public', 'common', 'private', 'ngMaterial',
  'md.data.table', 'uiGmapgoogle-maps', 'pascalprecht.translate'])
.config(config)
.run(authConfig);

config.$inject = ['$urlRouterProvider', '$mdThemingProvider', '$mdAriaProvider',
  'uiGmapGoogleMapApiProvider', '$locationProvider', '$translateProvider',
  '$translatePartialLoaderProvider', '$mdDateLocaleProvider'];
function config($urlRouterProvider, $mdThemingProvider, $mdAriaProvider,
  uiGmapGoogleMapApiProvider, $locationProvider, $translateProvider,
  $translatePartialLoaderProvider, $mdDateLocaleProvider) {

  // Si va a una ruta no conocida le mandamos a /actividades
  // que es la lista de actividades de la zona privada.
  // En caso de no estar logueado la aplicación le redirigirá a la Lista
  // pública
  $urlRouterProvider.otherwise('/activities');
  //$locationProvider.html5Mode(true);

  // Theme de la aplicación
  $mdThemingProvider.theme('default')
    .primaryPalette('green')
    .accentPalette('brown');

  //Disable some kind of warnings
  $mdAriaProvider.disableWarnings();

  //Google map API key
  uiGmapGoogleMapApiProvider.configure({
      libraries: 'weather,geometry,visualization'
  });

  //i18n
  $translateProvider.useLoader('$translatePartialLoader', {
    urlTemplate: 'i18n/{lang}/{part}.json'
  });
  $translateProvider.preferredLanguage('es-ES');
  $translateProvider.useSanitizeValueStrategy('escape');

  //Locale config
  $mdDateLocaleProvider.firstDayOfWeek = 1;

  $mdDateLocaleProvider.formatDate = function(date) {
     return moment(date).format('DD-MM-YYYY ');
  };
}

authConfig.$inject = ['Auth']
function authConfig(Auth) {
  // Comprueba si el usuario aún tiene un token válido, en cuyo caso
  // configuramos las peticiones http
  Auth.configureHttpAuth();
}

})();
