(function () {
"use strict";

angular.module('common')
.factory('hikerService', hikerFactory);

hikerFactory.$inject =['$http', '$base64', 'SERVER_URL',
  'LOGIN_API', 'REGISTER_API', 'Auth', 'HIKER_DATA', 'HIKER_CHANGE_PASSWORD',
  'EXISTS_LOGIN_API', 'HIKER_VALIDATE', 'DELETE_HIKER'];
function hikerFactory($http, $base64, SERVER_URL,
    LOGIN_API, REGISTER_API, Auth, HIKER_DATA, HIKER_CHANGE_PASSWORD,
    EXISTS_LOGIN_API, HIKER_VALIDATE, DELETE_HIKER) {

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
        Auth.configureHttpAuth();
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
    },
    changePassword: function (dto, success, error) {
      $http({
        method: 'POST',
        url: SERVER_URL + HIKER_CHANGE_PASSWORD,
        data: JSON.stringify(dto)
      }).then(function (response) {
        success(response.data);
      }, function(err) {
        error(err.data);
      });
    },
    findByLogin: function (email) {
      return $http.get(SERVER_URL + EXISTS_LOGIN_API + '/' + email)
      .then(function (response) {
        return response.data;
      });
    },

    validateHiker: function (obj, success, error) {
      $http({
        method: 'POST',
        url: SERVER_URL + HIKER_VALIDATE,
        data: JSON.stringify(obj)
      }).then(function (response) {
        success(response.data);
      }, function(err) {
        error(err.data);
      });
    },

    deleteHiker: function (login, success) {
      $http({
        method: 'POST',
        url: SERVER_URL + DELETE_HIKER + '/' + login
      }).then(function (response) {
        success(response.data);
      });
    },
  }

  return Hiker;
}



})();
