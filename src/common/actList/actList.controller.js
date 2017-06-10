(function () {
'use strict';

angular.module('common')
.controller('activityListController', activityListController)
.constant('DEFAULT_ITEM_PER_PAGE', 10);

/**
  Controlador que encapsula la lógica de la tabla de actividades.

  Realiza una búsqueda de las actividades bajo demanda. Buscará todas aquellas
  actividades hasta la página seleccionada, teniendo inyectado por parámetro el
  máximo de actividades existentes.

*/
activityListController.$inject = ['list', 'numEle', 'activityService', '$q',
  'DEFAULT_ITEM_PER_PAGE', '$state', 'Auth', '$mdDialog', '$translatePartialLoader',
  '$filter', '$rootScope'];
function activityListController(list, numEle, activityService, $q,
    DEFAULT_ITEM_PER_PAGE, $state, Auth, $mdDialog, $translatePartialLoader,
    $filter,  $rootScope) {

  var $ctrl = this;
  $translatePartialLoader.addPart('actlist');

  var languageChanges = function() {
    $state.reload();
  };

  var listener;
  $ctrl.$onInit = function() {
    listener = $rootScope.$on('language:changes', languageChanges);
  };

  $ctrl.$onDestroy = function() {
    listener();
  };

  // Source: http://stackoverflow.com/questions/497790
  var dates = {
    convert:function(d) {
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0],d[1],d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year,d.month,d.date) :
            NaN
        );
    },
    compare:function(a,b) {
      return (
        isFinite(a=this.convert(a).valueOf()) &&
        isFinite(b=this.convert(b).valueOf()) ?
        (a>b)-(a<b) :
        NaN
      );
    }
  }

  //Constantes para diferenciar entre las dos listas de actividades posibles
  //no permitimos mezclar
  var ID_LIST_PENDING = 0;
  var ID_LIST_DONE = 1;

  $ctrl.listSelected = ID_LIST_PENDING;

  //Array de elementos seleccionados
  // (no utilizado pero requerido por la libreria)
  $ctrl.selected = [];

  //Flags de control
  $ctrl.fl_refreshing = false;
  $ctrl.fl_create_allowed = Auth.isUserLoggedIn();

  //Callback que se ejecuta al seleccionar un elemento de la lista
  $ctrl.onSelect = function (item) {
    if ($ctrl.fl_create_allowed) {
      $state.go("private.activity", {activity: item});
    } else {
      var login = $mdDialog.confirm()
            .title($filter('translate')('actlist.dialog.detalle.titulo'))
            .textContent($filter('translate')('actlist.dialog.detalle.contenido'))
            .ok($filter('translate')('actlist.dialog.detalle.login'))
            .cancel($filter('translate')('actlist.dialog.detalle.cancelar'));

      $mdDialog.show(login).then(function() {
        $state.go('public.access');
      });
    }
  };


  //Actualiza los datos
  $ctrl.refreshData = function() {
    $ctrl.fl_refreshing = true;
    //Recarga el número de actividades total
    if ($ctrl.listSelected == ID_LIST_PENDING) {
      $ctrl.promise = activityService.findCountAll().then(function success(response) {
console.log(response);
        $ctrl.numEle = response;

        //Recarga las actividades
        activityService.findAllPending(0, DEFAULT_ITEM_PER_PAGE).then(function success(response) {
          $ctrl.activities = response.sort((x, y) => dates.compare(new Date(y.startDate), new Date(x.startDate)));
          $ctrl.fl_refreshing = false;
        });
      });
    } else {
      $ctrl.promise = activityService.findAllDoneByHiker(Auth.getHikerLoggedIn().login).then(function success(response) {
        $ctrl.numEle = response.length;
        $ctrl.activities = response.sort((x, y) => dates.compare(new Date(y.startedDate), new Date(x.startedDate)));
        $ctrl.fl_refreshing = false;
      });
    }
  };

  // Configuración de la paginación
  // Lista de actividades
  $ctrl.activities = list;
  // Página seleccionada en todo momento
  $ctrl.page = 1;
  // Variable auxiliar para manejar el cambio de página
  $ctrl.oldPage = 1;
  // Máximo de elementos por página
  $ctrl.itemsPage = DEFAULT_ITEM_PER_PAGE;
  // Número de actividades existentes en el servidor bajo los criterios de
  // búsqueda en cada momento. Utilizado en la pagina html md-total
  $ctrl.numEle = numEle;
  // Array que indica que páginas están ya descargadas
  $ctrl.cached = [true];

  // Callback que maneja el cambio de página
  $ctrl.onPageChange = function() {
    if ($ctrl.page != $ctrl.oldPage && $ctrl.listSelected == ID_LIST_PENDING) {
      //Auxiliar para no perder el valor
      var oldP = $ctrl.oldPage;
      //Actualizamos el nuevo valor con la página nueva
      $ctrl.oldPage = $ctrl.page;
      //Comprueba si tenemos que cargar o no más elementos
      //en cuyo caso cargaríamos todos hasta la página necesaria
      if (!$ctrl.cached[$ctrl.page]) {

        var nItemsFrom = (oldP * $ctrl.itemsPage) ;
        var nItemsTo = ($ctrl.page * $ctrl.itemsPage);

        $ctrl.promise = activityService.findAllPending(nItemsFrom, nItemsTo,
          function(res) {
            $ctrl.activities = $ctrl.activities.concat(res);
            //Marcamos como cacheadas las páginas que hemos descargado
            for (var i = oldP; i <= $ctrl.page; i++) {
              $ctrl.cached[i] = true;
            }
          });
      }
    }
  };

  /**
    Listener ejecutado desde el component filtercomponent
    al cambiar de lista en el desplegable
  */
  $ctrl.onListSelect = function(list) {
    $ctrl.listSelected = list.id;
    $ctrl.refreshData();
  };

  /**
    Función que obtiene el string a mostrar
    según el estado de la actividad
  */
  $ctrl.getStatus = function(status) {
    if (status == 'RUNNING') {
      return $filter('translate')('actlist.estado.encurso');
    } else if (status == 'PENDING') {
      return $filter('translate')('actlist.estado.pendiente');
    } else if (status == 'CLOSED') {
      return $filter('translate')('actlist.estado.realizada');
    }
  };
}

})();
