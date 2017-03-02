(function () {
"use strict";

angular.module('common')
.factory('Auth', AuthFactory);

AuthFactory.$inject =['$http', '$base64', 'SERVER_URL', 'LOGIN_API'];
function AuthFactory($http, $base64, SERVER_URL, LOGIN_API) {

  var Auth = {
    logIn: function (username, password) {
      var uname = $base64.encode(username);
      var pwd = $base64.encode(password);
      console.log(uname + ", " +pwd);
      $http({
        method: 'POST',
        url: SERVER_URL + LOGIN_API,
        headers: {
           /*'username': $base64.encode(username),
           'password': $base64.encode(password)*/
           'username': uname,
           'password': pwd
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
