(function() {
'use strict';

angular.module('public')
.config(routeConfig);


/**
  Public routing of the application
*/
routeConfig.$inject = ['$stateProvider', '$locationProvider'];
function routeConfig ($stateProvider, $locationProvider) {
  $stateProvider
    .state('public', {
      abstract: true,
      templateUrl: 'src/common/header/header.html'
    })
    .state('public.actList', {
      url: '/',
      controller: 'activityListController',
      controllerAs: 'actListCtrl',
      templateUrl : 'src/common/actList/actList.html',
      data: {
        authorization: false
      },
      //Inyecta en el controlador las primeras actividades y el número total
      resolve: {
        'list': ['activityService', function(activityService) {
          return activityService.findAllPending(0, 10);
        }],
        'numEle': ['activityService', function(activityService) {
          return activityService.findCountAll();
        }]
      }
    })
    .state('public.access', {
      url: '/access/:code',
      controller: 'accessController',
      controllerAs: 'accessCtrl',
      templateUrl : 'src/public/access/access.html',
      data: {
        authorization: false
      },
      params: {
        showError: null
      }
    });
  }
})();
