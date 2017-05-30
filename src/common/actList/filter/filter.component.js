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

FilterListController.$inject = ['Auth', '$filter'];
function FilterListController(Auth, $filter) {
  var $ctrl = this;

  $ctrl.loggedIn = Auth.isUserLoggedIn();
  $ctrl.availableLists = [
    {
      name : $filter('translate')('actlist.opciones.pendientes'),
      id : 0
    },
    {
      name : $filter('translate')('actlist.opciones.realizadas'),
      id: 1
    }
  ];
  $ctrl.listSelected = $ctrl.availableLists[0];
}


})();
