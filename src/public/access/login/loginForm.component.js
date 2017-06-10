(function () {
'use strict';

angular.module('public')
.component('loginForm', {
  controller: LoginFormController,
  templateUrl: 'src/public/access/login/login.template.html',
  controllerAs: 'loginCtrl'
});

LoginFormController.$inject = ['hikerService', '$mdToast', '$scope', '$mdDialog',
  '$filter', 'Auth'];
function LoginFormController(hikerService, $mdToast, $scope, $mdDialog, $filter,
  Auth) {
  var $ctrl = this;

  $ctrl.login = function() {
    $ctrl.loading = true;
    if (!$ctrl.username || !$ctrl.password) {
      displayError($filter('translate')('error.login.credenciales'));
      $ctrl.loading = false;
      return;
    }

    $ctrl.disableErrors();

    //Login success callback
    var loginSuccess = function(result) {
      Auth.logUser(result.data.login, result.data);
      Auth.configureHttpAuth();
      showWelcomeToast();
    };

    //Login error callback
    var loginError = function(error){
      if (error.status == 401) {
        displayError($filter('translate')('error.login.credenciales'));
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
      .title($filter('translate')('recuperar'))
      .textContent($filter('translate')('introducir.correo'))
      .placeholder($filter('translate')('correo'))
      .targetEvent(ev)
      .ok($filter('translate')('confirmar.nueva.password'))
      .cancel($filter('translate')('cancelar'));

    var cambiaPassword = function() {
      $ctrl.loading = false;
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title($filter('translate')('recuperar'))
          .textContent($filter('translate')('avisorecuperar'))
          .ok($filter('translate')('aceptar'))
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
        .textContent('¡' + $filter('translate')('bienvenido') + ' ' + $ctrl.username + '!')
        .position("bottom, right")
        .hideDelay(3000)
    );
  };

}

})();
