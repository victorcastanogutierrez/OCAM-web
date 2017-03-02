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
      templateUrl : 'src/public/actList/actList.html'
    })
    .state('public.login', {
      url: '/login',
      templateUrl : 'src/public/login/login.html',
      controller: 'loginController',
      controllerAs: 'loginCtrl'
    });
  }
})();
