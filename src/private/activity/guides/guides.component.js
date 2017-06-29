(function () {
'use strict';

angular.module('private')
.component('guidesSelection', {
  controller: ActivityGuidesController,
  controllerAs: 'guidesCtrl',
  templateUrl: 'src/private/activity/guides/guides.component.html',
  bindings: {
    guides: '<',
    editando: '<',
    nuevaActividad: '<',
    cargando: '=',
    onAdd: '&',
    onRemove: '&'
  }
});

ActivityGuidesController.$inject = ['$mdDialog', 'hikerService', 'Auth', '$filter'];
function ActivityGuidesController($mdDialog, hikerService, Auth, $filter) {
  var $ctrl = this;

  if (!$ctrl.guides) {
    $ctrl.guides = [];
  }

  //Por defecto, viene añadido el propio usuario
  if (!$ctrl.editando) {
    var myGuide = {
      login: Auth.getHikerLoggedIn().login
    };
    $ctrl.onAdd({ guide : myGuide }); // Notificamos el controlador
  }

  $ctrl.confirmarNuevoGuia = function(result) {
    if (!result || $ctrl.guides.find(x => x.login == result)) {
      return;
    }
    $ctrl.cargando = true;
    $ctrl.guidesError = "";
    hikerService.findByLogin(result).then(function() {
      $ctrl.cargando = false;
      var myGuide = {
        login: result
      };
      $ctrl.onAdd({ guide : myGuide }); // Notificamos el controlador
    }, function() {
      $ctrl.cargando = false;
      $ctrl.guidesError = "No existe el usuario registrado '"+result+"'";
    });
  }

  $ctrl.addGuide = function() {
    var confirm = $mdDialog.prompt()
      .title($filter('translate')('activity.guias.nuevo'))
      .textContent($filter('translate')('activity.guias.contenido'))
      .placeholder($filter('translate')('activity.guias.nombre'))
      .ok($filter('translate')('activity.guias.aniadir'))
      .cancel($filter('translate')('activity.guias.cancelar'));

    $mdDialog.show(confirm).then(function(result) {
      $ctrl.confirmarNuevoGuia(result);
    });
  };

  $ctrl.emptyGuidesList = function() {
    var tam = $ctrl.guides.length;
    for (var i = 0; i < tam; i++) {
      $ctrl.onRemove({ guide : 0 });
    }
  };

  $ctrl.removeGuide = function(index) {
    $ctrl.onRemove({ guide : index });
  };
}


})();
