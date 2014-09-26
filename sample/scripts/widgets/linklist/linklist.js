/* *
 * The MIT License
 *
 * Copyright (c) 2013, Sebastian Sdorra
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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

angular.module('sample.widgets.linklist', ['adf.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('linklist', {
        title: 'Links',
        description: 'Displays a list of links',
        controller: 'linklistCtrl',
        controllerAs: 'list',
        templateUrl: 'scripts/widgets/linklist/linklist.html',
        edit: {
          templateUrl: 'scripts/widgets/linklist/edit.html',
          reload: false,
          controller: 'linklistEditCtrl'
        }
      });
  }).controller('linklistCtrl', function($scope, config){
    if (!config.links){
      config.links = [];
    }
    this.links = config.links;
  }).controller('linklistEditCtrl', function($scope){
    function getLinks(){
      if (!$scope.config.links){
        $scope.config.links = [];
      }
      return $scope.config.links;
    }
    $scope.addLink = function(){
      getLinks().push({});
    };
    $scope.removeLink = function(index){
      getLinks().splice(index, 1);
    };
  });
