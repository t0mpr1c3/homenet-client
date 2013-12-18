'use strict';

/* jasmine specs for controllers go here */

describe('MyCtrl1 controller', function() {
  beforeEach(module('myApp'));
     
  describe('MyCtrl1', function() {
     
    it('should create "appliances" model with 2 appliances', inject(function($controller) {
      var scope = {},
      ctrl = $controller('MyCtrl1', { $scope: scope });
     
      expect(scope.appliances.length).toBe(2);
    }));
  });
});
