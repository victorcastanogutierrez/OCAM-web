(function() {
"use strict";

angular.module('common', ['base64', 'ngStorage'])
.constant('SERVER_URL', 'https://ocam-server.herokuapp.com')
.constant('LOGIN_API', '/api/auth/login')
.constant('REGISTER_API', '/hiker')
.config(CommonConfig);

CommonConfig.$inject = ['$httpProvider']
function CommonConfig($httpProvider) {
  $httpProvider.interceptors.push('loadingHttpInterceptor');
}

})();
