(function() {
"use strict";

angular.module('common', ['base64', 'ngStorage'])
.constant('SERVER_URL', 'https://localhost:8443')
.constant('LOGIN_API', '/api/auth/login')
.constant('REGISTER_API', '/hiker')
.constant('HIKER_EXISTS_API', '/hiker/exists');

})();
