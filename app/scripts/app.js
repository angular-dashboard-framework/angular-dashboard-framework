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

angular.module('dashboard', [
    'dashboard.provider', 'dashboard.widgets.news', 
    'dashboard.widgets.weather', 'dashboard.widgets.markdown',
    'ngRoute', 'ngSanitize', 'ngAnimate', 'ui.bootstrap', 'ui.sortable'
  ])
  .config(function(dashboardProvider){

    dashboardProvider
      .structure('4-8', {
        rows: [{
          columns: [{
            class: 'col-md-4'
          },{
            class: 'col-md-8'
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
  .controller('dashboardCtrl', function($scope){
    $scope.widgets = [{
      column: 0,
      widget: 'markdown',
      config: {
        content: '[Markdown](http://en.wikipedia.org/wiki/Markdown) content'
      }
    },{
      column: 0,
      widget: 'weather',
      config: {
        location: 'Hildesheim'
      }
    },{
      column: 0,
      widget: 'weather',
      config: {
        location: 'Dublin,IE'
      }
    },{
      column: 0,
      widget: 'weather',
      config: {
        location: 'Edinburgh,UK'
      }
    },{
      column: 1,
      widget: 'news',
      config: {
        url: 'http://rss.golem.de/rss.php?feed=ATOM1.0'
      }
    },{
      column: 1,
      widget: 'news',
      config: {
        url: 'http://jaxenter.de/all-content.xml'
      }
    },{
      column: 1,
      widget: 'news',
      config: {
        url: 'http://www.scm-manager.org/feed/'
      }
    }];
  });