(function () {
"use strict";

angular.module('common')
.run(routingConfiguration)
.constant('LOGIN_STATE', 'public.access');

/**
  Comprueba los permisos de acceso a una página estando logueado o no
  un usuario
*/
routingConfiguration.$inject = ['$rootScope', '$state', 'LOGIN_STATE', 'Auth']
function routingConfiguration($rootScope, $state, LOGIN_STATE, Auth) {

    $rootScope.$on("$stateChangeStart", function (e, toState, toParams, fromState, fromParams, error) {
        var authState = isAuthState(toState);
        // Si no está logueado y es un estado de zona privada no lo permitimos
        if (authState && !Auth.isUserLoggedIn()) {
          $state.go(LOGIN_STATE);
        }

        // Si está logueado y accede a una página de zona pública lo deslogueamos
        else if (!authState && Auth.isUserLoggedIn()) {
          Auth.logOutUser();
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

})();
