(function () {
"use strict";

angular.module('common')
.service('translateService', translateService);

/**
  Servicio encargado de i18n
*/
translateService.$inject = ['$translate'];
function translateService($translate) {

  var service = this;

  service.getLanguages = function() {
    return [
      {
        name: "Español",
        code: "es-ES"
      },
      {
        name: "Inglés",
        code: "en-GB"
      }
    ]
  };

  service.setLanguage = function(code) {
    $translate.use(code);
  };
}
})();
