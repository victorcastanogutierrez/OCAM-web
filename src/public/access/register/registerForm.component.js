(function () {
'use strict';

angular.module('public')
.component('registerForm', {
  controller: RegisterFormController,
  templateUrl: 'src/public/access/register/register.template.html',
  controllerAs: 'registerCtrl'
})
.constant ('EMAIL_FORMAT', /^[a-zA-Z]+[a-zA-Z0-9._]+@[a-z]+\.[a-z.]{2,5}$/);

RegisterFormController.$inject = ['hikerService', 'EMAIL_FORMAT', '$mdDialog'];
function RegisterFormController(hikerService, EMAIL_FORMAT, $mdDialog) {
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
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(false)
          .title('Confirmación de registro')
          .textContent('Hemos enviado un correo electrónico a '+$ctrl.email+' con instrucciones\npara validar tu cuenta.')
          .ok('OK')
      );
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
