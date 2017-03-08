(function () {
"use strict";

angular.module('common')
.service('activityService', activityService);

activityService.$inject =['$http', 'SERVER_URL', 'PENDING_ACTIVITIES_API'];
function activityService($http, SERVER_URL, PENDING_ACTIVITIES_API) {

  var service = this;

  service.findAllPending = function () {
    return $http.get(SERVER_URL + PENDING_ACTIVITIES_API)
      .then(function (response) {
        return response.data;
      });
  }
}
})();
