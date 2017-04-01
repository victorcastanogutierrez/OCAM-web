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

ActivityTrackController.$inject = ['TrackService', 'mapService', '$scope'];
function ActivityTrackController(TrackService, mapService, $scope) {
  var $ctrl = this;

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


    $ctrl.markers.push(createMarker(0, "Inicio", $ctrl.track.path[0]));
    $ctrl.markers.push(createMarker(1, "Fin", $ctrl.track.path[$ctrl.track.path.length-1]));
  }

  //Configuración del tipo de mapa
  $scope.$on('mapChange', function(event, arg) {
    var cMap = mapService.getMapTypes().find(x => x.id == arg);
    if (cMap && cMap.mapType){
      console.log(cMap.mapType());
      $ctrl.mapType = cMap.mapType();
      $ctrl.showMapType = true;
    } else {
      $ctrl.showMapType = false;
    }
  });

  $ctrl.refreshMap = false;
  $ctrl.changeMap = function() {
    $ctrl.mapType = mapService.getOSM();
    $ctrl.refreshMap = true;
  }

}

/**
  Comprueba que el track tenga puntos
*/
var assertTrackContainsPoints = function(track) {
  return track.path.length > 0;
}


})();
