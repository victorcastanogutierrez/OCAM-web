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
      url: '/activities',
      controller: 'activityListController',
      controllerAs: 'actListCtrl',
      templateUrl : 'src/common/actList/actList.html',
      data: {
        authorization: true
      },
      resolve: {
        'list': ['activityService', function(activityService) {
          return activityService.findAllPending(0, 5);
        }],
        'numEle': ['activityService', function(activityService) {
          return activityService.findCountAll();
        }]
      }
    })
    .state('private.profile', {
      url: '/profile',
      controller: 'profileController',
      controllerAs: 'profileCtrl',
      templateUrl : 'src/private/profile/profile.template.html',
      data: {
        authorization: true
      },
      resolve: {
        'userData': ['Auth', 'hikerService', function(Auth, hikerService) {
          var user = Auth.isUserLoggedIn();
          return hikerService.getHikerData(user.username);
        }]
      }
    })
    .state('private.activity', {
      url: '/activity',
      controller: 'activityController',
      controllerAs: 'activityCtrl',
      templateUrl : 'src/private/activity/activity.template.html',
      data: {
        authorization: true
      },
      params: {
        activity: null
      }
    });
  }
})();
