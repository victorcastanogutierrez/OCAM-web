(function () {
'use strict';

angular.module('private')
.component('guidesSelection', {
  controller: ActivityGuidesController,
  controllerAs: 'guidesCtrl',
  templateUrl: 'src/private/activity/guides/guides.component.html',
  bindings: {
    guides: '<',
    nuevaActividad: '<',
    cargando: '=',
    onAdd: '&',
    onRemove: '&'
  }
});

ActivityGuidesController.$inject = ['$mdDialog', 'hikerService'];
function ActivityGuidesController($mdDialog, hikerService) {
  var $ctrl = this;

  if (!$ctrl.guides) {
    $ctrl.guides = [];
  }

  $ctrl.addGuide = function() {
    var confirm = $mdDialog.prompt()
      .title('Nuevo guía')
      .textContent('Introduce el correo electrónico del guía que será asociado a la nueva actividad')
      .placeholder('Email')
      .ok('Añadir')
      .cancel('Cancelar');

    $mdDialog.show(confirm).then(function(result) {
      if (!result || $ctrl.guides.find(x => x.email == result)) {
        return;
      }
      $ctrl.cargando = true;
      $ctrl.guidesError = "";
      hikerService.findByEmail(result).then(function() {
        $ctrl.cargando = false;
        var myGuide = {
          email: result
        };
        $ctrl.onAdd({ guide : myGuide }); // Notificamos el controlador
      }, function() {
        $ctrl.cargando = false;
        $ctrl.guidesError = "No existe usuario con correo electrónico '"+result+"' registrado";
      });
    });
  };

  $ctrl.emptyGuidesList = function() {
    var tam = $ctrl.guides.length;
    for (var i = 0; i < tam; i++) {
      $ctrl.onRemove({ guide : 0 });
    }
    $ctrl.guides = [];
  };

  $ctrl.removeGuide = function(index) {
    $ctrl.onRemove({ guide : index });
    /*if (myGuide) {
      for (var i = 0; i < $ctrl.guides.length; i++) {
        if ($ctrl.guides[i].email == myGuide.email) {
          $ctrl.onRemove({ guide : i });
          break;
        }
      }
    }*/
  };
}


})();
