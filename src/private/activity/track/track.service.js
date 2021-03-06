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

  /**
    Función que retorna una polylinea con el track de la ruta
  */
  service.getActivityTrack = function(pts) {

      //Obtiene el XML del track
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(pts, "text/xml");
      var points = [];

      var incluirPunto = function(that) {
        var lat = that.attr("lat");
        var lon = that.attr("lon");
        points.push({latitude: lat, longitude: lon});
      }

      //Obtiene el array de puntos
      $(xmlDoc).find("trkpt").each(function () {
        incluirPunto($(this));
      });
      $(xmlDoc).find("wpt").each(function () {
        incluirPunto($(this));
      });

      //Construye la polylinea
      var polyLinea = {
        id : 1,
        path : points,
        stroke: {
          color: '#6060FB',
          weight: 3
        },
        geodesic: true,
        visible: true,
        icons: [{
          icon: {
              path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
          },
          offset: '25px',
          repeat: '50px'
        }]
      };

      return polyLinea;
    };
}

})();
