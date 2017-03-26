(function () {
'use strict';

angular.module('public')
.component('registerForm', {
  controller: RegisterFormController,
  templateUrl: 'src/public/access/register/register.template.html',
  controllerAs: 'registerCtrl'
})
.constant ('EMAIL_FORMAT', /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/);

RegisterFormController.$inject = ['hikerService', 'EMAIL_FORMAT'];
function RegisterFormController(hikerService, EMAIL_FORMAT) {
  var $ctrl = this;
  $ctrl.emailFormat = EMAIL_FORMAT;

  $ctrl.register = function() {

    if (!assertPasswords()) {
      displayError("Las contraseñas no coinciden.");
      return;
    }

    $ctrl.disableErrors();

    //Registrado con exito
    var registerSuccess = function(result) {
      //TODO: notificar y redireccionar
    };

    //Error en el registro
    var registerError = function(error){
      displayError(error.message);
    };

    hikerService.register(getNewUser(), registerSuccess, registerError);
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
      username : $ctrl.username,
      password : $ctrl.password
    };
  }

}

})();
