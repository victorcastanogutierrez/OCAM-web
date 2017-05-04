(function () {
'use strict';

angular.module('public')
.controller('accessController', accessController);

accessController.$inject = ['$stateParams', '$mdDialog'];
function accessController($stateParams, $mdDialog) {

  var $ctrl = this;
  var code = $stateParams.code;
  $ctrl.showError = $stateParams.showError;

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
