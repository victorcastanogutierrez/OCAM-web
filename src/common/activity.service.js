(function () {
"use strict";

angular.module('common')
.service('activityService', activityService);

activityService.$inject =['Auth', '$http', 'SERVER_URL', 'PENDING_ACTIVITIES_API',
  'COUNT_PENDING_ACTIVITIES_API', 'SAVE_ACT_API'];
function activityService(Auth, $http, SERVER_URL, PENDING_ACTIVITIES_API,
  COUNT_PENDING_ACTIVITIES_API, SAVE_ACT_API) {

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
  }

  service.findCountAll = function () {
    return $http.get(SERVER_URL + COUNT_PENDING_ACTIVITIES_API)
      .then(function (response) {
        return response.data;
      });
  }

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
  }
}
})();
