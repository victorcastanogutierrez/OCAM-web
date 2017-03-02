(function() {
"use strict";

angular.module('common', ['base64'])
.constant('SERVER_URL', 'https://localhost:8443')
.constant('LOGIN_API', '/api/auth/login');

})();
