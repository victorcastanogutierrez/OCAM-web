(function () {
"use strict";

angular.module('common')
.factory('Auth', AuthFactory);

AuthFactory.$inject =['$localStorage', '$state', '$rootScope'];
function AuthFactory($localStorage, $state, $rootScope) {

  var Auth = {
    logUser: function(username, data) {
      $localStorage.currentUser = {
        username: username,
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
    }
  }
  return Auth;
}


})();
