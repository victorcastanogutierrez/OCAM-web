(function () {
'use strict';

angular.module('public')
.controller('AccountController', AccountController);

AccountController.$inject = ['code', 'hikerService', '$mdDialog'];
function AccountController(code, hikerService, $mdDialog) {

  var $ctrl = this;
  var code = code;

  if (code) {
    $ctrl.cargando = true;
    var sendObj = {
      code: code
    };

    hikerService.validateHiker(sendObj, function(res) {
      $ctrl.cargando = false;
      $ctrl.msg = "¡Cuenta validada! Ya puedes acceder a la aplicación";
    }, function(err) {
      $ctrl.cargando = false;
      $ctrl.msg = "Ha ocurrido un error validando tu cuenta, prueba de nuevo más tarde";
    });
  }

  $ctrl.close = function() {
    $mdDialog.cancel();
  }
}
})();
