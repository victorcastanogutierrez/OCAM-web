(function () {
'use strict';

angular.module('common')
.controller('activityListController', activityListController);

activityListController.$inject = ['list', '$timeout'];
function activityListController(list, $timeout) {

  var $ctrl = this;

  var initialLoad = ;

  this.infiniteItems = {
    // Primera cantidad precargada al cargar la página
    numLoaded_: list.length,
    toLoad_: 0,

    getItemAtIndex: function(index) {
      if (index > this.numLoaded_) {
        this.fetchMoreItems_(index);
        return null;
      }

      return index;
    },

    getLength: function() {
      return this.numLoaded_ + 5;
    },

    fetchMoreItems_: function(index) {
      if (this.toLoad_ < index) {
        this.toLoad_ += 20;
        $timeout(angular.noop, 300).then(angular.bind(this, function() {
          this.numLoaded_ = this.toLoad_;
        }));
      }
    }
  };

    /*this.infiniteItems = {
      numLoaded_: 0,
      toLoad_: 0,

      getItemAtIndex: function(index) {
        if (index > this.numLoaded_) {
          this.fetchMoreItems_(index);
          return null;
        }

        return index;
      },

      getLength: function() {
        return this.numLoaded_ + 5;
      },

      fetchMoreItems_: function(index) {

        if (this.toLoad_ < index) {
          this.toLoad_ += 20;
          $timeout(angular.noop, 300).then(angular.bind(this, function() {
            this.numLoaded_ = this.toLoad_;
          }));
        }
      }
    };*/
}

})();
