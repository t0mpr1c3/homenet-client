'use strict';

/* Controllers */

angular.module('myApp.controllers', []).

  controller('DashboardCtrl', ['$scope', 'APIGetService', 
  function($scope, APIGetService) {
    // get appliances
    $scope.appliances = [];
    APIGetService('appliances').then(function(data) {
      $scope.appliances = data;
    });
    // get motes
    $scope.motes = [];
    APIGetService('motes').then(function(data) {
      $scope.motes = data;
    });
    // get measures
    $scope.measures = [];
    APIGetService('measures').then(function(data) {
      $scope.measures = data;
    });
  }]).

  controller('ApplianceTabCtrl', ['$scope', '$http', 'APIGetService', 'APIPostService',
  'APIPutService', 'APIDeleteService', 'toggleFilter', function($scope, $http,
  APIGetService, APIPostService, APIPutService, APIDeleteService, toggleFilter) {
    // get appliances
    $scope.appliances = [];
    APIGetService('appliances').then(function(data) {
      $scope.appliances = data;
    });
    $scope.newAppliance = {};
    // get motes
    $scope.motes = [];
    APIGetService('motes').then(function(data) {
      $scope.motes = data;
    });
    // ng-click subroutines
    $scope.toggleApplianceStatus = function(index) {
      var newStatus = toggleFilter($scope.appliances[index].status);
      APIPutService('appliances/' + $scope.appliances[index].id, {"status": newStatus}).
        then(function() {
          $scope.appliances[index].status = newStatus;
        });
    };
    $scope.deleteAppliance = function(index) {
      APIDeleteService('appliances/' + $scope.appliances[index].id).then(function() {
        $scope.appliances.splice(index, 1);
      });
    };
    $scope.addNewAppliance = function() {
      $scope.newAppliance.id = $scope.appliances[$scope.appliances.length - 1].id + 1;
      APIPostService('appliances', $scope.newAppliance).
        then(function() {
          $scope.appliances.push($scope.newAppliance);
          $scope.newAppliance = {};
        });
    };
  }]).

  controller('MoteTabCtrl', ['$scope', '$http', 'APIGetService', 'APIPostService',
  'APIPutService', 'APIDeleteService', function($scope, $http, APIGetService,
  APIPostService, APIPutService, APIDeleteService) {
    // get motes
    $scope.motes = [];
    APIGetService('motes').then(function(data) {
      $scope.motes = data;
    });
    $scope.newMote = {};
    // get measures
    $scope.measures = [];
    APIGetService('measures').then(function(data) {
      $scope.measures = data;
      for (var i = 0; i < $scope.measures.length; i++) {
        $scope.measures[i].selected = false;
      }
    });
    // ng-click subroutines
    $scope.deleteMote = function(index) {
      APIDeleteService('motes/' + $scope.motes[index].id).then(function() {
        $scope.motes.splice(index, 1);
      });
    };
    $scope.addNewMote = function() {
      $scope.newMote.sensors = [];
      for (var i = 0; i < $scope.measures.length; i++) {
        if ($scope.measures[i].selected === true) {
          $scope.newMote.sensors.push({
            "measure_id": $scope.measures[i].id, 
            "value": "----", 
            "timestamp": ""
          });
        }
      }
      $scope.newMote.id = $scope.motes[$scope.motes.length - 1].id + 1; 
      APIPostService('motes', $scope.newMote).
        then(function() {
          $scope.motes.push($scope.newMote);
          $scope.newMote = {};
          for (var i = 0; i < $scope.measures.length; i++) {
            $scope.measures[i].selected = false;
          }
        });
    };
/*
    $scope.editMoteSensors(index, $scope.newSensors) {
      APIPutService('motes/' + $scope.motes[index].id, $scope.newSensors).
        then(function() {
          $scope.motes[index].sensors = $scope.newSensors;
        });
    };
*/
  }]).

  controller('MeasureTabCtrl', ['$scope', 'APIGetService', 'APIPostService', 
  'APIDeleteService', function($scope, APIGetService, APIPostService, APIDeleteService) {
    // get measures
    $scope.measures = [];
    APIGetService('measures').then(function(data) {
      $scope.measures = data;
    });
    $scope.newMeasure = {};
    // ng-click subroutines
    $scope.deleteMeasure = function(index) {
      APIDeleteService('measures/' + $scope.measures[index].id).then(function() {
        $scope.measures.splice(index, 1);
      });
    };
    $scope.addNewMeasure = function() {
      $scope.newMeasure.id = $scope.measures[$scope.measures.length - 1].id + 1; 
      APIPostService('measures', $scope.newMeasure).
        then(function() {
          $scope.measures.push($scope.newMeasure);
          $scope.newMeasure = {};
        });
    };
  }]).

  controller('ControlRuleTabCtrl', ['$scope', 'APIGetService', 
  function($scope, APIGetService) {
    // get control rules
    $scope.controlrules = [];
    APIGetService('controlrules').then(function(data) {
      $scope.controlrules = data;
    });
    // get appliances
    $scope.appliances = [];
    APIGetService('appliances').then(function(data) {
      $scope.appliances = data;
    });
  }]);
