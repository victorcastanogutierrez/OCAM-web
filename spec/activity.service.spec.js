describe('Activity service test', function () {

  var $httpBackend;
  var activityService;
  var serverUrl;

  var pending;
  var countPending;
  var saveActivity;
  var checkPassword;
  var find;
  var lastReports;
  var allReports;
  var actDone;
  var lastReport;

  var mockAct = {
    id: 32121,
    password: 'asd',
    shortDescription: 'jkbnasdjasjdb',
    longDescription: ' jbasdjbasbjkdabjkdsbjkasdbjkasbjdkabjkd',
    track: '<gpx></gpx>',
    mide: 'http://google.es',
    maxPlaces: 10,
    startDate: '10/010/2017',
    startedDate: '10/12/2017'
  };

  beforeEach(module('stateMock'));
  beforeEach(function () {
    module('common');
    inject(function ($injector, _$state_) {
      activityService = $injector.get('activityService');
      $httpBackend = $injector.get('$httpBackend');
      serverUrl = $injector.get('SERVER_URL');
      pending = $injector.get('PENDING_ACTIVITIES_API');
      countPending = $injector.get('COUNT_PENDING_ACTIVITIES_API');
      saveActivity = $injector.get('SAVE_ACT_API');
      checkPassword = $injector.get('CHECK_ACTIVITY_PASSWORD_API');
      find = $injector.get('ACTIVITY_FIND_BY_ID');
      lastReports = $injector.get('ACTIVITY_LAST_REPORTS');
      allReports = $injector.get('HIKER_ALL_REPORTS');
      actDone = $injector.get('FIND_HIKER_ACTIVITIES_DONE');
      lastReport = $injector.get('ACTIVITY_HIKER_LAST_REPORT');
    });
  });

  it('Test $http pendientes', function() {
    $httpBackend.whenGET(serverUrl + pending + '/' + 1 + '/' + 0).respond({data:mockAct});
    activityService.findAllPending(1, 0, function(response) {
      expect(response.data).toEqual(mockAct);
    });
    $httpBackend.flush();
  });

  it('Test $http total actividades', function() {
    $httpBackend.whenGET(serverUrl + countPending).respond({data:10});
    activityService.findCountAll().then(function(response) {
      expect(response.data).toEqual(10);
    });
    $httpBackend.flush();
  });

  it('Test $http nueva actividad', function() {
    $httpBackend.whenPOST(serverUrl + saveActivity).respond({data:201});
    activityService.save(mockAct, function(response) {
      expect(response.data).toEqual(201);
    });
    $httpBackend.flush();
  });

  it('Test $http comprobación password', function() {
    $httpBackend.whenGET(serverUrl + checkPassword + '/' + mockAct.id + '/' + mockAct.password).respond(mockAct);
    activityService.checkPassword(mockAct.id, mockAct.password).then(function(response) {
      expect(response).toEqual(mockAct);
    });
    $httpBackend.flush();
  });

  it('Test $http buscar por Id', function() {
    $httpBackend.whenGET(serverUrl + find + '/' + mockAct.id).respond({data:mockAct});
    activityService.findById(mockAct.id).then(function(response) {
      expect(response.data).toEqual(mockAct);
    });
    $httpBackend.flush();
  });

  it('Test $http ultimos reportes', function() {
    $httpBackend.whenGET(serverUrl + lastReports + '/' + mockAct.id).respond({data:mockAct});
    activityService.finLastActivityReports(mockAct.id).then(function(response) {
      expect(response.data).toEqual(mockAct);
    });
    $httpBackend.flush();
  });

  it('Test $http todos los reportes de un hiker', function() {
    $httpBackend.whenGET(serverUrl + allReports + '/' + mockAct.id + '/' + 'email').respond({data:mockAct});
    activityService.findAllActivityReportsByHiker(mockAct.id, 'email').then(function(response) {
      expect(response.data).toEqual(mockAct);
    });
    $httpBackend.flush();
  });

  it('Test $http todos los reportes de un hiker', function() {
    $httpBackend.whenGET(serverUrl + actDone + '/' + 'login').respond({data:mockAct});
    activityService.findAllDoneByHiker('login').then(function(response) {
      expect(response.data).toEqual(mockAct);
    });
    $httpBackend.flush();
  });

  it('Test $http todos los ultimos reportes', function() {
    $httpBackend.whenGET(serverUrl + lastReport + '/' + mockAct.id + '/' + 'login').respond({data:mockAct});
    activityService.findLastHikerReports(mockAct.id, 'login').then(function(response) {
      expect(response.data).toEqual(mockAct);
    });
    $httpBackend.flush();
  });
});
