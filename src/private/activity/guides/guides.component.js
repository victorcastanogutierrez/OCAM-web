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

      if (!result || $ctrl.guides.find(x => x == result)) {
        return;
      }
      $ctrl.cargando = true;
      $ctrl.guidesError = "";
      hikerService.findByEmail(result).then(function() {
        $ctrl.cargando = false;
        var myGuide = {
          email: result
        };
        $ctrl.guides.push(myGuide);
        $ctrl.onAdd({ guide : myGuide }); // Notificamos el controlador
      }, function() {
        $ctrl.cargando = false;
        $ctrl.guidesError = "No existe usuario con correo electrónico '"+result+"' registrado";
      });
    });
  };

  $ctrl.emptyGuidesList = function() {
    $ctrl.guides.forEach(x => $ctrl.onRemove({ guide : x}));
    $ctrl.guides = [];
  };

  $ctrl.removeGuide = function(myGuide) {
    if (myGuide && $ctrl.guides.find(x => x == myGuide)) {
      $ctrl.onRemove({ guide : myGuide })
      $ctrl.guides.splice($ctrl.guides.indexOf(myGuide), 1);
    }
  };
}


})();
