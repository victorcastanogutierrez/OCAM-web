(function () {
'use strict';

angular.module('private')
.component('toolsOptions', {
  controller: ToolsController,
  controllerAs: 'toolsCtrl',
  templateUrl: 'src/private/activity/tools/tools.component.html',
  bindings: {
    activity: '<'
  }
});

ToolsController.$inject = ['$scope', '$timeout', '$state'];
function ToolsController($scope, $timeout, $state) {
  var $ctrl = this;

  var editActivity = function() {
    $state.go("private.newActivity", {activity: $ctrl.activity});
  };

  $ctrl.edit = true;
  $ctrl.items = [
    { name: "Editar", icon: "mode_edit", direction: "bottom", action: editActivity},
    { name: "Monitorizar", icon: "visibility", direction: "top" },
    { name: "Eliminar", icon:"delete_forever", direction: "bottom"}
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
