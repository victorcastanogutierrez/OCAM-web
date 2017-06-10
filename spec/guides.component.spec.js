describe('Guides component test', function() {

  var $componentController;
  var $httpBackend;
  var mdDialog;
  var hikerService;
  var mockAuth = {
    getHikerLoggedIn: function() {
      return {};
    }
  };
  var mockService = {
    findByLogin: function(username, password, call, err) {
      if (username == 'Victor') {
        err({status:401});
      } else {
        call({data:{login:'Victor'}});
      }
    }
  };

  beforeEach(function () {
    module('ocam');
    module('public');
    module('common');
    inject(function ($injector, _$componentController_) {
        $componentController = _$componentController_;
        mdDialog = $injector.get('$mdDialog');
        hikerService = $injector.get('hikerService');
        $httpBackend = $injector.get('$httpBackend');
    });
    $httpBackend.expectGET("https://ocamserver.herokuapp.com/pendingActivities/0/10").respond({});;
    $httpBackend.expectGET("https://ocamserver.herokuapp.com/countPendingActivities").respond({});
    $httpBackend.expectGET("src/common/header/header.html").respond({});
    $httpBackend.expectGET("src/common/actList/actList.html").respond({});
  });

  it('Debería añadirse a sí mismo como guía al no entrar en modo edición', function() {
    var count = 0;
    var bindings = {
      onAdd: function() {count++;}
    };
    var ctrl = $componentController('guidesSelection', {
      $mdDialog: mdDialog, hikerService: mockService, Auth: mockAuth}, bindings);
    expect(count).toEqual(1);
  });

  it('Debería añadir al guía de forma correcta', function() {
    var count = 0;
    var bindings = {
      onAdd: function(guide) {count++;}
    };
    $httpBackend.whenGET('https://ocamserver.herokuapp.com/api/existshiker/Victor')
      .respond(200, {});
    var ctrl = $componentController('guidesSelection', {
      $mdDialog: mdDialog, hikerService: hikerService, Auth: mockAuth}, bindings);
    ctrl.confirmarNuevoGuia('Victor');
    expect(ctrl.guidesError).toEqual("");
    $httpBackend.flush();
  });
});
