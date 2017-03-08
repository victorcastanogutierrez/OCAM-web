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
      controller: 'activityListController',
      controllerAs: 'actListCtrl',
      templateUrl : 'src/common/actList/actList.html',
      data: {
        authorization: true
      },
      resolve: {
        'list': ['activityService', function(activityService) {
          return activityService.findAllPending();
        }]
      }
    });
  }
})();
