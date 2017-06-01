(function () {
'use strict';

angular.module('private')
.controller('activityController', activityController);

activityController.$inject = ['$stateParams', '$state', '$scope', 'Auth',
  '$mdDialog', 'activityService', '$window', '$translatePartialLoader'];
function activityController($stateParams, $state, $scope, Auth, $mdDialog,
  activityService, $window, $translatePartialLoader) {
  var $ctrl = this;
  $translatePartialLoader.addPart('activity');
  $ctrl.activity = $stateParams.activity;

  /**
    Function que comprueba si recarga la página y por tanto el parametro pasado
    desde el estado previo se pierde
  */
  var assertValidActivity = function(activity) {
    if (!activity){
      $state.go('private.actList');
    }
  }
  assertValidActivity($ctrl.activity);
  $ctrl.getActivityStatus = function() {
    if ($ctrl.activity) {
      if ($ctrl.activity.status == 'RUNNING') {
        return 'en curso'
      } else if ($ctrl.activity.status == 'PENDING') {
        return 'pendiente'
      } else {
        return 'finalizada'
      }
    }
  };

  if ($ctrl.activity) {
    if (!$ctrl.activity.startDate.split) { // Timestamp
      $ctrl.activity.startDate = new Date($ctrl.activity.startDate);
    } else {
      var dateFormat = $ctrl.activity.startDate.split('-');
      $ctrl.activity.startDate = new Date(dateFormat[0], dateFormat[1], dateFormat[2]);
    }
    $ctrl.guides = $ctrl.activity.guides;
    $ctrl.isOwner = Auth.isUserLoggedIn().email == $ctrl.activity.owner.email;
  };

  $ctrl.onError = function(error) {
    $ctrl.error = error;
  };

  $ctrl.onLoading = function(loading) {
    $ctrl.cargando = loading;
  };

  $ctrl.mide = function() {
    if (!$ctrl.activity.mide.includes("http://") && !$ctrl.activity.mide.includes("https://")) {
      $window.location.href = "http://" + $ctrl.activity.mide;
    } else {
      $window.location.href = $ctrl.activity.mide;
    }
  };

  $ctrl.monitorizarActividad = function() {
    /*
      Si la actividad ya está cerrada no pide password,
      solo puede llegar a ella un participante
    */
    if ($ctrl.activity.status == 'CLOSED') {
      $state.go("private.monitorize", {activityId: $ctrl.activity.id});
      $ctrl.cargando = false;
      return ;
    }
    var confirm = $mdDialog.prompt()
      .title('Monitorizar actividad')
      .textContent('Introduce la contraseña para acceder a la monitorización de la actividad.')
      .placeholder('Contraseña')
      .ok('Continuar')
      .cancel('Cancelar');

    $mdDialog.show(confirm).then(function(result) {
      if (!result) {
        errorPassword('¡Debes introducir la password!');
        return;
      }
      $ctrl.cargando = true;

      activityService.checkPassword($ctrl.activity.id, result).then(function() {
        $state.go("private.monitorize", {activityId: $ctrl.activity.id});
        $ctrl.cargando = false;
      }, function(err) {
        errorPassword(err.data.message);
        $ctrl.cargando = false;
      });
    });
  };

  var errorPassword = function(err) {
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Error comprobando la password de la actividad')
        .textContent(err)
        .ok('Aceptar')
    );
  }
}

})();
