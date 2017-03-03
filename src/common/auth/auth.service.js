(function () {
"use strict";

angular.module('common')
.factory('Auth', AuthFactory);

AuthFactory.$inject =['$http', '$base64', 'SERVER_URL', 'LOGIN_API'];
function AuthFactory($http, $base64, SERVER_URL, LOGIN_API) {
  
  var Auth = {
    logIn: function (username, password) {
      $http({
        method: 'POST',
        url: SERVER_URL + LOGIN_API,
        headers: {
           'username': $base64.encode(username),
           'password': $base64.encode(password)
         }
      }).then(function successCallback(response) {
        console.log(response);
      }, function errorCallback(response) {
        console.log(response);
      });
    }
  }

  return Auth;
}

})();
