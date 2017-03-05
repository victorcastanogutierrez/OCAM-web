(function () {
'use strict';

angular.module('public')
.component('loginForm', {
  controller: LoginFormController,
  templateUrl: 'src/public/access/login/login.template.html',
  controllerAs: 'loginCtrl',
  bindings: {
    loading: '='
  }
});

LoginFormController.$inject = ['hikerService'];
function LoginFormController(hikerService) {
  var $ctrl = this;
  $ctrl.loading = false;

  $ctrl.login = function() {

    if (!$ctrl.username || !$ctrl.password) {
      displayError("Credenciales inválidas.")
      return;
    }

    $ctrl.loading = true;
    $ctrl.disableErrors();

    //Login success callback
    var loginSuccess = function(result) {
      $ctrl.loading = false;
      //TODO: redireccionar a zona privada
    };

    //Login error callback
    var loginError = function(error){
      $ctrl.loading = false;
      if (error.status == 401) {
        displayError("Credenciales inválidas.");
      }
    };

    hikerService.logIn($ctrl.username, $ctrl.password, loginSuccess, loginError);
  };

  $ctrl.disableErrors = function() {
    $ctrl.errors = false;
  }

  var displayError = function(errorMsg) {
    $ctrl.errors = errorMsg;
  }

}

})();
