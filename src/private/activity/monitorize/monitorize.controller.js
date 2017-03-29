(function () {
'use strict';

angular.module('private')
.controller('monitorizeController', monitorizeController);

monitorizeController.$inject = ['$stateParams', '$state', 'activityService',
  '$scope', 'TrackService'];
function monitorizeController($stateParams, $state, activityService, $scope,
  TrackService) {
  var $ctrl = this;

  $ctrl.map = {
    center: {
      latitude: 0,
      longitude: 0
    },
    zoom: 14
  };
  $ctrl.cargando = false;
  $ctrl.selected = [];
  $ctrl.page = 1;
  $ctrl.showFilter = false;
  $ctrl.filterOptions = {
    options: {
      debounce: 500
    }
  };
  $ctrl.hikers = [];
  $ctrl.initialRowLimit = 5; // Se machacará con otro dato al cargar las actividades
  $ctrl.currentReports = [];
  $ctrl.markers = [];
  $ctrl.trayectorias = [];
  $ctrl.controlTrayectorias = false;

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
    Comprueba que se haya pasado una id por parametro, que la actividad
    exista y que esté en estado RUNNING
  */
  var activityId = $stateParams.activityId;
  var notAllowed = function() {
    $state.go('private.actList');
  };

  /**
    Formatea una fecha a partir de un timestamp
  */
  var formatDate = function(timestamp) {
    var date = new Date(timestamp);
    if (date) {
      return date.getHours() + ':' + date.getMinutes() + ' ' +
      date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate();
    }
    return '';
  };

  /**
    Carga los últimos reportes de cada hiker
  */
  var cargarActivityReports = function() {
    $ctrl.cargando = true;
    $ctrl.promise = activityService.finLastActivityReports($ctrl.activity.id).then(
      /**
        Cruza los datos de los hiker con los reportes para asignar a cada uno
        la fecha de su último reporte
      */
      function(response) {
        $ctrl.cargando = false;
        $ctrl.currentReports = response;
        $ctrl.hikers.map(x => {
          var report = response.find(y => y.hiker.id == x.id);
          if (report) {
            x.lastReport = formatDate(report.date);
          }
        });
      }, function(err) {
        $ctrl.cargando = false;
        notAllowed();
      }
    )
  };

  var assertActivityRunning = function(activityId) {
    $ctrl.promise = activityService.findById(activityId).then(function (response) {
      $ctrl.activity = response;
      if (!$ctrl.activity.status == 'RUNNING') {
        notAllowed();
      } else {
        loadPageOptions();
        $ctrl.cargando = false;
        $ctrl.hikers = $ctrl.activity.hikers;
        $ctrl.track = TrackService.getActivityTrack($ctrl.activity.track);
        $ctrl.map.center = {
          latitude: $ctrl.track.path[0].latitude,
          longitude: $ctrl.track.path[0].longitude
        };
        cargarActivityReports();
      }
    }, function() {
      $ctrl.cargando = false;
      notAllowed();
    })
  };

  var assertValidActivity = function(activity) {
    $ctrl.cargando = true;
    if (!activityId){
      notAllowed();
    } else {
      assertActivityRunning(activityId);
    }
  };
  assertValidActivity($ctrl.activity);


  /**
    Esta función calcula el array de cantidad de filas que se podrá
    mostrar en la tabla en función del núemro total de elementos.
    Irá de 5 en 5 hasta alcanzar o sobrepasar el número total de elementos.
    Como cantidad de filas por defecto será el número de elementos de la tabla
  */
  var loadPageOptions = function() {
  var total = $ctrl.activity.hikers.length;
    var nPages = Math.floor(total/5);
    $ctrl.pageOptions = [];
    for (var i = 1; i <= nPages; i++) {
      $ctrl.pageOptions.push(5*i);
    }

    if ((total % 5) != 0) {
      $ctrl.pageOptions.push({
        label: 'Todos ('+total+')',
        value: function () {
          return total;
        }
      });
    }
    //$ctrl.initialRowLimit = total;
    $ctrl.initialRowLimit = 3;
  };

  var updateHikers = function() {
    if ($ctrl.activity) {
      $ctrl.hikers = $ctrl.activity.hikers.filter(x =>
        x.email.toLowerCase().includes($scope.mailFilter.toLowerCase())
      );
    }
  };

  var bookmark;
  $scope.$watch('mailFilter', function (newValue, oldValue) {
    if(!oldValue) {
      bookmark = $ctrl.page;
    }

    if(newValue !== oldValue) {
      $ctrl.page = 1;
    }

    if(!newValue) {
      $ctrl.page = bookmark;
    }
    updateHikers();
  });

  $ctrl.disableFilter = function() {
    $ctrl.showFilter = false;
    $scope.mailFilter = '';
    $ctrl.page = 1;
  };

  $ctrl.refreshData = function() {
    $ctrl.cargando = true;
    $ctrl.markers = [];
    $ctrl.promise = activityService.findById(activityId).then(function (response) {
      $ctrl.activity = response;
      $ctrl.cargando = false;
      $ctrl.page = 1;
      $ctrl.hikers = $ctrl.activity.hikers;
      if (!$ctrl.activity.status == 'RUNNING') {
        notAllowed();
      } else {
        loadPageOptions();
		    cargarActivityReports();
      }
    }, function() {
      $ctrl.cargando = false;
      notAllowed();
    });
  };

  $ctrl.selectItem = function(item) {
    var report = $ctrl.currentReports.find(x => x.hiker.email == item.email);
    if (report) {
      var marker = createMarker(item.id, item.email, report.point);
      $ctrl.markers.push(marker);
    }
  };

  $ctrl.deSelectItem = function(item) {
    var marker;
    var pos = null;
    for (var i = 0; i < $ctrl.markers.length; i++) {
      marker = $ctrl.markers[i];
      if (marker.id == item.id) {
        pos = i;
        break;
      }
    }
    if (pos != null) {
      $ctrl.markers.splice(pos, 1);
    }
  };

  /**
    Carga la trayectoria de un excursionista
  */
  $ctrl.cargarTrayectoria = function (hiker) {
    $ctrl.cargando = true;
    $ctrl.promise = activityService
      .findAllActivityReportsByHiker($ctrl.activity.id, hiker.id).then(
      function(response) {
        if (response && response.length > 0) {
          insertarTrayectoria(response, hiker.id);
        }
        $ctrl.cargando = false;
      }, function(err) {
        $ctrl.cargando = false;
      }
    );
  };

  /**
    Pone visible/oculta la trayectoria de un excursionista en caso de tenerla
    o la carga en caso contrario.
  */
  $ctrl.trayectoria = function(hiker) {
    var trayectoria = $ctrl.trayectorias.find(x => x.id == hiker.id);
    if (!trayectoria) {
      $ctrl.cargarTrayectoria(hiker);
    } else {
      trayectoria.visible = !trayectoria.visible;
    }
  };

  /**
    Crea una nueva trayectoria sustituyendo en caso de existir la antigua
  */
  var insertarTrayectoria = function(reports, hikerId) {
    var trayectoria = $ctrl.trayectorias.find(x => x.id == hikerId);
    var exists = trayectoria != undefined;

    if (!exists) {
      trayectoria = {
        id: hikerId,
        path: [],
        editable: false,
        draggable: false,
        geodesic: true,
        visible: false
      };
    } else {
      trayectoria.path = [];
    }

    reports.forEach(x => {
      trayectoria.path.push({
        latitude: x.point.latitude,
        longitude: x.point.longitude
      });
    });

    trayectoria.visible = true;
    if (!exists) {
      $ctrl.trayectorias.push(trayectoria);
    }
  };

}
})();
