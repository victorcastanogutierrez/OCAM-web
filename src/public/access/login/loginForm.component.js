(function () {
'use strict';

angular.module('public')
.component('loginForm', {
  controller: LoginFormController,
  templateUrl: 'src/public/access/login/login.template.html',
  controllerAs: 'loginCtrl'
});

LoginFormController.$inject = ['hikerService', '$mdToast', '$scope', '$mdDialog'];
function LoginFormController(hikerService, $mdToast, $scope, $mdDialog) {
  var $ctrl = this;

  $ctrl.login = function() {
    $ctrl.loading = true;
    if (!$ctrl.username || !$ctrl.password) {
      displayError("Credenciales inválidas.")
      return;
    }

    $ctrl.disableErrors();

    //Login success callback
    var loginSuccess = function(result) {
      showWelcomeToast();
    };

    //Login error callback
    var loginError = function(error){
      if (error.status == 401) {
        displayError("Credenciales inválidas.");
        $ctrl.loading = false;
      }
    };

    hikerService.logIn($ctrl.username, $ctrl.password, loginSuccess, loginError);
  };

  $ctrl.recuperarCuenta = function(ev) {

    var getHikerData = function(email) {
      return {
        email : email
      };
    };

    var confirm = $mdDialog.prompt()
      .title('Recuerar cuenta')
      .textContent('Introduce el correo electrónico con el que te registraste')
      .placeholder('Correo electrónico')
      .targetEvent(ev)
      .ok('Enviar nueva password')
      .cancel('Cancelar');

    var cambiaPassword = function() {
      $ctrl.loading = false;
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Recuperar cuenta')
          .textContent('Se ha enviado un email con una nueva contraseña en caso de coincidir con alguna cuenta existente.')
          .ok('Aceptar')
          .targetEvent(ev)
      );
    };

    $mdDialog.show(confirm).then(function(result) {
      if(!result || result.length == 0) {
        return;
      }
      $ctrl.loading = true;
      hikerService.resetPassword(getHikerData(result), function() {
        cambiaPassword();
      }, function() {
        cambiaPassword();
      })
    });
  };


  $ctrl.disableErrors = function() {
    $ctrl.errors = false;
  };

  var displayError = function(errorMsg) {
    $ctrl.errors = errorMsg;
  };

  var showWelcomeToast = function() {
    $mdToast.show(
      $mdToast.simple()
        .textContent('¡Bienvenido ' + $ctrl.username + '!')
        .position("bottom, right")
        .hideDelay(3000)
    );
  };

}

})();
