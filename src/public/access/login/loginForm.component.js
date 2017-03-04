(function () {
'use strict';

angular.module('public')
.component('loginForm', {
  controller: LoginFormController,
  templateUrl: 'src/public/access/login/login.template.html',
  controllerAs: 'loginCtrl',
  bindings: {
    onError: '&',
    loading: '='
  }
});

LoginFormController.$inject = ['Auth', '$scope'];
function LoginFormController(Auth, $scope) {
  var $ctrl = this;
  $ctrl.loading = false;

  $ctrl.login = function() {

    if (!$ctrl.username || !$ctrl.password) {
      $ctrl.displayError("Credenciales inválidas.")
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
      var error;
      if (error.status == 401) {
        error = "Credenciales inválidas.";
      } else {
        error = "En estos momentos no es posible acceder a " +
          "la aplicación. Inténtalo más tarde.";
      }
      //Comunicamos el mensaje de error al controllador que contiene el componente
      $ctrl.displayError(error);
    };

    Auth.logIn($ctrl.username, $ctrl.password, loginSuccess, loginError);
  };

  $ctrl.disableErrors = function() {
    $ctrl.onError({msg : false});
  }

  $ctrl.displayError = function(errorMsg) {
    $ctrl.onError({msg : errorMsg});
  }

}

})();
