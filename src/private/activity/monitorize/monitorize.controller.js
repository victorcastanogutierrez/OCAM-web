(function () {
'use strict';

angular.module('private')
.controller('monitorizeController', monitorizeController);

monitorizeController.$inject = ['$stateParams', '$state', 'activityService',
  '$scope'];
function monitorizeController($stateParams, $state, activityService, $scope) {
  var $ctrl = this;

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
  $ctrl.fl_refreshing = false;

  /**
    Comprueba que se haya pasado una id por parametro, que la actividad
    exista y que esté en estado RUNNING
  */
  var activityId = $stateParams.activityId;
  var notAllowed = function() {
    $state.go('private.actList');
  };
  var assertActivityRunning = function(activityId) {
    activityService.findById(activityId).then(function (response) {
      $ctrl.activity = response;
      $ctrl.cargando = false;
      $ctrl.hikers = $ctrl.activity.hikers;
      if (!$ctrl.activity.status == 'RUNNING') {
        notAllowed();
      } else {
        loadPageOptions();
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
    $ctrl.initialRowLimit = total;
  };

  var updateHikers = function() {
    if ($ctrl.activity) {
      $ctrl.hikers = $ctrl.activity.hikers.filter(x => x.email.includes($scope.mailFilter));
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

    $ctrl.promise = activityService.findById(activityId).then(function (response) {
      $ctrl.activity = response;
      $ctrl.cargando = false;
      $ctrl.page = 1;
      $ctrl.hikers = $ctrl.activity.hikers;
      if (!$ctrl.activity.status == 'RUNNING') {
        notAllowed();
      } else {
        loadPageOptions();
      }
    }, function() {
      $ctrl.cargando = false;
      notAllowed();
    });
  };
}
})();
