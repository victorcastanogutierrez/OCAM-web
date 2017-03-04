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

    Auth.logIn($ctrl.username, $ctrl.password, loginSuccess, loginError);
  };

  $ctrl.disableErrors = function() {
    $ctrl.onError({msg : false});
  }

  var displayError = function(errorMsg) {
    $ctrl.onError({msg : errorMsg});
  }

}

})();
