(function () {
'use strict';

angular.module('private')
.controller('mapControls', mapControls);

mapControls.$inject = ['mapService', '$scope', '$rootScope'];
function mapControls(mapService, $scope, $rootScope) {

  $scope.maps = mapService.getMapTypes();

  $scope.selectMap = function(index) {
    $rootScope.$broadcast('mapChange', index);
  }
}

})();
