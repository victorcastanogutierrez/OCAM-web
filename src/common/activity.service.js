(function () {
"use strict";

angular.module('common')
.service('activityService', activityService);

activityService.$inject =['Auth', '$http', 'SERVER_URL', 'PENDING_ACTIVITIES_API',
  'COUNT_PENDING_ACTIVITIES_API', 'SAVE_ACT_API', 'CHECK_ACTIVITY_PASSWORD_API',
  'ACTIVITY_FIND_BY_ID', 'ACTIVITY_LAST_REPORTS'];
function activityService(Auth, $http, SERVER_URL, PENDING_ACTIVITIES_API,
  COUNT_PENDING_ACTIVITIES_API, SAVE_ACT_API, CHECK_ACTIVITY_PASSWORD_API,
  ACTIVITY_FIND_BY_ID, ACTIVITY_LAST_REPORTS) {

  var service = this;

  service.findAllPending = function (min, max, success) {
    if (!success) {
      return $http.get(SERVER_URL + PENDING_ACTIVITIES_API + '/' + min + '/' + max)
        .then(function (response) {
          return response.data;
        });
    } else {
        $http.get(SERVER_URL + PENDING_ACTIVITIES_API + '/' + min + '/' + max)
        .then(function (response) {
          success(response.data);
        });
    }
  };

  service.findCountAll = function () {
    return $http.get(SERVER_URL + COUNT_PENDING_ACTIVITIES_API)
      .then(function (response) {
        return response.data;
      });
  };

  service.save = function(activity, successCallback, errorCallback) {
    var newActivity = {
      activity: activity,
      hiker: Auth.getHikerLoggedIn()
    };
    $http({
      method: 'POST',
      url: SERVER_URL + SAVE_ACT_API,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(newActivity)
    }).then(function (response) {
      successCallback(response.data);
    }, function(err) {
      errorCallback(err.data);
    });
  };

  service.checkPassword = function(activityId, password) {
    return $http.get(SERVER_URL + CHECK_ACTIVITY_PASSWORD_API + '/' + activityId +
      '/' + password)
      .then(function (response) {
        return response.data;
      });
  };

  service.findById = function(activityId) {
    return $http.get(SERVER_URL + ACTIVITY_FIND_BY_ID + '/' + activityId)
      .then(function (response) {
        return response.data;
      });
  };

  service.finLastActivityReports = function(activityId) {
    return $http.get(SERVER_URL + ACTIVITY_LAST_REPORTS + '/' + activityId)
      .then(function (response) {
        return response.data;
      });
  };

}
})();
