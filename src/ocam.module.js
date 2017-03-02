(function() {
"use strict";

/**
Application main module
*/
angular.module('ocam', ['public', 'common', 'ngMaterial'])
.config(config);

config.$inject = ['$urlRouterProvider'];
function config($urlRouterProvider) {

  // If user goes to a path that doesn't exist, redirect to public root
  $urlRouterProvider.otherwise('/');
}

})();
