(function () {
'use strict';

angular.module('common')
.component('filterList', {
  controller: FilterListController,
  controllerAs: 'filterCtrl',
  templateUrl: 'src/common/actList/filter/filter.component.html',
  bindings: {
    onSelect: '&'
  }
});

FilterListController.$inject = [];
function FilterListController() {
  var $ctrl = this;

  $ctrl.availableLists = [
    {
      name : 'Actividades pendientes',
      id : 0
    },
    {
      name : 'Mis actividades realizadas',
      id: 1
    }
  ];
  $ctrl.listSelected = $ctrl.availableLists[0];
}


})();
