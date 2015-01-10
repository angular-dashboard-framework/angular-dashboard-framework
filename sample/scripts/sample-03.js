/**
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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
'use strict';

angular.module('sample-03', ['adf', 'LocalStorageModule'])
.controller('sample03Ctrl', function($scope, localStorageService) {
  var name = 'sample-03';
  var model = localStorageService.get(name);
  if (!model) {
    // set default model for demo purposes
    model = {
      title: "Sample 03",
      structure: "6-6",
      rows: [{
        columns: [{
          styleClass: "col-md-6",
          widgets: [{
            title: 'Description',
            type: 'markdown',
            config: {
              content: 'This sample uses a widget filter, to restrict the widget selection on the "add dialog".'
            }
          }]
        }, {
          styleClass: "col-md-6",
          widgets: [{
            title: 'Restangular',
            type: 'githubAuthor',
            config: {
              path: 'mgonto/restangular'
            }
          }]
        }]
      }]
    };
  }
  $scope.name = name;
  $scope.model = model;
  $scope.collapsible = false;

  // only allow github widgets
  $scope.widgetFilter = function(widget, type){
    return type.indexOf('github') >= 0 || type === 'markdown' || type === 'version';
  };

  $scope.$on('adfDashboardChanged', function(event, name, model) {
    localStorageService.set(name, model);
  });
});
