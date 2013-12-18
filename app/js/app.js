'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/appliance', {templateUrl: 'partials/applianceTab.html', controller: 'ApplianceTabCtrl'});
  $routeProvider.when('/mote', {templateUrl: 'partials/moteTab.html', controller: 'MoteTabCtrl'});
  $routeProvider.when('/measure', {templateUrl: 'partials/measureTab.html', controller: 'MeasureTabCtrl'});
  $routeProvider.when('/controlrule', {templateUrl: 'partials/controlRuleTab.html', controller: 'ControlRuleTabCtrl'});
  $routeProvider.otherwise({redirectTo: '/appliance'});
}]);
