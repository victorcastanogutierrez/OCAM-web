(function () {
'use strict';

angular.module('private')
.controller('newActivityController', newActivityController);

newActivityController.$inject = ['$scope'];
function newActivityController($scope) {
  var $ctrl = this;

  $ctrl.nuevaActividad = true;
  $ctrl.currentDate = new Date();

  // Listener para el fichero gpx
  $scope.file_changed = function(element) {
     $scope.$apply(function(scope) {
         $ctrl.gpxFile = element.files[0];
     });
  };

  $ctrl.nuevaActividad = function() {
    $ctrl.error = assertGPXFile($ctrl.gpxFile);
    if (!$ctrl.error) {
      var newActivity = getNewActivity();
      var successGPXLoad = function(gpxContent) {
        if (!assertGPXFileContent(gpxContent)) { // Comprobación GPX (contenido)
          $ctrl.error = "Contenido del fichero GPX inválido";
        } else {
          newActivity.track = gpxContent;
        }
      };
      getGPXContent($ctrl.gpxFile, successGPXLoad);
    }
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

/**
  Comprueba la validez de un fichero GPX (extensión)
*/
var assertGPXFile = function (file) {
  if (!file) {
    return "Fichero de track GPX requerido";
  }
  if (!file.name.includes('.')) {
    return "Extensión de fichero GPX inválida";
  }
  var splits = file.name.split('.');
  if (splits[splits.length-1] != 'gpx') {
    return "Extensión de fichero GPX inválida";
  }
  return false;
}

/**
  Obtiene como una cadena de texto el contenido de un fichero GPX
*/
var getGPXContent = function(file, callback) {
  var reader = new FileReader();
  reader.onload = function(e) {
    callback(e.target.result);
  };
  reader.readAsText(file);
}

})();
