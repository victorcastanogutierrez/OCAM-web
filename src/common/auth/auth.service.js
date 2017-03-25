(function () {
"use strict";

angular.module('common')
.factory('Auth', AuthFactory);

AuthFactory.$inject =['$localStorage', '$state', '$rootScope', '$http'];
function AuthFactory($localStorage, $state, $rootScope, $http) {

  var Auth = {
    logUser: function(username, data) {
      $localStorage.currentUser = {
        username: username,
        email: data.email,
        token: data.token,
        refreshToken: data.refreshToken
      };
      $state.go('private.actList');
      $rootScope.$broadcast('user:logs', {logged: true});
    },
    logOutUser: function() {
      delete $localStorage.currentUser;
      $state.go('public.access');
      $rootScope.$broadcast('user:logs', {logged: false});
    },
    isUserLoggedIn: function() {
      return $localStorage.currentUser;
    },
    getHikerLoggedIn: function() {
      var logged = $localStorage.currentUser;
      return {
        login: logged.username
      };
    },
    /**
      Preconfigura el servicio $http para enviar el token
      en sucesivas peticiones sin tener que añadirlo manualmente
      en todas las cabeceras
    */
    configureHttpAuth: function() {
      if ($localStorage.currentUser) {
        $http.defaults.headers.common['Authorization'] =
          $localStorage.currentUser.token;
      }
    }
  }
  return Auth;
}


})();
