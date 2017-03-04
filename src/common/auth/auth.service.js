(function () {
"use strict";

angular.module('common')
.factory('Auth', AuthFactory);

AuthFactory.$inject =['$http', '$base64', 'SERVER_URL',
  'LOGIN_API', '$localStorage', 'REGISTER_API', 'HIKER_EXISTS_API'];
function AuthFactory($http, $base64, SERVER_URL,
    LOGIN_API, $localStorage, REGISTER_API, HIKER_EXISTS_API) {

  var Auth = {
    logIn: function (username, password, successCallback, errorCallback) {
      $http({
        method: 'POST',
        url: SERVER_URL + LOGIN_API,
        headers: {
           'username': $base64.encode(username),
           'password': $base64.encode(password)
         }
      }).then(function (response) {
        saveUserData(username, response.data, $localStorage);
        configHttpHeaders(response.data, $http);
        successCallback(response);
      }, function (response) {
        errorCallback(response);
      });
    },
    logOut: function () {
      //TODO
    },
    register: function(newUser, successCallback, errorCallback) {
      $http({
        method: 'POST',
        url: SERVER_URL + REGISTER_API,
        headers: {
          'Content-Type': 'application/json'
        },
        data: angular.toJson(newUser)
      }).then(function (response) {
        successCallback(response);
      }, function (response) {
        errorCallback(response);
      });
    },
    existsHiker: function(username, successCallback) {
      $http({
        method: 'GET',
        url: SERVER_URL + HIKER_EXISTS_API + '/' + username
      }).then(function (response) {
        successCallback(response.data);
      });
    }
  }

  return Auth;
}

/**
  Guarda en ngStorage los datos del usuario logueado
*/
function saveUserData(username, data, localStorage) {
  localStorage.currentUser = {
    username: username,
    token: data.token,
    refreshToken: data.refreshToken
  };
}

/**
  Preconfigura el servicio $http para enviar el token
  en sucesivas peticiones sin tener que añadirlo manualmente
  en todas las cabeceras
*/
function configHttpHeaders(data, http) {
  http.defaults.headers.common.Authorization = data.token;
}

})();
