(function() {
"use strict";

angular.module('common', ['base64', 'ngStorage'])
//.constant('SERVER_URL', 'https://ocam-server.herokuapp.com')
.constant('SERVER_URL', 'https://localhost:8443')
.constant('LOGIN_API', '/api/auth/login')
.constant('REGISTER_API', '/hiker')
.constant('PENDING_ACTIVITIES_API', '/pendingActivities')
.config(CommonConfig);

CommonConfig.$inject = ['$httpProvider']
function CommonConfig($httpProvider) {
  $httpProvider.interceptors.push('loadingHttpInterceptor');
}

})();
