(function () {
"use strict";

angular.module('common')
.service('activityService', activityService);

activityService.$inject =['$http', 'SERVER_URL', 'PENDING_ACTIVITIES_API',
  'COUNT_PENDING_ACTIVITIES_API'];
function activityService($http, SERVER_URL, PENDING_ACTIVITIES_API,
  COUNT_PENDING_ACTIVITIES_API) {

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
}
})();
