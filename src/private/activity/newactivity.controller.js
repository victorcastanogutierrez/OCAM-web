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
      var gpxContent = getGPXContent($ctrl.gpxFile);
    }
  };

}

/**
  Comprueba la validez de un fichero GPX
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
var getGPXContent = function(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
     return e.target.result;
  };
  reader.readAsText(file);
}

})();
