(function () {
'use strict';

angular.module('public')
.component('errorsComponent', {
  transclude: true,
  templateUrl: 'src/public/access/errors/errors.template.html',
  bindings: {
    msg: '<',
    loadingbar: '<'
  }
});

})();
