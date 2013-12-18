'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('toggle', function() {
    return function(status) {
      return String(status).toLowerCase() === "on" ? "off" : "on"; 
//    return status;
    }
  }).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);
