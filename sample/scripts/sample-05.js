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

angular.module('sample-05', ['adf', 'LocalStorageModule'])
  .controller('sample05Ctrl', function ($scope, localStorageService) {
    var name = 'sample-05.1';

    var model = localStorageService.get(name);
    if (!model) {
      // set default model for demo purposes
      model = {
        title: "Sample 05",
        structure: "6-6",
        rows: [{
          columns: [{
            styleClass: "col-md-6",
            widgets: [{
              fullScreen: false,
              modalSize: 'sm',
              type: "githubAuthor",
              config: {
                path: "angular/angular.js"
              },
              title: "Github Author"
            }]
          }, {
            styleClass: "col-md-6",
            widgets: [{
              fullScreen: true,
              //modalSize: 'lg',
              type: "githubHistory",
              config: {
                path: "angular-dashboard-framework/angular-dashboard-framework"
              },
              title: "Github History"
            }]
          }]
        }]
      };
    }

    $scope.name = name;
    $scope.model = model;
    $scope.collapsible = false;
    $scope.maximizable = false;
    $scope.eventsFired = [];

    var eventFired = function (event, name, model) {
        $scope.eventsFired.push(event);
        localStorageService.set(name, model);
    };

    $scope.$on('adfDashboardChanged', eventFired);
    $scope.$on('adfWidgetAdded', eventFired);
    $scope.$on('adfWidgetMoved', eventFired);
    $scope.$on('adfWidgetAddedToColumn', eventFired);
    $scope.$on('adfWidgetRemovedFromColumn', eventFired);
    $scope.$on('adfWidgetMovedInColumn', eventFired);
  });
