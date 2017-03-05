(function() {
'use strict';

angular.module('private')
.config(routeConfig);


/**
  Public routing of the application
*/
routeConfig.$inject = ['$stateProvider', '$locationProvider'];
function routeConfig ($stateProvider, $locationProvider) {
  $stateProvider
    .state('private', {
      abstract: true,
      templateUrl: 'src/common/header/header.html'
    })
    .state('private.actList', {
      url: '/actividades',
      templateUrl : 'src/public/actList/actList.html',
      data: {
        authorization: true
      }
    });
  }
})();
