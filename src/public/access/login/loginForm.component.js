(function () {
'use strict';

angular.module('public')
.component('loginForm', {
  controller: LoginFormController,
  templateUrl: 'src/public/access/login/login.template.html',
  controllerAs: 'loginCtrl'
});

LoginFormController.$inject = ['hikerService', '$mdToast', '$scope'];
function LoginFormController(hikerService, $mdToast, $scope) {
  var $ctrl = this;

  $ctrl.login = function() {

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

  var showWelcomeToast = function() {
    $mdToast.show(
      $mdToast.simple()
        .textContent('¡Bienvenido ' + $ctrl.username + '!')
        .position("bottom, right")
        .hideDelay(3000)
    );
  }

}

})();
