(function () {
'use strict';

angular.module('public')
.component('registerForm', {
  controller: RegisterFormController,
  templateUrl: 'src/public/access/register/register.template.html',
  controllerAs: 'registerCtrl',
  bindings: {
    loading: '='
  }
})
.constant ('EMAIL_FORMAT', /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/);

RegisterFormController.$inject = ['hikerService', 'EMAIL_FORMAT'];
function RegisterFormController(hikerService, EMAIL_FORMAT) {
  var $ctrl = this;
  $ctrl.loading = false;
  $ctrl.emailFormat = EMAIL_FORMAT;

  $ctrl.register = function() {

    if (!assertPasswords()) {
      displayError("Las contraseñas no coinciden.");
      return;
    }

    $ctrl.loading = true;
    $ctrl.disableErrors();

    //Registrado con exito
    var registerSuccess = function(result) {
      $ctrl.loading = false;
      //TODO: notificar y redireccionar
    };

    //Error en el registro
    var registerError = function(error){
      $ctrl.loading = false;
      //TODO: controlar coincidencia de correo electronico
    };

    var newUser = getNewUser();

    hikerService.existsHiker(newUser.login, function(result) {
      if (result == 'true') { // El usuario ya existe
        displayError('Nombre de usuario ya existente en el sistema!');
        $ctrl.loading = false;
      } else {
        hikerService.register(newUser, registerSuccess, registerError);
      }
    });
  };

  $ctrl.disableErrors = function() {
    $ctrl.errors = false;
  }

  var displayError = function(errorMsg) {
    $ctrl.errors = errorMsg;
  }

  var assertPasswords = function() {
    return $ctrl.password == $ctrl.repassword;
  }

  var getNewUser = function() {
    return {
      email : $ctrl.email,
      login : $ctrl.username,
      password : $ctrl.password
    };
  }

}

})();
