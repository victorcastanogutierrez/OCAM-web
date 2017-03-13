(function () {
'use strict';

angular.module('private')
.controller('profileController', profileController);

profileController.$inject = ['userData'];
function profileController(userData) {
  var $ctrl = this;

  $ctrl.user = userData;

  $ctrl.prueba = "asd";

}

})();
