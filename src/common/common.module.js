(function() {
"use strict";

angular.module('common', ['base64', 'ngStorage'])
.constant('SERVER_URL', 'https://ocam-server.herokuapp.com')
//.constant('SERVER_URL', 'http://localhost:8443')
.constant('LOGIN_API', '/api/auth/login')
.constant('REGISTER_API', '/hiker')
.constant('PENDING_ACTIVITIES_API', '/pendingActivities')
.constant('COUNT_PENDING_ACTIVITIES_API', '/countPendingActivities')
.constant('HIKER_DATA', '/api/hiker')
.config(CommonConfig);

CommonConfig.$inject = ['$httpProvider']
function CommonConfig($httpProvider) {
  $httpProvider.interceptors.push('loadingHttpInterceptor');
}

})();
