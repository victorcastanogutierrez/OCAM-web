describe('Hiker service test', function () {

  var $httpBackend;
  var hikerService;
  var serverUrl;
  var loginApi;
  var registerApi;
  var hikerData;
  var changePassword;
  var loginExists;
  var validateHiker;
  var deleteHiker;
  var resetPassword;

  var mockUser = {
    token: '356456456',
    refreshToken: 'asfasdfdas242324234',
    email: 'victor@victor.com',
    login: 'victor'
  };

  beforeEach(module('stateMock'));
  beforeEach(function () {
    module('common');
    inject(function ($injector, _$state_) {
      hikerService = $injector.get('hikerService');
      $httpBackend = $injector.get('$httpBackend');
      serverUrl = $injector.get('SERVER_URL');
      loginApi = $injector.get('LOGIN_API');
      registerApi = $injector.get('REGISTER_API');
      hikerData = $injector.get('HIKER_DATA');
      changePassword = $injector.get('HIKER_CHANGE_PASSWORD');
      loginExists = $injector.get('EXISTS_LOGIN_API');
      validateHiker = $injector.get('HIKER_VALIDATE');
      deleteHiker = $injector.get('DELETE_HIKER');
      resetPassword = $injector.get('RESET_PASSWORD');
    });
  });

  it('Test $http login', function() {
    $httpBackend.whenPOST(serverUrl + loginApi).respond(mockUser);
    hikerService.logIn('', '', function(response) {
      expect(response.data).toEqual(mockUser);
    });
    $httpBackend.flush();
  });

  it('Test $http registro', function() {
    var mockResponse = { data: { code: 201 } };
    $httpBackend.whenPOST(serverUrl + registerApi).respond(mockResponse);
    hikerService.register(mockUser, function(response) {
      expect(response.data).toEqual(mockResponse.data);
    });
    $httpBackend.flush();
  });

  it('Test $http datos hiker', function() {
    $httpBackend.whenGET(serverUrl + hikerData + '/').respond(mockUser);
    hikerService.getHikerData('').then(function(response) {
      expect(response).toEqual(mockUser);
    });
    $httpBackend.flush();
  });

  it('Test $http cambio password', function() {
    $httpBackend.whenPOST(serverUrl + changePassword).respond(mockUser);
    hikerService.changePassword(mockUser, function(response) {
      expect(response).toEqual(mockUser);
    });
    $httpBackend.flush();
  });

  it('Test $http buscar hiker', function() {
    $httpBackend.whenGET(serverUrl + loginExists + '/' + mockUser.email).respond(mockUser);
    hikerService.findByLogin(mockUser.email).then(function(response) {
      expect(response).toEqual(mockUser);
    });
    $httpBackend.flush();
  });

  it('Test $http validar hiker', function() {
    $httpBackend.whenPOST(serverUrl + validateHiker).respond(mockUser);
    hikerService.validateHiker(mockUser, function(response) {
      expect(response).toEqual(mockUser);
    });
    $httpBackend.flush();
  });

  it('Test $http eliminar hiker', function() {
    $httpBackend.whenPOST(serverUrl + deleteHiker + '/' + mockUser.login).respond(mockUser);
    hikerService.deleteHiker(mockUser.login, function(response) {
      expect(response).toEqual(mockUser);
    });
    $httpBackend.flush();
  });

  it('Test $http resetear password', function() {
    $httpBackend.whenPOST(serverUrl + resetPassword).respond(mockUser);
    hikerService.resetPassword(mockUser, function(response) {
      expect(response).toEqual(mockUser);
    });
    $httpBackend.flush();
  });
});
