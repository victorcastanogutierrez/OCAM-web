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

ActivityTrackController.$inject = ['TrackService', 'mapService', '$scope', 'uiGmapIsReady'];
function ActivityTrackController(TrackService, mapService, $scope, uiGmapIsReady) {
  var $ctrl = this;

  $ctrl.stroke = {
      weight: 1.5,
      color: '#0000FF'
  };
  $scope.rf = false;

  $ctrl.markers = [];
  $ctrl.map = {
    center: {
      latitude: 0,
      longitude: 0
    },
    zoom: 15
  };

  /**
    Array para almacenar los puntos que contiene una polylinea
  */
  var polyMarkers = [];

  var createMarker = function(id,  title, GPSPoint) {
    return {
      latitude: GPSPoint.latitude,
      longitude: GPSPoint.longitude,
      options: {
        labelClass:'marker_labels',
        labelAnchor:'12 60',
        labelContent: title
      },
      id: id
    };
  };

  /**
    Crea un marcador que se muestra en la polylinea
  */
  var createPolyLineMarker = function (map, latln) {
    return new google.maps.Marker({
      position: latln,
      map: map,
      visible: false,
      icon: {
          url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png",
          size: new google.maps.Size(7, 7),
          anchor: new google.maps.Point(4, 4)
        },
    });
  };

  /*
    Listener que controla el zoom sobre el mapa. Al pasar determinado nivel
    mostramos los markers que componen el track.
    Al volver a una altura considerable los ocultamos
  */
  var setUpZoomListener = function(map) {
    google.maps.event.addListener(map, 'zoom_changed', function() {
        var zoom = map.getZoom();
        for (var i = 0; i < polyMarkers.length; i++) {
            polyMarkers[i].setVisible(!(zoom <= 17));
        }
    });
  };

  $ctrl.track = TrackService.getActivityTrack($ctrl.activityTrack);
  if (assertTrackContainsPoints($ctrl.track)) {
    $ctrl.map = {
      center: {
        latitude: $ctrl.track.path[0].latitude,
        longitude: $ctrl.track.path[0].longitude
      },
      zoom: 13
    };

    /**
      Cuando el mapa está listo
    */
    uiGmapIsReady.promise(1).then(function(instances) {
      instances.forEach(function(inst) {
        $ctrl.mapOptions = {
          mapTypeControl: true,
          mapTypeId: 'Raster',
          //mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControlOptions: {
            mapTypeIds: ['PNOA', 'OSM', 'Raster', 'Raster Francia', google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.ROADMAP],
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
          },
          scaleControl:true,
          rotateControl:true
        };


        var map = inst.map;

        //Posicion constante del mouse
        $ctrl.CurrentCoords = "Latitud: -\nLongitud: -";
        google.maps.event.addListener(map, 'mousemove', function (event) {
          $ctrl.CurrentCoords = "Latitud: "+event.latLng.lat()+"\nLongitud: "+event.latLng.lng();
          var coordsLabel = document.getElementById("btCoords");
          coordsLabel.innerHTML = "(Cursor) Lat: "+event.latLng.lat().toFixed(7)+", Lon: "+event.latLng.lng().toFixed(7)+"<br />" ;
        });

        //Grid
        map.overlayMapTypes.insertAt(
            0, mapService.getOverlayFn(new google.maps.Size(256, 256), map));

        //Tipos de mapas
        map.mapTypes.set('PNOA', mapService.getPNOAIGN(map.getProjection()));
        map.mapTypes.set('OSM', mapService.getOSM());
        map.mapTypes.set('Raster', mapService.getRaster());
        map.mapTypes.set('Raster Francia', mapService.getRasterFrance());

        //Marker de inicio y fin de ruta
        $ctrl.markers.push(createMarker(0, "Inicio", $ctrl.track.path[0]));
        $ctrl.markers.push(createMarker(1, "Fin", $ctrl.track.path[$ctrl.track.path.length-1]));

        //Markers por la polylinea indicando los puntos que la forman
        for (var i = 0; i < $ctrl.track.path.length; i++) {
          var ltln = new google.maps.LatLng($ctrl.track.path[i].latitude, $ctrl.track.path[i].longitude);
          polyMarkers.push(createPolyLineMarker(map, ltln));
        }
        setUpZoomListener(map);
      });
    });

  }
}

/**
  Comprueba que el track tenga puntos
*/
var assertTrackContainsPoints = function(track) {
  return track.path.length > 0;
}


})();
