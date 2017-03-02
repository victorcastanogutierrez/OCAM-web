(function () {
"use strict";

angular.module('public')
.controller('loginController', loginController);

loginController.$inject = ['Auth'];
function loginController(Auth) {
  var $ctrl = this;
  $ctrl.login = function() {
    Auth.logIn($ctrl.username, $ctrl.password);
  };
}


})();
