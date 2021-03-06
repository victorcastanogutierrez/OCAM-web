(function () {
"use strict";

angular.module('common')
.service('activityService', activityService);

activityService.$inject =['Auth', '$http', 'SERVER_URL', 'PENDING_ACTIVITIES_API',
  'COUNT_PENDING_ACTIVITIES_API', 'SAVE_ACT_API', 'CHECK_ACTIVITY_PASSWORD_API',
  'ACTIVITY_FIND_BY_ID', 'ACTIVITY_LAST_REPORTS', 'HIKER_ALL_REPORTS',
  'FIND_HIKER_ACTIVITIES_DONE', 'ACTIVITY_HIKER_LAST_REPORT'];
function activityService(Auth, $http, SERVER_URL, PENDING_ACTIVITIES_API,
  COUNT_PENDING_ACTIVITIES_API, SAVE_ACT_API, CHECK_ACTIVITY_PASSWORD_API,
  ACTIVITY_FIND_BY_ID, ACTIVITY_LAST_REPORTS, HIKER_ALL_REPORTS,
  FIND_HIKER_ACTIVITIES_DONE, ACTIVITY_HIKER_LAST_REPORT) {

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

  service.findAllActivityReportsByHiker = function(activityId, hikerEmail) {
    return $http.get(SERVER_URL + HIKER_ALL_REPORTS + '/' + activityId + '/' + hikerEmail)
      .then(function (response) {
        return response.data;
      });
  };

  service.findAllDoneByHiker = function (hikerLogin) {
    return $http.get(SERVER_URL + FIND_HIKER_ACTIVITIES_DONE + '/' + hikerLogin)
      .then(function (response) {
        return response.data;
      });
  };

  service.findLastHikerReports = function(activityId, hikerLogin) {
    return $http.get(SERVER_URL + ACTIVITY_HIKER_LAST_REPORT + '/' + activityId + '/' + hikerLogin)
      .then(function (response) {
        return response.data;
      });
  };

}
})();
