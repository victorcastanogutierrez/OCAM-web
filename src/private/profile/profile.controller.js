(function () {
'use strict';

angular.module('private')
.controller('profileController', profileController);

profileController.$inject = ['userData', '$mdDialog', 'Auth', 'hikerService'];
function profileController(userData, $mdDialog, Auth, hikerService) {
  var $ctrl = this;

  $ctrl.user = userData;


  $ctrl.mostrarDialog = function(ev) {
    $mdDialog.show({
      controller: passwordDialogController,
      controllerAs: 'dialogCtrl',
      templateUrl: 'src/private/profile/passDialog.template.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: false // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      console.log(answer);
    }, function() {

    });
  };

  $ctrl.eliminar = function(ev) {
    var confirm = $mdDialog.confirm()
          .title('¿Quieres eliminar tu cuenta?')
          .textContent('No podrás volver a acceder y NO habrá marcha atrás')
          .targetEvent(ev)
          .ok('Sí')
          .cancel('Cancelar');

    $mdDialog.show(confirm).then(function() {
      $ctrl.loading = true;
      hikerService.deleteHiker(Auth.getHikerLoggedIn().login, function() {
        Auth.logOutUser();
        $ctrl.loading = false;
      });
    });
  };

  passwordDialogController.$inject = ['$mdDialog', 'hikerService']
  function passwordDialogController($mdDialog, hikerService) {

    var $ctrl = this;
    $ctrl.loading = false;

    $ctrl.cancel = function() {
      $mdDialog.cancel();
    };

    $ctrl.disableError = function() {
      $ctrl.error = false;
    };

    $ctrl.answer = function() {
      if (!$ctrl.actPassword || !$ctrl.newPassword || !$ctrl.rePassword) {
        $ctrl.error = "Todos los campos son requeridos!";
        return;
      }
      if ($ctrl.newPassword != $ctrl.rePassword) {
        $ctrl.error = "Las nuevas password no coinciden";
        return;
      }
      $ctrl.loading = true;
      var dto = {
        username: userData.login,
        password: $ctrl.actPassword,
        newPassword: $ctrl.newPassword
      };

      var success = hikerService.changePassword(dto,
        function(response) {
          $ctrl.loading = false;
          $mdDialog.hide();
          mostrarConfirmacion();
        },
        function(error) {
          $ctrl.loading = false;
          $ctrl.error = error.message;
        });

    };

    var mostrarConfirmacion = function () {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Contraseña')
          .textContent('Se ha actualizado la contraseña con éxito.')
          .ok('Aceptar')
      );
    }
  }
}

})();
