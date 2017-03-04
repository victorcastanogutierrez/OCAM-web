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
      templateUrl : 'src/public/actList/actList.html',
      data: {
        authorization: false
      }
    })
    .state('public.access', {
      url: '/access',
      templateUrl : 'src/public/access/access.html',
      data: {
        authorization: false
      }
    });
  }
})();
