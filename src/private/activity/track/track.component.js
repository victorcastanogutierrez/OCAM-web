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

  $ctrl.track = TrackService.getActivityTrack($ctrl.activityTrack);
  if (assertTrackContainsPoints($ctrl.track)) {
    $ctrl.map = {
      center: {
        latitude: $ctrl.track.path[0].latitude,
        longitude: $ctrl.track.path[0].longitude
      },
      zoom: 5
    };


    /**
      Cuando el mapa está listo
    */
    uiGmapIsReady.promise(1).then(function(instances) {
        instances.forEach(function(inst) {
          $ctrl.mapOptions = {
            mapTypeControl: true,
            mapTypeId: 'Raster',
            mapTypeControlOptions: {
              mapTypeIds: ['PNOA', 'OSM', 'Raster', 'Raster Francia', google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.ROADMAP],
              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            },
            scaleControl:true,
            rotateControl:true
          };

          var map = inst.map;
          map.mapTypes.set('PNOA', mapService.getPNOAIGN(map.getProjection()));
          map.mapTypes.set('OSM', mapService.getOSM());
          map.mapTypes.set('Raster', mapService.getRaster());
          map.mapTypes.set('Raster Francia', mapService.getRasterFrance());


          $ctrl.markers.push(createMarker(0, "Inicio", $ctrl.track.path[0]));
          $ctrl.markers.push(createMarker(1, "Fin", $ctrl.track.path[$ctrl.track.path.length-1]));
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
