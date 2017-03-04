(function () {
'use strict';

angular.module('common')
.controller('headerController', headerController);

function headerController() {
  var $ctrl = this;

  $ctrl.currentNavItem = "activities";
}

})();
