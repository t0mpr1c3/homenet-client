'use strict';

/* Services */

angular.module('myApp.services', []).
  factory('APIGetService', ['$http', 'API_baseurl', function($http, API_baseurl) {
    return function(relurl) {
      return $http.get(API_baseurl + relurl).
        then(function(response) {
          console.log(response);
          return response.data;
      });
    };
  }]).
  factory('APIPostService', ['$http', 'API_baseurl', function($http, API_baseurl) {
    return function(relurl, body) {
      return $http.post(API_baseurl + relurl, body).
        then(function(response) {
          console.log(response);
          return response.data;
      });
    };
  }]).
  factory('APIPutService', ['$http', 'API_baseurl', function($http, API_baseurl) {
    return function(relurl, body) {
      return $http.put(API_baseurl + relurl, body).
        then(function(response) {
          console.log(response);
          return response.data;
      });
    };
  }]).
  factory('APIDeleteService', ['$http', 'API_baseurl', function($http, API_baseurl) {
    return function(relurl) {
      return $http.delete(API_baseurl + relurl).
        then(function(response) {
          console.log(response);
          return response.data;
      });
    };
  }]).
  value('API_baseurl', 'http://beaglebone:8000/').
  value('version', '0.1');
