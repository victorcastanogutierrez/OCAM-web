describe('ActList controller test', function() {

  var $controller;
  var actListController;
  var mockAuth = {};

  beforeEach(function () {
    module('ocam');
    inject(function (_$controller_, $injector) {
        $controller = _$controller_;
        actListController = $controller('activityListController',
          {
            list:[],
            numEle: 0,
            activityService: $injector.get('activityService'),
            $q: $injector.get('$q'),
            DEFAULT_ITEM_PER_PAGE: $injector.get('DEFAULT_ITEM_PER_PAGE'),
            $state: $injector.get('$state'),
            $Auth: mockAuth,
            $mdDialog: $injector.get('$mdDialog'),
            $translatePartialLoader: $injector.get('$translatePartialLoader'),
            $filter: $injector.get('$filter'),
            $rootScope: $injector.get('$rootScope')
          });
    });
  });

  it('Debería enlazarle a la nueva actividad', inject(function($state) {
    spyOn($state, 'go');
    actListController.fl_create_allowed = true;
    actListController.onSelect({});
    expect($state.go).toHaveBeenCalledWith('private.activity', {activity: {}});
  }));


});
