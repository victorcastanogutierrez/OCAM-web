(function () {
'use strict';

angular.module('private')
.controller('monitorizeController', monitorizeController);

monitorizeController.$inject = ['$stateParams', '$state', 'activityService',
  '$scope', 'TrackService', 'uiGmapGoogleMapApi', 'mapService', 'Auth', 'uiGmapIsReady'];
function monitorizeController($stateParams, $state, activityService, $scope,
  TrackService, uiGmapGoogleMapApi, mapService, Auth, uiGmapIsReady) {
  var $ctrl = this;

  $ctrl.map = {
    center: {
      latitude: 0,
      longitude: 0
    },
    zoom: 14
  };
  $ctrl.stroke = {
      weight: 1.5,
      color: '#0000FF'
  };
  $ctrl.gmap = undefined;
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
  $ctrl.puntosTrayectoria = [];
  $ctrl.controlTrayectorias = false;
  $ctrl.showMapTrack = true;
  $ctrl.collapsed = false;
  /**
    Array para almacenar los puntos que contiene una polylinea
  */
  var polyMarkers = [];

  /**
    Crea un marcador que se muestra en la polylinea
  */
  var createPolyLineMarker = function (map, latln, visibility) {
    return new google.maps.Marker({
      position: latln,
      map: map,
      visible: visibility,
      icon: {
          url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png",
          size: new google.maps.Size(7, 7),
          anchor: new google.maps.Point(4, 4)
        },
    });
  };

  /*
    Listener que controla el zoom sobre el mapa. Al pasar determinado nivel
    mostramos los markers que componen el track y las trayectorias.
    Al volver a una altura considerable los ocultamos
  */
  var setUpZoomListener = function(map) {
    var tray;
    google.maps.event.addListener(map, 'zoom_changed', function() {
        /*
          Puntos del track
        */

        if ($ctrl.showMapTrack) {
          var show = map.getZoom() <= 12;
          for (var i = 0; i < polyMarkers.length; i++) {
              polyMarkers[i].setVisible(!show);
          }
        }

        /*
          Puntos de cada trayectoria visible. En este caso lo que hacemos es
          comprobar si la trayectoria en si está visible. Si lo está actuamos
          sobre sus puntos
        */
        $ctrl.trayectorias.filter(x => x.visible)
          .forEach(x => {
            tray = $ctrl.puntosTrayectoria.find(y => y.id == x.id);
            if (tray) {
              tray.markers.map(y => y.setVisible(!show));
            }
          });
    });
  };

  $ctrl.collapse = function() {
    $ctrl.collapsed = !$ctrl.collapsed;
  };

  /**
    Cuando el mapa está listo
  */
  var loadMapData = function() {
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
          $ctrl.gmap = map;

          $ctrl.markers.push(createMarker(0, "Inicio", $ctrl.track.path[0]));
          $ctrl.markers.push(createMarker(1, "Fin", $ctrl.track.path[$ctrl.track.path.length-1]));

          //Markers por la polylinea indicando los puntos que la forman
          for (var i = 0; i < $ctrl.track.path.length; i++) {
            var ltln = new google.maps.LatLng($ctrl.track.path[i].latitude, $ctrl.track.path[i].longitude);
            polyMarkers.push(createPolyLineMarker($ctrl.gmap, ltln, false));
          }
          setUpZoomListener($ctrl.gmap);

          //Grid
          map.overlayMapTypes.insertAt(
              0, mapService.getOverlayFn(new google.maps.Size(256, 256), map));

          //Localización constante sobre el mapa
          $ctrl.CurrentCoords = "Latitud: -\nLongitud: -";
          google.maps.event.addListener(map, 'mousemove', function (event) {
            $ctrl.CurrentCoords = "Latitud: "+event.latLng.lat()+"\nLongitud: "+event.latLng.lng();
            var coordsLabel = document.getElementById("btCoords");
            coordsLabel.innerHTML = "Latitud: "+event.latLng.lat().toFixed(7)+"\nLongitud: "+event.latLng.lng().toFixed(7);
          });
        });
    });

  };




  /**
    En caso de entrar por ser una actividad finalizada y por tanto
    es un participante, entra en modo de consulta de datos.
    De esta manera se bloquea mucha funcionalidad:
      - Ver reportes de otras personas que no sea él
      - Recargar los reportes (nunca más habrá cambios, es absurdo dejar hacerlo)
    Una vez cargada la actividad se evalua el contenido de este flag
  */
  $ctrl.consulta = false;

  var createMarker = function(id,  title, GPSPoint) {
    return {
      latitude: GPSPoint.latitude,
      longitude: GPSPoint.longitude,
      options: {
        labelClass:'marker_labels',
        labelAnchor:'12 60',
        labelContent: title,
        visible: true
      },
      id: id
    };
  };

  /**
    Comprueba que se haya pasado una id por parametro, que la actividad
    exista y que esté en estado RUNNING
  */
  var activityId = $stateParams.activityId;
  $ctrl.track = TrackService.getActivityTrack($stateParams.track);
  console.log($ctrl.track);
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
    Tras cargar losd atos de los hiker recarga lo que se está mostrando en el mapa
    Si es para un solo hiker o si es para todos, se comprueba con el parametro
  */
  var reloadPolylines = function(hiker) {
    var tray = [];
    if (!hiker) {
      tray = $ctrl.trayectorias;
    } else {
      var entry = $ctrl.trayectorias.find(x => x.id == hiker.email);
      if (entry) {
        tray.push(entry);
      }
    }
    if (tray) {
      tray.forEach(x => {
        x.visible = false;
        $ctrl.puntosTrayectoria.find(y => y.id == x.id).markers.forEach(z => z.setVisible(false));
      });
    }
  };

  /**
    Carga los últimos reportes de cada hiker
  */
  var cargarActivityReports = function() {
    $ctrl.cargando = true;

    /**
      Cruza los datos de los hiker con los reportes para asignar a cada uno
      la fecha de su último reporte
    */
    var procesarDatosReportes = function(response) {
      $ctrl.cargando = false;
      $ctrl.currentReports = response;
      $ctrl.hikers.map(x => {
        var report = response.find(y => y.hiker.email == x.email);
        if (report) {
          x.lastReport = formatDate(report.date);
        }
      });
    };

    var errorData = function() {
      $ctrl.cargando = false;
      notAllowed();
    };

    /**
      Si está en modo consulta solo ve sus reportes
      Si está en modo consulta y es guía ve los del resto
      Si no está en modo consulta ve todos
    */
    if (!$ctrl.consulta || esGuiaActividad()){
      $ctrl.promise = activityService.finLastActivityReports($ctrl.activity.id).then(
        function (response) {
          procesarDatosReportes(response);
          loadMapData();
          reloadPolylines();
        }, function(err) {
          errorData();
        }
      );
    } else if ($ctrl.consulta) {
      $ctrl.promise = activityService.findLastHikerReports($ctrl.activity.id, Auth.getHikerLoggedIn().login).then(
        function (response) {
          //Como está en modo consulta, es el único hiker asociado a la actividad
          $ctrl.hikers = [Auth.isUserLoggedIn()];
          procesarDatosReportes(response);
        }, function(err) {
          errorData();
        }
      );
    }

  };

  var esGuiaActividad = function() {
    var esGuia = false;
    $ctrl.activity.guides.forEach(x => {
      if (x.login == Auth.getHikerLoggedIn().login) {
        esGuia = true;
      }
    });
    return esGuia;
  };

  var assertActivityRunning = function(activityId) {
    $ctrl.promise = activityService.findById(activityId).then(function (response) {
      $ctrl.activity = response;
      if ($ctrl.activity.status != 'RUNNING' && $ctrl.activity.status != 'CLOSED') {
        notAllowed();
      } else {
        /**
          El modo consulta deshabilita funcionalidad de la página
          ver documentación en declaración
        */
        if ($ctrl.activity.status == 'CLOSED') {
          $ctrl.consulta = true;
        }
        uiGmapGoogleMapApi.then(function(){
          loadPageOptions();
          $ctrl.cargando = false;
          $ctrl.hikers = $ctrl.activity.hikers;
          $ctrl.track = TrackService.getActivityTrack($ctrl.activity.track);
          $ctrl.track.icons = [{
            icon: {
                path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
            },
            offset: '25px',
            repeat: '50px'
          }];
          $ctrl.map.center = {
            latitude: $ctrl.track.path[0].latitude,
            longitude: $ctrl.track.path[0].longitude
          };

          cargarActivityReports();
        });
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

  /**
    Muestra la última posición conocida de un hiker
  */
  $ctrl.selectItem = function(item) {
    var report = $ctrl.currentReports.find(x => x.hiker.email == item.email);
    if (report) {
      $ctrl.gmap.panTo(new google.maps.LatLng(report.point.latitude, report.point.longitude));
      var marker = createMarker(item.email, item.email, report.point);
      $ctrl.markers.push(marker);
    }
  };

  /**
    Oculta la última posición conocida de un hiker
  */
  $ctrl.deSelectItem = function(item) {
    var marker;
    var pos = null;
    for (var i = 0; i < $ctrl.markers.length; i++) {
      marker = $ctrl.markers[i];
      if (marker.id == item.email) {
        pos = i;
        break;
      }
    }
    if (pos != null) {
      $ctrl.markers.splice(pos, 1);
    }
  };

  /**
    Función que obtiene el texto para el boton de la trayectoria
  */
  $ctrl.getTrayectoriaText = function(hiker) {
    var trayectoria = $ctrl.trayectorias.find(x => x.id == hiker.email);
    if (!trayectoria || !trayectoria.visible) {
      return 'MOSTRAR TRAYECTORIA';
    } else if (trayectoria.visible){
      return 'OCULTAR TRAYECTORIA';
    }
  };

  /**
    Carga la trayectoria de un excursionista
  */
  $ctrl.cargarTrayectoria = function (hiker) {
    reloadPolylines(hiker);
    $ctrl.cargando = true;
    $ctrl.promise = activityService
      .findAllActivityReportsByHiker($ctrl.activity.id, hiker.email).then(
      function(response) {
        if (response && response.length > 0) {
          insertarTrayectoria(response, hiker.email);
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
    var trayectoria = $ctrl.trayectorias.find(x => x.id == hiker.email);
    if (!trayectoria) {
      $ctrl.cargarTrayectoria(hiker);
    } else {
      trayectoria.visible = !trayectoria.visible;
      $ctrl.puntosTrayectoria.find(x => x.id == trayectoria.id).markers.forEach(x => x.setVisible(trayectoria.visible));
    }
  };

  /**
    Crea una nueva trayectoria sustituyendo en caso de existir la antigua
  */
  var insertarTrayectoria = function(reports, hikerEmail) {
    var trayectoria = $ctrl.trayectorias.find(x => x.id == hikerEmail);
    var exists = trayectoria != undefined;

    if (!exists) {
      trayectoria = {
        id: hikerEmail,
        path: [],
        editable: false,
        draggable: false,
        geodesic: true,
        stroke: {
            color: '#FF0000',
            weight: 1.5
        },
        visible: false,
        icons: [{
          icon: {
              path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
          },
          offset: '25px',
          repeat: '50px'
        }]
      }
    } else {
      trayectoria.path = [];
      //Si existía y era visible
      if (trayectoria.visible) {
        var tray = $ctrl.puntosTrayectoria.find(x => x.id == trayectoria.id);
        if (tray) {
          tray.markers.map(x => x.setVisible(false));
        }
      }
    }

    reports.forEach(x => {
      trayectoria.path.push({
        latitude: x.point.latitude,
        longitude: x.point.longitude
      });
    });

    //Trayectoria de puntos
    var punto = $ctrl.puntosTrayectoria.find(x => x.id == trayectoria.id);
    if (!punto) {
      punto = {
        id: trayectoria.id,
        markers: []
      };
    } else {
      punto.markers = [];
    }

    for (var i = 0; i < trayectoria.path.length; i++) {
      var mark = createPolyLineMarker(
          $ctrl.gmap, new google.maps.LatLng(trayectoria.path[i].latitude, trayectoria.path[i].longitude, true));
      punto.markers.push(mark);
    }
    $ctrl.puntosTrayectoria.push(punto);

    trayectoria.visible = true;
    if (!exists) {
      $ctrl.trayectorias.push(trayectoria);
    }
    var tam = trayectoria.path.length -1;
    if (tam < 0) {
      tam = 0;
    }
    $ctrl.gmap.panTo(new google.maps.LatLng(trayectoria.path[tam].latitude, trayectoria.path[tam].longitude));
  };

  $ctrl.centrarTrack = function() {
      $ctrl.gmap.panTo(new google.maps.LatLng($ctrl.track.path[0].latitude, $ctrl.track.path[0].longitude));
  };

  $ctrl.onShowHideTrack = function() {
    $ctrl.markers[0].options.visible = $ctrl.showMapTrack; // Inicio y fin
    $ctrl.markers[1].options.visible = $ctrl.showMapTrack;
    if (!$ctrl.showMapTrack) {
      for (var i = 0; i < polyMarkers.length; i++) {
          polyMarkers[i].setVisible(false);
      }
    } else {
      var show = map.getZoom() <= 12;
      for (var i = 0; i < polyMarkers.length; i++) {
          polyMarkers[i].setVisible(!show);
      }
    }
  };
}
})();
