(function() {
"use strict";

angular.module('common', ['base64', 'ngStorage'])
.constant('SERVER_URL', 'https://localhost:8443')
.constant('LOGIN_API', '/api/auth/login')
.constant('REGISTER_API', '/hiker')
.config(CommonConfig);

CommonConfig.$inject = ['$httpProvider']
function CommonConfig($httpProvider) {
  $httpProvider.interceptors.push('loadingHttpInterceptor');
}

})();
