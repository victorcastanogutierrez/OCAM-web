(function () {
'use strict';

angular.module('private')
.component('toolsOptions', {
  controller: ToolsController,
  controllerAs: 'toolsCtrl',
  templateUrl: 'src/private/activity/tools/tools.component.html',
  bindings: {
    activity: '<',
    onError: '&',
    onLoading: '&',
    monitorizar: '&'
  }
});

ToolsController.$inject = ['$scope', '$timeout', '$state', 'activityService',
  '$mdDialog'];
function ToolsController($scope, $timeout, $state, activityService,
  $mdDialog) {
  var $ctrl = this;

  var editActivity = function() {
    $state.go("private.newActivity", {activity: $ctrl.activity});
  };

  var deleteActivity = function() {
    $ctrl.onLoading({loading : true});

    var success = function() {
      $ctrl.activity.deleted = true;
      activityService.save($ctrl.activity, function(response) {
        $ctrl.onLoading({loading : false});
        $state.go("private.actList");
      }, function(err) {
        $ctrl.onLoading({loading : false});
        $ctrl.onError({error : err.message})
      });
    }

    var confirm = $mdDialog.confirm()
          .title('¿Estás seguro de eliminar la actividad?')
          .textContent('No habrá vuelta atrás, todos los datos relativos a la actividad se eliminarán.')
          .ok('Eliminar')
          .cancel('Cancelar');

    $mdDialog.show(confirm).then(function() {
      success();
    });
  }

  var isActivityPending = function() {
    return $ctrl.activity && $ctrl.activity.status == 'PENDING';
  };

  var isActivityClosed = function() {
    return $ctrl.activity && $ctrl.activity.status == 'CLOSED';
  };

  $ctrl.edit = true;
  $ctrl.items = [
    { name: "Editar", icon: "mode_edit", direction: "bottom",
      action: editActivity, disabled: isActivityClosed()},
    { name: "Monitorizar", icon: "visibility", direction: "top",
      action: $ctrl.monitorizar, disabled: isActivityClosed()},
    { name: "Eliminar", icon:"delete_forever", direction: "bottom",
      action: deleteActivity, disabled: !isActivityPending() || isActivityClosed()}
  ];
  $ctrl.hidden = false;
  $ctrl.isOpen = false;
  $ctrl.hover = false;

  $scope.$watch('toolsCtrl.isOpen', function(isOpen) {
    if (isOpen) {
      $timeout(function() {
        $ctrl.tooltipVisible = $ctrl.isOpen;
      }, 350);
    } else {
      $ctrl.tooltipVisible = $ctrl.isOpen;
    }
  });

  $ctrl.optionClicked = function(item) {
    if (item.action) {
      item.action();
    }
  };
}
})();
