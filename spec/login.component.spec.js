describe('Login component test', function() {

  var $componentController;
  var hikerService;
  var mdToast;
  var mockScope = {};
  var filter;
  var mockAuth;
  var mdDialog;
  var loginApi;
  var serverUrl;
  var mockService = {
    logIn: function(username, password, call, err) {
      if (username == 'Victor') {
        err({status:401});
      } else {
        call({data:{login:'Victor'}});
      }
    }
  };

  beforeEach(function () {
    mockAuth = {logUser:function(){}, configureHttpAuth:function(){}};

    module('ocam');
    module('public');
    module('common');
    inject(function ($injector, _$componentController_) {
        $componentController = _$componentController_;
        hikerService = $injector.get('hikerService');
        mdToast = $injector.get('$mdToast');
        mdDialog = $injector.get('$mdDialog');
        filter = $injector.get('$filter');
        serverUrl = $injector.get('SERVER_URL');
        loginApi = $injector.get('LOGIN_API');
      });
    });

  it('Debería ocultar la barra de carga con login inválido y mostrar error', function() {
    var ctrl = $componentController('loginForm', {
      hikerService: mockService, $mdToast: mdToast, $scope: mockScope,
      $mdDialog: mdDialog, $filter: filter, Auth: mockAuth});

    ctrl.login();
    expect(ctrl.loading).toBe(false);
    expect(ctrl.errors).toEqual('error.login.credenciales');
  });

  it('Ocultar carga y mostrar error con login incorrecto', function() {
    var ctrl = $componentController('loginForm', {
      hikerService: mockService, $mdToast: mdToast, $scope: mockScope,
      $mdDialog: mdDialog, $filter: filter, Auth: mockAuth});

    ctrl.username = 'Victor';
    ctrl.password = 'Victor';

    ctrl.login();
    expect(ctrl.loading).toBe(false);
    expect(ctrl.errors).toEqual('error.login.credenciales');
  });

  it('Ocultar carga y mostrar error con login correcto', function() {
    var ctrl = $componentController('loginForm', {
      hikerService: mockService, $mdToast: mdToast, $scope: mockScope,
      $mdDialog: mdDialog, $filter: filter, Auth: mockAuth});

    ctrl.username = 'CorrectUsername';
    ctrl.password = 'Victor';

    ctrl.login();
    expect(ctrl.loading).toBe(true);
    expect(ctrl.errors).toEqual(false);
  });
});
