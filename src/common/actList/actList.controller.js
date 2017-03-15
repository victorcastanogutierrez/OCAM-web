(function () {
'use strict';

angular.module('common')
.controller('activityListController', activityListController)
.constant('DEFAULT_ITEM_PER_PAGE', 5);

/**
  Controlador que encapsula la lógica de la tabla de actividades.

  Realiza una búsqueda de las actividades bajo demanda. Buscará todas aquellas
  actividades hasta la página seleccionada, teniendo inyectado por parámetro el
  máximo de actividades existentes.

*/
activityListController.$inject = ['list', 'numEle', 'activityService', '$q',
  'DEFAULT_ITEM_PER_PAGE', '$state'];
function activityListController(list, numEle, activityService, $q,
    DEFAULT_ITEM_PER_PAGE, $state) {

  var $ctrl = this;

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
  // búsqueda en cada momento
  $ctrl.numEle = numEle;
  // Array que indica que páginas están ya descargadas
  $ctrl.cached = [true];

  // Callback que maneja el cambio de página
  $ctrl.onPageChange = function() {
    if ($ctrl.page != $ctrl.oldPage) {
      //Auxiliar para no perder el valor
      var oldP = $ctrl.oldPage;
      //Actualizamos el nuevo valor con la página nueva
      $ctrl.oldPage = $ctrl.page;
      //Comprueba si tenemos que cargar o no más elementos
      //en cuyo caso cargaríamos todos hasta la página necesaria
      if (!$ctrl.cached[$ctrl.page]) {

        var deferred = $q.defer();
        $ctrl.promise = deferred.promise;

        var nItemsFrom = (oldP * 5) ;
        var nItemsTo = ($ctrl.page * 5);

        activityService.findAllPending(nItemsFrom, nItemsTo, function(res) {
          $ctrl.activities = $ctrl.activities.concat(res);
          //Marcamos como cacheadas las páginas que hemos descargado
          for (var i = oldP; i <= $ctrl.page; i++) {
            $ctrl.cached[i] = true;
          }
          deferred.resolve();
        });
      }
    }
  }

  /**
    Callback que maneja la selección de un item de la lista
  */
  $ctrl.selectItem = function(item) {
    console.log("Selecciona");
  }

  $ctrl.seeActivityDetails = function() {
    $state.go('private.activity')
  }
}

})();
