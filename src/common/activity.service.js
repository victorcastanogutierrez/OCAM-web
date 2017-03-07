(function () {
"use strict";

angular.module('common')
.factory('activityService', activityFactory);

activityFactory.$inject =['$http', 'SERVER_URL', 'PENDING_ACTIVITIES_API'];
function activityFactory($http, SERVER_URL, PENDING_ACTIVITIES_API) {

  var Activity = {
    findAllPending: function (successCallback, errorCallback) {
      $http({
        method: 'GET',
        url: SERVER_URL + PENDING_ACTIVITIES_API
      }).then(function (response) {
        return response.data;
      });
    }
  }
  return Activity;
}
})();
