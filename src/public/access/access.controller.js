(function () {
'use strict';

angular.module('public')
.controller('accessController', accessController);

accessController.$inject = ['$stateParams', '$mdDialog', '$translate',
  '$translatePartialLoader'];
function accessController($stateParams, $mdDialog, $translate,
  $translatePartialLoader) {

  var $ctrl = this;
  var code = $stateParams.code;
  $ctrl.showError = $stateParams.showError;
  $translatePartialLoader.addPart('access');
  $translatePartialLoader.addPart('errors');
  $translate.refresh();

  var showDialog = function() {
    $mdDialog.show({
      controller: 'AccountController',
      controllerAs: 'AccountCtrl',
      templateUrl: 'src/public/access/account/accountdialog.template.html',
      parent: angular.element(document.body),
      clickOutsideToClose: false,
      locals : {
        'code' : code
      }
    })
    .then(function() {
      console.log("llegue ");
    });
  }

  if (code) {
    $ctrl.loading = true;
    showDialog();
  }

}

})();
