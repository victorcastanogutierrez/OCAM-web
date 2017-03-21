(function () {
'use strict';

angular.module('private')
.controller('activityController', activityController);

activityController.$inject = ['$stateParams', '$state', '$scope'];
function activityController($stateParams, $state, $scope) {
  var $ctrl = this;
  $ctrl.activity = $stateParams.activity;

  /**
    Function que comprueba si recarga la página y por tanto el parametro pasado
    desde el estado previo se pierde
  */
  var assertValidActivity = function(activity) {
    if (!activity){
      $state.go('private.actList');
    }
  }
  assertValidActivity($ctrl.activity);
  $ctrl.getActivityStatus = function() {
    if ($ctrl.activity) {
      if ($ctrl.activity.status == 'RUNNING') {
        return 'en curso'
      } else if ($ctrl.activity.status == 'PENDING') {
        return 'pendiente'
      } else {
        return 'finalizada'
      }
    }
  }

  if ($ctrl.activity) {
    var dateFormat = $ctrl.activity.startDate.split('-');
    $ctrl.activity.startDate = new Date(dateFormat[0], dateFormat[1], dateFormat[2]);

    $ctrl.track = getActivityTrack($ctrl.activity);
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
var getActivityTrack = function(activity) {

    //Obtiene el XML del track
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(activity.track, "text/xml");
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
