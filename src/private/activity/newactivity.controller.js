(function () {
'use strict';

angular.module('private')
.controller('newActivityController', newActivityController);

newActivityController.$inject = ['$scope', 'activityService', '$mdDialog', '$state',
  'TrackService'];
function newActivityController($scope, activityService, $mdDialog, $state,
  TrackService) {

  var $ctrl = this;

  $ctrl.nuevaActividad = true;
  $ctrl.currentDate = new Date();
  $ctrl.cargando = false;
  $ctrl.guides = [];

  // Listener para el fichero gpx
  $scope.file_changed = function(element) {
     $scope.$apply(function(scope) {
         $ctrl.gpxFile = element.files[0];
     });
  };

  /**
    Metodo llamado desde el componente para añadir el guía
  */
  $ctrl.onAddGuide = function(guide) {
    $ctrl.guides.push(guide);
  }

  /**
    Metodo llamado desde el componente para eliminar el guía
  */
  $ctrl.onRemoveGuide = function(guide) {
    $ctrl.guides.splice($ctrl.guides.indexOf(guide), 1);
  }

  $ctrl.crearActividad = function() {
    $ctrl.error = TrackService.assertGPXFile($ctrl.gpxFile);
    if (!$ctrl.error) {
      var newActivity = getNewActivity();
      var successGPXLoad = function(gpxContent) {
        if (!assertGPXFileContent(gpxContent)) { // Comprobación GPX (contenido)
          $ctrl.error = "Contenido del fichero GPX inválido";
        } else if (!assertGuides()) {
          $ctrl.error = "Debe haber como mínimo un guía!";
        } else {
          confirmSave(function() {
            newActivity.track = gpxContent;
            newActivity.guides = $ctrl.guides;
            $ctrl.cargando = true;
            activityService.save(newActivity, function(response) {
              $state.go("private.activity", {activity: response});
              $ctrl.cargando = false;
            }, function(err) {
              $ctrl.error = err.message;
              $ctrl.cargando = false;
            });
          });
        }
      };
      TrackService.getGPXContent($ctrl.gpxFile, successGPXLoad);
    }
  };

  var assertGuides = function() {
    return $ctrl.guides.length > 0;
  }

  var confirmSave = function (success) {
    var confirm = $mdDialog.confirm()
          .title('Guardar actividad')
          .textContent('¿Estás seguro de que quieres crear esta actividad?')
          .ok('Continuar')
          .cancel('Cancelar');

    $mdDialog.show(confirm).then(function() {
      success();
    });
  };

  /**
    Retorna el objeto actividad con los datos necsarios
  */
  var getNewActivity = function(){
    return {
      shortDescription: $ctrl.activity.shortDescription,
      longDescription: $ctrl.activity.longDescription,
      startDate: $ctrl.activity.startDate,
      maxPlaces: $ctrl.activity.maxPlaces
    };
  }
}

/**
  Comprueba que el fichero GPX no esté vacío
*/
var assertGPXFileContent = function(track) {
  return track;
}

})();
