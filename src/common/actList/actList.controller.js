(function () {
'use strict';

angular.module('common')
.controller('activityListController', activityListController);

activityListController.$inject = ['list', '$timeout'];
function activityListController(list, $timeout) {
  var $ctrl = this;

  $ctrl.list = list;
  $ctrl.PAGE_SIZE = 10;

  var DynamicItems = function() {
    /**
     * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
     */
    this.loadedPages = {};

    /** @type {number} Total number of items. */
    this.numItems = 0;

    /** @const {number} Number of items to fetch per request. */
    this.PAGE_SIZE = 50;

    this.fetchNumItems_();
  };

  // Required.
  DynamicItems.prototype.getItemAtIndex = function(index) {
    var pageNumber = Math.floor(index / this.PAGE_SIZE);
    var page = this.loadedPages[pageNumber];

    if (page) {
      return page[index % this.PAGE_SIZE];
    } else if (page !== null) {
      this.fetchPage_(pageNumber);
    }
  };

  // Required.
  DynamicItems.prototype.getLength = function() {
    return this.numItems;
  };

  DynamicItems.prototype.fetchPage_ = function(pageNumber) {
    // Set the page to null so we know it is already being fetched.
    this.loadedPages[pageNumber] = null;

    // For demo purposes, we simulate loading more items with a timed
    // promise. In real code, this function would likely contain an
    // $http request.
    $timeout(angular.noop, 300).then(angular.bind(this, function() {
      this.loadedPages[pageNumber] = [];
      var pageOffset = pageNumber * this.PAGE_SIZE;
      for (var i = pageOffset; i < pageOffset + this.PAGE_SIZE; i++) {
        this.loadedPages[pageNumber].push(i);
      }
    }));
  };

  DynamicItems.prototype.fetchNumItems_ = function() {
    // For demo purposes, we simulate loading the item count with a timed
    // promise. In real code, this function would likely contain an
    // $http request.
    $timeout(angular.noop, 300).then(angular.bind(this, function() {
      this.numItems = 50000;
    }));
  };

  this.dynamicItems = new DynamicItems();


}

})();
