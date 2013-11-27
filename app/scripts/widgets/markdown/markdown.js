'use strict';

angular.module('dashboard.widgets.markdown', ['dashboard.provider', 'btford.markdown'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('markdown', {
        title: 'Markdown',
        controller: function($scope, config){
          $scope.config = config;
        },
        templateUrl: 'scripts/widgets/markdown/markdown.html',
        edit: {
          templateUrl: 'scripts/widgets/markdown/edit.html'
        }
      });
  });