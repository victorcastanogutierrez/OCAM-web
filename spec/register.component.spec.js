describe('Register component test', function() {

  var $componentController;
  var emailFormat;
  var mdDialog;
  var mockService = {
    register: function(user, call, err) {
      if (user.username != 'Victor') {
        err({message:'registro invalido'});
      }
    }
  };

  beforeEach(function () {
    module('ocam');
    module('public');
    module('common');
    inject(function ($injector, _$componentController_) {
        $componentController = _$componentController_;
        emailFormat = $injector.get('EMAIL_FORMAT');
        mdDialog = $injector.get('$mdDialog');
    });
  });

  it('Debería mostrar error de passwords', function() {
    var ctrl = $componentController('registerForm', {
      hikerService: mockService, EMAIL_FORMAT: emailFormat, $mdDialog: mdDialog});
    ctrl.password = "password1";
    ctrl.repassword = "password2";
    ctrl.register();
    expect(ctrl.errors).toEqual("Las contraseñas no coinciden.");
  });

  it('Debería mostrar error en el registro por datos inválidos', function() {
    var ctrl = $componentController('registerForm', {
      hikerService: mockService, EMAIL_FORMAT: emailFormat, $mdDialog: mdDialog});
    ctrl.username = 'Nombre invalido';
    ctrl.password = 'password';
    ctrl.repassword = 'password';
    ctrl.register();
    expect(ctrl.errors).toEqual('registro invalido');
  });

  it('No debería haber errores. Registro correcto', function() {
    var ctrl = $componentController('registerForm', {
      hikerService: mockService, EMAIL_FORMAT: emailFormat, $mdDialog: mdDialog});
    ctrl.username = 'Victor';
    ctrl.password = 'password';
    ctrl.repassword = 'password';
    ctrl.register();
    expect(ctrl.errors).toEqual(false);
  });
});
