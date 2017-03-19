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

  /**
    Callback que maneja el boton de Mostrar/Ocultar track del mapa
  */
  $scope.controlTrack = function() {
    $ctrl.track.visible = false;
  }

  if ($ctrl.activity) {
    var dateFormat = $ctrl.activity.startDate.split('-');
    $ctrl.activity.startDate = new Date(dateFormat[0], dateFormat[1], dateFormat[2]);

    $ctrl.map = {
      center: {
        latitude: 40.4165000,
        longitude: -3.7025600
      },
      zoom: 6
    };

    $ctrl.track = getActivityTrack($ctrl.activity, $ctrl.map);
  }
}

/**
   Retorna la polilinea con el track de la ruta
*/
var getActivityTrack = function(activity, map) {

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
