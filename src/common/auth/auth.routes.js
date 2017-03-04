(function () {
"use strict";

angular.module('common')
.run(routingConfiguration)
.constant('LOGIN_STATE', 'public.access');

/**
  Comprueba los permisos de acceso a una página estando logueado o no
  un usuario
*/
routingConfiguration.$inject = ['$rootScope', '$state', 'LOGIN_STATE', '$localStorage']
function routingConfiguration($rootScope, $state, LOGIN_STATE, $localStorage) {

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var authState = isAuthState(next);
        if (authState && !userLoggedIn($localStorage)) {
          $state.go(LOGIN_STATE);
        }
    });
}

/**
  Si en el objeto data authorization es true, o bien, por seguridad,
  si no contiene objeto authorization o data
*/
function isAuthState (state) {
  if (!state.data) {
    return true;
  }
  return state.data.authorization === "undefined" || state.data.authorization;
}

/**
  Comprueba si el usuario está logueado o no
*/
function userLoggedIn(storage) {
  return storage.currenUser;
}


})();
