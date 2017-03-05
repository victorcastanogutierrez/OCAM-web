(function () {
"use strict";

angular.module('common')
.factory('hikerService', hikerFactory);

hikerFactory.$inject =['$http', '$base64', 'SERVER_URL',
  'LOGIN_API', 'REGISTER_API', 'Auth'];
function hikerFactory($http, $base64, SERVER_URL,
    LOGIN_API, REGISTER_API, Auth) {

  var Hiker = {
    logIn: function (username, password, successCallback, errorCallback) {
      $http({
        method: 'POST',
        url: SERVER_URL + LOGIN_API,
        headers: {
           'username': $base64.encode(username),
           'password': $base64.encode(password)
         }
      }).then(function (response) {
        Auth.saveUserData(username, response.data);
        configHttpHeaders(response.data);
        successCallback(response);
      }, function (response) {
        errorCallback(response);
      });
    },
    register: function(newUser, successCallback, errorCallback) {
      $http({
        method: 'POST',
        url: SERVER_URL + REGISTER_API,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(newUser)
      }).then(function (response) {
        successCallback(response.data);
      }, function(err) {
        errorCallback(err.data);
      });
    }
  }

  /**
    Preconfigura el servicio $http para enviar el token
    en sucesivas peticiones sin tener que añadirlo manualmente
    en todas las cabeceras
  */
  var configHttpHeaders = function (data) {
    $http.defaults.headers.common.Authorization = data.token;
  }

  return Hiker;
}



})();
