(function () {
'use strict';

angular.module('private')
.component('toolsOptions', {
  controller: ToolsController,
  controllerAs: 'toolsCtrl',
  templateUrl: 'src/private/activity/tools/tools.component.html',
  bindings: {
  }
});

ToolsController.$inject = ['$scope', '$timeout'];
function ToolsController($scope, $timeout) {
  var $ctrl = this;

  $ctrl.edit = true;

  $ctrl.items = [
        { name: "Editar", icon: "mode_edit", direction: "bottom" },
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
}
})();
