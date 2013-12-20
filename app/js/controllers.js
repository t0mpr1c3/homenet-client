'use strict';

/* Controllers */

/* FIXME have API send back id number as confirmation of POST */

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
    }
    $scope.deleteAppliance = function(index) {
      APIDeleteService('appliances/' + $scope.appliances[index].id).then(function() {
        $scope.appliances.splice(index, 1);
      });
    }
    $scope.addNewAppliance = function() {
      $scope.newAppliance.id = $scope.appliances[$scope.appliances.length - 1].id + 1;
      APIPostService('appliances', $scope.newAppliance).
        then(function() {
          $scope.appliances.push($scope.newAppliance);
          $scope.newAppliance = {};
        });
    }
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
    }
    $scope.addNewMote = function() {
      $scope.newMote.sensors = [];
      for (var i = 0; i < $scope.measures.length; i++) {
        if ($scope.measures[i].selected) {
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
    }
/*
    $scope.editMoteSensors(index, $scope.newSensors) {
      APIPutService('motes/' + $scope.motes[index].id, $scope.newSensors).
        then(function() {
          $scope.motes[index].sensors = $scope.newSensors;
        });
    }
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
    }
    $scope.addNewMeasure = function() {
      // FIXME check input values
      // FIXME insert default hysteresis/display value
      $scope.newMeasure.id = $scope.measures[$scope.measures.length - 1].id + 1; 
      APIPostService('measures', $scope.newMeasure).
        then(function() {
          $scope.measures.push($scope.newMeasure);
          $scope.newMeasure = {};
        });
    }
  }]).

  controller('ControlRuleTabCtrl', ['$scope', 'APIGetService', 'APIPostService',
  'APIPutService', 'APIDeleteService', function($scope, APIGetService, APIPostService,
  APIPutService, APIDeleteService) {
/*
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
*/
    // get windows
    $scope.windows = [];
    APIGetService('windows').then(function(data) {
      $scope.windows = data;
    });
    // submit window form
    $scope.windows = [{
        'id': 0, 'title': 'weekday morning', 'days': 31, 'start': 18000000,
        'end': 30600000, 'duration': 0, 'deadTime': 0 
      }, {
        'id': 1, 'title': 'weekday evening', 'days': 31, 'start': 61200000,
        'end': 79200000, 'duration': 0, 'deadTime': 0    
      }, {
        'id': 2, 'title': 'weekend morning', 'days': 96, 'start': 21600000,
        'end': 36000000, 'duration': 3600000, 'deadTime': 0    
      }, {
        'id': 3, 'title': 'weekend evening', 'days': 96, 'start': 57600000,
        'end': 79200000, 'duration': 1000, 'deadTime': 60000   
    }];
    for (var i = 0; t < $scope.windows.length; i++) {
      $scope.windows[i].edit = false;
      $scope.windows[i].editable = true;
    }
    $scope.day_names = [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ];
    $scope.hours = [
      '00','01','02','03','04','05','06','07','08','09','10','11',
      '12','13','14','15','16','17','18','19','20','21','22','23'
    ]; 
    $scope.minutes = ['00','15','30','45'];
    $scope.durationOptions = ['until reset','time limited'];
    $scope.durations = [1,2,5,10,15,30,60];
    $scope.deadTimes = [0,1,2,5,10,15,30,60];
    //$scope.hourDurations = [1,2,3,6,12,24];
    $scope.timescales = [ 
      { "short": 's', "singular": 'sec', "plural": 'sec'},
      { "short": 'm', "singular": 'min', "plural": 'min'}
      //, { "short": 'h', "singular": 'hour', "plural": 'hours'}
    ];
    $scope.setEditWeekdays = function() {
      for (var i = 0; i < 5; i++) {
        $scope.editWindow.days[i] = $scope.editWindow.weekdays;
      }
    }
    $scope.setEditWeekend = function() {
      $scope.editWindow.days[5] = $scope.editWindow.weekend;
      $scope.editWindow.days[6] = $scope.editWindow.weekend;
    }
    $scope.which_days = function(days) {
      // list each day
      var selected_days = [];
      for (var i = 0; i < 7; i++) {
        if (days[i]) {
          selected_days.push($scope.day_names[i]);
        }
      }
      // FIXME check input values
      // run length encoding of days on/off
      var val = days[0];
      var len = 1;
      var rle = {"val": [], "len": []};
      for (var i = 1; i < 7; i++) {
        if (days[i] !== val) {
          rle.val.push(val);
          rle.len.push(len);
          val = days[i];
          len = 1;
        } else {
          len++;
        }
      }
      rle.val.push(val);
      rle.len.push(len);
      // continuous blocks of days
      if (rle.val.length === 1) {
        return (rle.val[0]) ? "every day" : "never";
      }
      if ((rle.val.length === 2) && (rle.len[0] === 5)) {
        return (rle.val[0]) ? "weekday" : "weekend";
      }
      if (selected_days.length === 2) {
        return selected_days.join(" and ");
      }
      if (rle.val.length === 2) {
        if (rle.val[0]) {
          return $scope.day_names[0] +
            String((rle.len[0] === 1) ? "" :
              " through " + $scope.day_names[rle.len[0] - 1]);
        }
        return $scope.day_names[rle.len[0]] +
          String((rle.len[1] === 1) ? "" : " through " + $scope.day_names[6]);
      }
      if (rle.val.length === 3) {
        if (rle.val[0]) {
          return $scope.day_names[rle.len[0] + rle.len[1]] + 
            " through " + $scope.day_names[rle.len[0] - 1];
        }
        return $scope.day_names[rle.len[0]] +
          String((rle.len[1] === 1) ? "" : 
            " through " + $scope.day_names[rle.len[0] + rle.len[1] - 1]);
      }
      return selected_days.join(", ");
    }
    $scope.logical2binary = function(logical) {
      var binary = 0;
      var mask = 1;
      for (var i = 0; i < 7; i++) {
        if (logical[i]) {
          binary += mask;
        }
        mask <<= 1;
      }
      return binary;
    }
    $scope.ms2HHMM = function(time) {
      var res = ['', ''];
      time = Math.floor(time / 60000);
      res[1] = '' + (time % 10);
      time = Math.floor( time / 10);
      res[1] = (time % 6) + res[1];
      time = Math.floor(time / 6);
      res[0] = '' + (time % 10);
      time = Math.floor(time / 10);
      res[0] = time + res[0];
      return res; 
    }
    $scope.displayDuration = function(duration) {
      if (duration === 0) {
        return ['until reset', ''];
      }
      duration = Math.floor(duration / 1000);
      if (duration < 60) {
        return [String(duration), 'sec'];
      }
      duration = Math.floor(duration / 60);
      return [String(duration), 'min'];
    }
    $scope.displayDeadTime = function(deadTime) {
      return (deadTime === 0) ? ['', ''] : $scope.displayDuration(deadTime);
    }
    $scope.binary2logical = function(binary) {
      var logical = [false, false, false, false, false, false, false];
      var mask = 1;
      for (var i = 0; i < 7; i++) {
        if ((binary & mask) > 0) {
          logical[i] = true;
        }
        mask <<= 1;
      }
      return logical;
    }
    $scope.editWindowInPlace = function(index) {
      $scope.windows[index].edit = ! $scope.windows[index].edit;
      for (var i = 0; i < $scope.windows.length; i++ ) {
        if (i !== index) {
          $scope.windows[i].editable = ! $scope.windows[index].edit;
        }
      }
      if ($scope.windows[index].edit) {
        // set editor values
        $scope.editWindow = {
          'title': $scope.windows[index].title,
          'days': $scope.binary2logical($scope.windows[index].days),
          'weekdays': ($scope.windows[index].days & 31) === 31,
          'weekend': ($scope.windows[index].days & 96) === 96,
          'startHour': $scope.ms2HHMM($scope.windows[index].start)[0],
          'startMinute': $scope.ms2HHMM($scope.windows[index].start)[1],
          'endHour': $scope.ms2HHMM($scope.windows[index].end)[0],
          'endMinute': $scope.ms2HHMM($scope.windows[index].end)[1],
          'durationOption': ($scope.windows[index].duration === 0) ? 
            'until reset' : 'time limited',
          'signalDuration': ($scope.windows[index].duration === 0) ? 
            1 : Number($scope.displayDuration($scope.windows[index].duration)[0]),
          'signalTimescale': ($scope.windows[index].duration === 0) ? 
            's' : $scope.displayDuration($scope.windows[index].duration)[1].substr(0, 1),
          'deadTimeDuration': ($scope.windows[index].deadTime === 0) ? 
            0 : Number($scope.displayDuration($scope.windows[index].deadTime)[0]),
          'deadTimeTimescale': ($scope.windows[index].deadTime === 0) ? 
            's' : $scope.displayDuration($scope.windows[index].deadTime)[1].substr(0, 1),
          'edit': true
        };
      } else {
        $scope.editWindow.edit = false;
        // capture input
        var newWindow = {
          'id': $scope.window[index].id,
          'limit': $scope.editWindow.limit, 
          'days': $scope.logical2binary($scope.editWindow.days),
          'start': (Number($scope.editWindow.startHour) * 60 + Number($scope.editWindow.startMinute)) * 60000,
          'end': (Number($scope.editWindow.endHour) * 60 + Number($scope.editWindow.endMinute)) * 60000,
          'duration': ($scope.editWindow.durationOption === 'until reset') ? 0 : Number($scope.editWindow.signalDuration) * (($scope.editWindow.signalTimescale === 's') ? 1 : 60) * 1000,
          'deadTime': Number($scope.editWindow.deadTimeDuration) * (($scope.editWindow.deadTimeTimescale === 's') ? 1 : 60) * 1000
        };
        // put input to RESTful API
        APIPutService('windows/' + $scope.windows[index].id, newWindow).
        then(function() {
          $scope.windows[index] = newWindow;
        });
      }
    }
    $scope.confirmDeleteWindow = function(index, val) {
      $scope.windows[index].confirmDelete = val;
      $scope.editWindow.edit = val;
      for (var i = 0; i < $scope.windows.length; i++) {
        $scope.windows[i].editable = ! val;
      }
    }
    $scope.deleteWindow = function(index) {
      $scope.confirmDeleteWindow($index, false);
      APIDeleteService('windows/' + $scope.windows[index].id).then(function() {
        $scope.windows.splice(index, 1);
      });
    }
    $scope.addWindow = function() {
      var newWindow = {
        'id': $scope.windows[$scope.windows.length - 1].id + 1, 
        'title': '', 'edit': false, 'editable': true, 
        'days': 0, 'start': 0, 'end': 0, 'duration': 0, 'deadTime': 0
      };
      APIPostService('windows', newWindow).
        then(function() {
          $scope.windows.push(newWindow);
        });
      $scope.editWindowInPlace($scope.windows.length - 1);
    }
  }]);
