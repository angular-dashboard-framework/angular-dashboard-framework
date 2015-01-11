/*
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
'use strict';

angular.module('sample', [
  'adf', 'sample.widgets.news', 'sample.widgets.randommsg',
  'sample.widgets.weather', 'sample.widgets.markdown',
  'sample.widgets.linklist', 'sample.widgets.github',
  'sample.widgets.version', 'LocalStorageModule',
  'structures', 'sample-01', 'sample-02', 'sample-03',
  'sample-04', 'ngRoute'
])
.config(function($routeProvider, localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('adf');

  $routeProvider.when('/sample/01', {
    templateUrl: 'partials/sample.html',
    controller: 'sample01Ctrl'
  })
  .when('/sample/02', {
    templateUrl: 'partials/sample.html',
    controller: 'sample02Ctrl'
  })
  .when('/sample/03', {
    templateUrl: 'partials/sampleWithFilter.html',
    controller: 'sample03Ctrl'
  })
  .when('/sample/04', {
    templateUrl: 'partials/sample.html',
    controller: 'sample04Ctrl'
  })
  .otherwise({
    redirectTo: '/sample/01'
  });

})
.controller('navigationCtrl', function($scope, $location){

  $scope.navCollapsed = true;

  $scope.toggleNav = function(){
    $scope.navCollapsed = !$scope.navCollapsed;
  };

  $scope.$on('$routeChangeStart', function() {
    $scope.navCollapsed = true;
  });

  $scope.navClass = function(page) {
    var currentRoute = $location.path().substring(1) || 'Sample 01';
    return page === currentRoute || new RegExp(page).test(currentRoute) ? 'active' : '';
  };

});
