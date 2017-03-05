(function () {
'use strict';

angular.module('common')
.controller('headerController', headerController);

headerController.$inject = ['Auth', '$rootScope', '$state'];
function headerController(Auth, $rootScope, $state) {
  var $ctrl = this;

  $ctrl.currentNavItem = $state.current.name;
  $ctrl.user = Auth.isUserLoggedIn() || false;

  //Listener para cuando un usuario hace login o cierra sesión
  var listener;

  $ctrl.$onInit = function() {
    listener = $rootScope.$on('user:logs', onUserStateChange);
  };

  $ctrl.$onDestroy = function() {
    listener();
  };

  function onUserStateChange(event, data) {
    // Cargamos el nuevo estado del usuario
    $ctrl.user = data.logged;
  }
}

})();
