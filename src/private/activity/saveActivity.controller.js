(function () {
'use strict';

angular.module('private')
.controller('saveActivityController', saveActivityController);

saveActivityController.$inject = ['$scope', 'activityService', '$mdDialog', '$state',
  'TrackService', '$stateParams', '$mdToast', '$translatePartialLoader', '$translate',
  '$filter'];
function saveActivityController($scope, activityService, $mdDialog, $state,
  TrackService, $stateParams, $mdToast, $translatePartialLoader, $translate,
  $filter) {

  var $ctrl = this;
  $translatePartialLoader.addPart('activity');
  $translate.refresh();
  $ctrl.activity = $stateParams.activity;

  //Flag que controla la editabilidad de los campos del template
  $ctrl.nuevaActividad = true;
  $ctrl.currentDate = new Date();
  $ctrl.cargando = false;
  $ctrl.guides = [];

  //Flag que indica si se está editando o no una actividad
  $ctrl.editando = $ctrl.activity != undefined;
  if ($ctrl.editando) {
    $ctrl.guides = $ctrl.activity.guides;
  }

  // Listener para el fichero gpx
  $scope.file_changed = function(element) {
     $scope.$apply(function(scope) {
         $ctrl.gpxFile = element.files[0];
     });
  };

  //Métodos de utilidad
  var getToastText = function(editando) {
    if (!editando) {
      return $filter('translate')('activity.confirmacion.creada');
    }
    else {
      return $filter('translate')('activity.confirmacion.actualizada');
    }
  };

  var getConfirmText = function(editando) {
    if (!editando) {
      return $filter('translate')('activity.confirmacion.crear');
    }
    else {
      return $filter('translate')('activity.confirmacion.editar');
    }
  };

  var getTitleText = function(editando) {
    if (!editando) {
      return $filter('translate')('activity.guardar.actividad');
    }
    else {
      return $filter('translate')('activity.editar.actividad');
    }
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
    $ctrl.guides.splice(guide, 1);
  }

  $ctrl.cancelarEdicion = function() {
    $state.go("private.activity", {activity: $ctrl.activity});
  };

  /**
    Edita o crea la actividad
  */
  $ctrl.crearActividad = function() {
    if (!assertGuides()) {
      $ctrl.error = $filter('translate')('activity.error.guia.minimo');
      return;
    }
    if (!$ctrl.editando || ($ctrl.editando && $ctrl.gpxFile)) {
      $ctrl.error = TrackService.assertGPXFile($ctrl.gpxFile);
      if (!$ctrl.error) {
        $ctrl.error = assertActivityDescription();
      }
    }
    if (!$ctrl.error) {
      var newActivity = getNewActivity();
      var successGPXLoad = function(gpxContent) {
        if (!assertGPXFileContent(gpxContent)) { // Comprobación GPX (contenido)
          $ctrl.error = $filter('translate')('activity.error.contenido.gpx');
        } else if (!assertGuides()) {
          $ctrl.error = $filter('translate')('activity.error.guia.minimo');
        } else {
          confirmSave(function() {
            $ctrl.cargando = true;
            newActivity.guides = $ctrl.guides;
            newActivity.track = gpxContent;
            activityService.save(newActivity, function(response) {
              showConfirmToast();
              $state.go("private.activity", {activity: response});
              $ctrl.cargando = false;
            }, function(err) {
              $ctrl.error = err.message;
              $ctrl.cargando = false;
            });
          });
        }
      };
      //Solo en caso que haya contenido: nuevo o editado
      if ($ctrl.gpxFile) {
        TrackService.getGPXContent($ctrl.gpxFile, successGPXLoad);
      } else { // Se está editando y el track ya lo tiene
        successGPXLoad($ctrl.activity.track)
      }
    }
  };

  var showConfirmToast = function() {
    $mdToast.show(
      $mdToast.simple()
        .textContent(getToastText($ctrl.editando))
        .position("bottom, right")
        .hideDelay(3000)
    );
  }

  var assertGuides = function() {
    return $ctrl.guides.length > 0;
  };

  var confirmSave = function (success) {
    var confirm = $mdDialog.confirm()
          .title(getTitleText($ctrl.editando))
          .textContent(getConfirmText($ctrl.editando))
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
    var mideAct = $ctrl.activity.mide;
    return {
      id: $ctrl.activity.id, // Si la está editando habrá contenido.
      shortDescription: $ctrl.activity.shortDescription,
      longDescription: $ctrl.activity.longDescription,
      mide: mideAct ? (mideAct.length == 0 ? null : mideAct) : null,
      startDate: $ctrl.activity.startDate,
      maxPlaces: $ctrl.activity.maxPlaces
    };
  };

  /**
    Comprueba la descripcion de la actividad
  */
  var assertActivityDescription = function() {
    if (!$ctrl.activity.mide && !$ctrl.activity.longDescription) {
      return $filter('translate')('activity.enlace.mide.requerido');
    } else if ($ctrl.activity.mide) {
      if (!$ctrl.activity.mide.includes("http://") && !$ctrl.activity.mide.includes("www")
        && !$ctrl.activity.mide.includes("https://")) {
        return $filter('translate')('activity.enlace.mide.invalido');
      }
    }
    return false;
  }
}

/**
  Comprueba que el fichero GPX no esté vacío
*/
var assertGPXFileContent = function(track) {
  return track;
};

})();
