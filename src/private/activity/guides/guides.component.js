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

ActivityGuidesController.$inject = ['$mdDialog', 'hikerService', 'Auth'];
function ActivityGuidesController($mdDialog, hikerService, Auth) {
  var $ctrl = this;

  if (!$ctrl.guides) {
    $ctrl.guides = [];
  }

  //Por defecto, viene añadido el propio usuario
  console.log($ctrl.editando);
  if (!$ctrl.editando) {
    var myGuide = {
      login: Auth.getHikerLoggedIn().login
    };
    $ctrl.onAdd({ guide : myGuide }); // Notificamos el controlador
  }

  $ctrl.addGuide = function() {
    var confirm = $mdDialog.prompt()
      .title('Nuevo guía')
      .textContent('Introduce el nombre de usuario del guía que será asociado a la nueva actividad')
      .placeholder('Nombre de usuario')
      .ok('Añadir')
      .cancel('Cancelar');

    $mdDialog.show(confirm).then(function(result) {
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
