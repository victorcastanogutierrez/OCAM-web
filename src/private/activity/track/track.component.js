(function () {
'use strict';

angular.module('private')
.component('activityTrack', {
  controller: ActivityTrackController,
  controllerAs: 'trackCtrl',
  templateUrl: 'src/private/activity/track/track.component.html',
  bindings: {
    activityTrack: '<'
  }
});

function ActivityTrackController() {
  var $ctrl = this;

  $ctrl.track = getActivityTrack($ctrl.activityTrack);
  if (assertTrackContainsPoints($ctrl.track)) {
    $ctrl.map = {
      center: {
        latitude: $ctrl.track.path[0].latitude,
        longitude: $ctrl.track.path[0].longitude
      },
      zoom: 12
    };
  }
}

/**
  Comprueba que el track tenga puntos
*/
var assertTrackContainsPoints = function(track) {
  return track.path.length > 0;
}

/**
   Retorna la polilinea con el track de la ruta
*/
var getActivityTrack = function(pts) {

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

})();
