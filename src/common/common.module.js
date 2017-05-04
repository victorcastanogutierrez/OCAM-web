(function() {
"use strict";

angular.module('common', ['base64', 'ngStorage', 'ui.router'])
.constant('SERVER_URL', 'https://ocamserver.herokuapp.com')
//.constant('SERVER_URL', 'https://localhost:8443')
.constant('LOGIN_API', '/api/auth/login')
.constant('REGISTER_API', '/hiker')
.constant('PENDING_ACTIVITIES_API', '/pendingActivities')
.constant('COUNT_PENDING_ACTIVITIES_API', '/countPendingActivities')
.constant('HIKER_DATA', '/api/hiker')
.constant('HIKER_CHANGE_PASSWORD', '/api/hiker/changePassword')
.constant('SAVE_ACT_API', '/api/activity/save')
.constant('EXISTS_LOGIN_API', '/api/existshiker')
.constant('CHECK_ACTIVITY_PASSWORD_API', '/api/activity/checkPassword')
.constant('ACTIVITY_FIND_BY_ID', '/api/activity')
.constant('ACTIVITY_LAST_REPORTS', '/api/lastActivityReports')
.constant('HIKER_ALL_REPORTS', '/api/activityHikerReports')
.constant('HIKER_VALIDATE', '/validateHiker')
.constant('FIND_HIKER_ACTIVITIES_DONE', '/api/findHikerFinishActivities')
.constant('ACTIVITY_HIKER_LAST_REPORT', '/api/findLastHikerActivityReport')
.constant('DELETE_HIKER', '/api/hiker/delete')
.constant('RESET_PASSWORD', '/hiker/resetPassword')
.config(CommonConfig)
.run(configErrorHandler);

CommonConfig.$inject = ['$httpProvider']
function CommonConfig($httpProvider) {
  $httpProvider.interceptors.push('loadingHttpInterceptor');
  $httpProvider.interceptors.push('errorHandlerInterceptor');
}

/**
  Evento llamado desde httphandler.interceptor con el código de error
  HTTP.
*/
configErrorHandler.$inject = ['$rootScope', '$state'];
function configErrorHandler($rootScope, $state) {
    $rootScope.$on('errorHandler', (event, argument) => {
      var code = argument.code;
      if (String(code).startsWith("5") || code == "404") {
        $state.go("public.access", {showError: "Ocurrió un error inesperado. Prueba de nuevo más tarde"});
      } else if (code == "403") {
        $state.go("public.access", {showError: "La sesión caducó"});
      }
    });
}
})();
