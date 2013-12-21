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
  'APIPutService', 'APIDeleteService', function($scope, $http,
  APIGetService, APIPostService, APIPutService, APIDeleteService) {
    // get appliances
    $scope.appliances = [];
    APIGetService('appliances').then(function(data) {
      $scope.appliances = data;
      for (var i = 0; i < $scope.appliances.length; i++) {
        $scope.appliances[i].edit = false;
        $scope.appliances[i].editable = true;
        $scope.appliances[i].confirmDelete = false;
        $scope.appliances[i].displayStatus = $scope.appliances[i].status;
      }
    });
    $scope.newAppliance = {
      'status': false
    };
    $scope.controllingMoteTitle = function(index) {
      for (var i = 0; i < $scope.motes.length; i++) {
        if ($scope.motes[i].id === $scope.appliances[index].controlling_mote_id) {
          return $scope.motes[i].title;
        }
      }
    }
    // get motes
    $scope.motes = [];
    APIGetService('motes').then(function(data) {
      $scope.motes = data;
    });
    // ng-click subroutines
    $scope.editAppliance = function(index) {
      // prevents input errors
      // setting forms dirty aims to highlight entry errors via css
      var invalid = false;
      if ($scope.appliances[index].edit && $scope.appForm1.appTitle.$invalid) { 
        $scope.appForm1.$dirty = true;
        $scope.appForm1.appTitle.$dirty = true;
        invalid = true;
      }
      if ($scope.appliances[index].edit && $scope.appForm2.appMoteId.$invalid) { 
        $scope.appForm2.$dirty = true;
        $scope.appForm2.appMoteId.$dirty = true;
        invalid = true;
      }
      if (invalid) {
        return;
      }
      // toggle edit status and button disable
      for (var i = 0; i < $scope.appliances.length; i++) {
        if ( i !== index ) {
          $scope.appliances[i].editable ^= true;
        }
      }
      $scope.appliances[index].edit ^= true;
      $scope.edit = $scope.appliances[index].edit;
      if ($scope.appliances[index].edit)
      {
        $scope.newAppliance = {
          'id': $scope.appliances[index].id,
          'title': $scope.appliances[index].title,
          'status': $scope.appliances[index].status,
          'controlling_mote_id': $scope.appliances[index].controlling_mote_id
        };
      } else {
        APIPutService('appliances/' + $scope.appliances[index].id, $scope.newAppliance).
          then(function() {
            $scope.appliances[index].title = $scope.newAppliance.title;
            $scope.appliances[index].status = $scope.newAppliance.status;
            $scope.appliances[index].controlling_mote_id = $scope.newAppliance.controlling_mote_id;
            $scope.appForm1.appTitle.$dirty = false;
            $scope.appForm2.appMoteId.$dirty = false;
        });
      }
    }
    $scope.toggleApplianceStatus = function(index) {
      if ($scope.appliances[index].edit) {
        $scope.newAppliance.status ^= true;
        return;
      }
        $scope.newAppliance = {
          'id': $scope.appliances[index].id,
          'title': $scope.appliances[index].title,
          'status': $scope.appliances[index].status ^ true,
          'controlling_mote_id': $scope.appliances[index].controlling_mote_id
        };
      APIPutService('appliances/' + $scope.appliances[index].id, 
        $scope.newAppliance).
          then(function() {
            $scope.appliances[index].status ^= true;
          });
    }
    $scope.addNewAppliance = function() {
      $scope.newAppliance = {
        'id': $scope.appliances[$scope.appliances.length - 1].id + 1
      };
      APIPostService('appliances', $scope.newAppliance).
        then(function() {
          $scope.appliances.push({
            'id': $scope.appliances[$scope.appliances.length - 1].id + 1,
            'status': false
          });
          $scope.newAppliance = {
            'status': false,
            'edit': false
          };
          $scope.appliances[$scope.appliances.length - 1].editable = true;
          $scope.editAppliance($scope.appliances.length - 1);
        });
    }
    $scope.confirmDeleteAppliance = function(index, val) {
      $scope.edit = val;
      for (var i = 0; i < $scope.appliances.length; i++) {
        $scope.appliances[i].editable = ! val;
      }
      $scope.appliances[index].confirmDelete = val;
    }
    $scope.deleteAppliance = function(index) {
      APIDeleteService('appliances/' + $scope.appliances[index].id).then(function() {
        $scope.confirmDeleteAppliance(index, false);
        $scope.appliances.splice(index, 1);
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

  controller('WindowTabCtrl', ['$scope', 'APIGetService', 'APIPostService',
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
      for (var i = 0; i < $scope.windows.length; i++) {
        $scope.windows[i].edit = false;
        $scope.windows[i].editable = true;
        //$scope.windows[i].confirmDelete = false;
      }
    });
    // initialize scope object
    $scope.editWindow = {};
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
    //$scope.hourDurations = [1,2,3,6,12,24];
    $scope.deadTimes = [0,1,2,5,10,15,30,60];
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
          'id': $scope.windows[index].id,
          'title': $scope.editWindow.title, 
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
          $scope.windows[index].editable = true;
          $scope.windows[index].edit = false;
        });
      }
    }
    $scope.confirmDeleteWindow = function(index, val) {
      $scope.editWindow.edit = val;
      for (var i = 0; i < $scope.windows.length; i++) {
        $scope.windows[i].editable = ! val;
      }
      $scope.windows[index].confirmDelete = val;
    }
    $scope.deleteWindow = function(index) {
      $scope.confirmDeleteWindow(index, false);
      APIDeleteService('windows/' + $scope.windows[index].id).then(function() {
        $scope.windows.splice(index, 1);
      });
    }
    $scope.addWindow = function() {
      var newWindow = {
        'id': $scope.windows[$scope.windows.length - 1].id + 1, 'title': '', 
        'days': 0, 'start': 0, 'end': 0, 'duration': 0, 'deadTime': 0
      };
      APIPostService('windows', newWindow).
        then(function() {
          $scope.windows.push(newWindow);
          $scope.windows[$scope.windows.length - 1].editable = true;
          $scope.editWindowInPlace($scope.windows.length - 1);
        });
    }
  }]);
