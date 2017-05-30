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

FilterListController.$inject = ['Auth', '$filter', '$translate', '$rootScope'];
function FilterListController(Auth, $filter, $translate, $rootScope) {
  var $ctrl = this;
  $ctrl.loggedIn = Auth.isUserLoggedIn();
  $translate.refresh();

  var getList = function() {
    return [
      {
        name: 'Actividades pendientes',
        //name : $filter('translate')('actlist.opciones.pendientes'),
        id : 0
      },
      {
        name: 'Actividades realizadas',
        //name : $filter('translate')('actlist.opciones.realizadas'),
        id: 1
      }
    ];
  };
  $ctrl.availableLists = getList();
  $ctrl.listSelected = $ctrl.availableLists[0];

  var languageChanges = function() {
    $ctrl.availableLists = getList();
  };

  var listener;
  $ctrl.$onInit = function() {
    listener = $rootScope.$on('language:changes', languageChanges);
  };

  $ctrl.$onDestroy = function() {
    listener();
  };
}


})();
