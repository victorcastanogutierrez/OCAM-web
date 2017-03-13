(function () {
"use strict";

angular.module('common')
.factory('hikerService', hikerFactory);

hikerFactory.$inject =['$http', '$base64', 'SERVER_URL',
  'LOGIN_API', 'REGISTER_API', 'Auth', 'HIKER_DATA'];
function hikerFactory($http, $base64, SERVER_URL,
    LOGIN_API, REGISTER_API, Auth, HIKER_DATA) {

  var Hiker = {
    logIn: function (username, password, successCallback, errorCallback) {
      $http({
        method: 'POST',
        url: SERVER_URL + LOGIN_API,
        headers: {
           'Content-Type': 'application/json',
           'username': $base64.encode(username),
           'password': $base64.encode(password)
         }
      }).then(function (response) {
        Auth.logUser(username, response.data);
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
    },
    getHikerData: function (username) {
      return $http.get(SERVER_URL + HIKER_DATA + '/' + username)
      .then(function (response) {
        return response.data;
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
