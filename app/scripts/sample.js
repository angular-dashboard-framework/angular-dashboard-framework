/*
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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

angular.module('sample', [
    'dashboard', 'dashboard.widgets.news', 'dashboard.widgets.randommsg',
    'dashboard.widgets.weather', 'dashboard.widgets.markdown', 'LocalStorageModule'
  ])
  .value('prefix', '')
  .config(function(dashboardProvider){

    dashboardProvider
      .structure('6-6', {
        rows: [{
          columns: [{
            class: 'col-md-6'
          },{
            class: 'col-md-6'
          }]
        }]
      })
      .structure('4-8', {
        rows: [{
          columns: [{
            class: 'col-md-4',
            widgets: []
          },{
            class: 'col-md-8',
            widgets: []
          }]
        }]
      })
      .structure('12/4-4-4', {
        rows: [{
          columns: [{
            class: 'col-md-12'
          }]
        },{
          columns: [{
            class: 'col-md-4'
          },{
            class: 'col-md-4'
          },{
            class: 'col-md-4'
          }]
        }]
      })
      .structure('12/6-6/12', {
        rows: [{
          columns: [{
            class: 'col-md-12'
          }]
        },{
          columns: [{
            class: 'col-md-6'
          },{
            class: 'col-md-6'
          }]
        },{
          columns: [{
            class: 'col-md-12'
          }]
        }]
      });

  })
  .controller('dashboardCtrl', function($scope, localStorageService){
    var dashboard = localStorageService.get('default');
    if (!dashboard){
      dashboard = {};
    }
    $scope.widgets = dashboard;
    
    $scope.$on('dashboardChanged', function(event, name, model){
      localStorageService.set(name, model);
    });
  });