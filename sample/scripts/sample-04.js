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

angular.module('sample-04', ['adf', 'LocalStorageModule'])
.controller('sample04Ctrl', function($scope, localStorageService) {
  var name = 'sample-04.1';
  var model = localStorageService.get(name);
  if (!model) {
    // set default model for demo purposes
    model = {
      title: "Sample 04",
      structure: "3-9 (12/6-6)",
      rows: [{
          "columns": [
            {
              "styleClass": "col-md-3",
              "widgets": [
                {
                  "type": "weather",
                  "config": {
                    "location": "Hildesheim"
                  },
                  "title": "Weather"
                },
                {
                  "type": "weather",
                  "config": {
                    "location": "Dublin,IE"
                  },
                  "title": "Weather"
                },
                {
                  "type": "weather",
                  "config": {
                    "location": "Edinburgh"
                  },
                  "title": "Weather"
                },
                {
                  "type": "weather",
                  "config": {
                    "location": "New York"
                  },
                  "title": "Weather"
                }
              ]
            },
            {
              "styleClass": "col-md-9",
              "rows": [
                {
                  "columns": [
                    {
                      "styleClass": "col-md-12",
                      "widgets": [
                        {
                          "type": "markdown",
                          "config": {
                            "content": "This example demonstrates the usage of nested rows."
                          },
                          "title": "Markdown"
                        }
                      ]
                    }
                  ]
                },
                {
                  "columns": [
                    {
                      "styleClass": "col-md-6",
                      "widgets": [
                        {
                          "type": "githubHistory",
                          "config": {
                            "path": "angular-dashboard-framework/angular-dashboard-framework"
                          },
                          "title": "Github History"
                        }
                      ]
                    },
                    {
                      "styleClass": "col-md-6",
                      "widgets": [
                        {
                          "type": "githubAuthor",
                          "config": {
                            "path": "angular/angular.js"
                          },
                          "title": "Github Author"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  }

  $scope.name = name;
  $scope.model = model;
  $scope.collapsible = false;
  $scope.maximizable = false;

  $scope.$on('adfDashboardChanged', function(event, name, model) {
    localStorageService.set(name, model);
  });
});
