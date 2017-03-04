(function () {
"use strict";

angular.module('public')
.controller('loginController', loginController);

loginController.$inject = ['Auth'];
function loginController(Auth) {
  var $ctrl = this;
  $ctrl.loading = false;

  $ctrl.login = function() {
    $ctrl.loading = true;
    $ctrl.error = false;
    Auth.logIn($ctrl.username, $ctrl.password,
      function(result) {
        $ctrl.loading = false;
      },
      function(error){
        $ctrl.loading = false;
        if (error.status == 401) {
          $ctrl.errorMsg = "Credenciales inválidas";
        } else {
          $ctrl.errorMsg = "En estos momentos no es posible acceder a la aplicación. Inténtalo más tarde.";
        }
        $ctrl.error = true;
      });
    };
}


})();
