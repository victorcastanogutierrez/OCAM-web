(function () {
"use strict";

angular.module('private')
.service('TrackService', TrackService);

TrackService.$inject = [];
function TrackService() {
  var service = this;

  /**
    Comprueba la validez de un fichero GPX (extensión)
  */
  service.assertGPXFile = function (file) {
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
    if (file.size > 3145728) {
      return "Fichero demasiado pesado (Máximo 3MB)";
    }
    return false;
  };

  /**
    Obtiene como una cadena de texto el contenido de un fichero GPX
  */
  service.getGPXContent = function(file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
      callback(e.target.result);
    };
    reader.readAsText(file);
  };
}

})();
