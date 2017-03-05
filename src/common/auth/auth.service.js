(function () {
"use strict";

angular.module('common')
.factory('Auth', AuthFactory);

AuthFactory.$inject =['$localStorage'];
function AuthFactory($localStorage) {

  var Auth = {
    saveUserData: function(username, data) {
      $localStorage.currentUser = {
        username: username,
        token: data.token,
        refreshToken: data.refreshToken
      };
    },
    logOutUser: function() {
      delete $localStorage.currentUser;
    }
  }
  return Auth;
}


})();
