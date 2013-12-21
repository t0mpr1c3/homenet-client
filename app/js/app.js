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
  $routeProvider.when('/appliances', {templateUrl: 'partials/applianceTab.html', controller: 'ApplianceTabCtrl'});
  $routeProvider.when('/motes', {templateUrl: 'partials/moteTab.html', controller: 'MoteTabCtrl'});
  $routeProvider.when('/measures', {templateUrl: 'partials/measureTab.html', controller: 'MeasureTabCtrl'});
  $routeProvider.when('/windows', {templateUrl: 'partials/windowTab.html', controller: 'WindowTabCtrl'});
  $routeProvider.otherwise({redirectTo: '/appliances'});
}]);
