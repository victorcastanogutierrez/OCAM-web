(function () {
'use strict';

angular.module('public')
.component('registerForm', {
  controller: RegisterFormController,
  templateUrl: 'src/public/access/register/register.template.html',
  controllerAs: 'registerCtrl',
  bindings: {
    onError: '&',
    loading: '='
  }
})
.constant ('EMAIL_FORMAT', /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/);

RegisterFormController.$inject = ['hikerService', '$scope', 'EMAIL_FORMAT'];
function RegisterFormController(hikerService, $scope, EMAIL_FORMAT) {
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

    //Register success callback
    var registerSuccess = function(result) {
      $ctrl.loading = false;
      //TODO: notificar y redireccionar
    };

    //Register error callback
    var registerError = function(error){
      console.log(error);
      $ctrl.loading = false;
      var errormsg;
      if (error.status == 401) {
        errormsg = "Credenciales inválidas.";
      } else {
        errormsg = "En estos momentos no es posible acceder a " +
          "la aplicación. Inténtalo más tarde.";
      }
      //Comunicamos el mensaje de error al controllador que contiene el componente
      displayError(errormsg);
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
    $ctrl.onError({msg : false});
  }

  var displayError = function(errorMsg) {
    $ctrl.onError({msg : errorMsg});
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
