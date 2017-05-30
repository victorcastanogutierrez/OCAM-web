(function () {
'use strict';

angular.module('common')
.controller('headerController', headerController);

headerController.$inject = ['Auth', '$rootScope', '$state', 'translateService',
  '$translatePartialLoader', '$translate'];
function headerController(Auth, $rootScope, $state, translateService,
  $translatePartialLoader, $translate) {
  var $ctrl = this;

  $ctrl.currentNavItem = $state.current.name;
  $ctrl.user = Auth.isUserLoggedIn() || false;
  $ctrl.languages = translateService.getLanguages();
  $translatePartialLoader.addPart('toolbar');
  $translate.refresh();

  $ctrl.onLangSelect = function(code) {
    translateService.setLanguage(code);
  };

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
