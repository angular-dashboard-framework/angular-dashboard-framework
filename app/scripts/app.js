'use strict';

angular.module('dashboard', [
    'dashboard.provider', 'dashboard.widgets.news', 
    'dashboard.widgets.weather', 'ngRoute', 'ngSanitize', 
    'ngAnimate', 'ui.sortable'
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
      widget: 'weather',
      config: {
        location: 'Hildesheim'
      }
    },{
      column: 0,
      widget: 'weather',
      config: {
        location: 'Dublin'
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