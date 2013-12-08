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

angular.module('dashboard')
  .directive('dashboard', function($rootScope, $log, $modal, dashboard){

    function fillStructure(model, widgets, counter){
      angular.forEach(model.rows, function(row){
        angular.forEach(row.columns, function(column){
          if ( counter < widgets.length ){
            if (!column.widgets){
              column.widgets = [];
            }
            column.widgets.push(widgets[counter++]);
          }
        });
      });
      return counter;
    }
    
    function readWidgets(model){
      var widgets = [];
      angular.forEach(model.rows, function(row){
        angular.forEach(row.columns, function(column){
          angular.forEach(column.widgets, function(widget){
            widgets.push(widget);
          });
        });
      });
      return widgets;
    }
            
    function changeStructure(model, structure){
      var widgets = readWidgets(model);
      model.rows = structure.rows;
      var counter = 0;
      while ( counter < widgets.length ){
        counter = fillStructure(model, widgets, counter);
      }
    }

    return {
      replace: true,
      restrict: 'EA',
      transclude : false,
      scope: {
        structure: '@',
        name: '@',
        adfModel: '='
      },
      controller: function($scope){
        // sortable options for drag and drop
        $scope.sortableOptions = {
          connectWith: ".column",
          handle: ".fa-arrows",
          cursor: 'move',
          tolerance: 'pointer',
          placeholder: 'placeholder',
          forcePlaceholderSize: true,
          opacity: 0.4
        };
        
        var name = $scope.name;
        var model = $scope.adfModel;
        if ( ! model || ! model.rows ){
          var structureName = $scope.structure;
          var structure = dashboard.structures[structureName];
          if (structure){
            if (model){
              model.rows = angular.copy(structure).rows;
            } else {
              model = angular.copy(structure);
            }
            model.structure = structureName;
          } else {
            $log.error( 'could not find structure ' + structureName);
          }
        } 
        
        if (model) {
          if (!model.title){
            model.title = 'Dashboard';
          }
          $scope.model = model;
        } else {
          $log.error('could not find or create model');
        }

        // edit mode
        $scope.editMode = false;
        $scope.editClass = "";

        $scope.toggleEditMode = function(){
          $scope.editMode = ! $scope.editMode;
          if ($scope.editClass === ""){
            $scope.editClass = "edit";
          } else {
            $scope.editClass = "";
          }
          if (!$scope.editMode){
            $rootScope.$broadcast('dashboardChanged', name, model);
          }
        };
        
        // edit dashboard settings
        $scope.editDashboardDialog = function(){
          var editDashboardScope = $scope.$new();
          editDashboardScope.structures = dashboard.structures;
          var instance = $modal.open({
            scope: editDashboardScope,
            templateUrl: 'scripts/dashboard/dashboard-edit.html'
          });
          $scope.changeStructure = function(name, structure){
            $log.info('change structure to ' + name);
            changeStructure(model, structure);
          };
          editDashboardScope.closeDialog = function(){
            instance.close();
            editDashboardScope.$destroy();
          };
        };

        // add widget dialog
        $scope.addWidgetDialog = function(){
          var addScope = $scope.$new();
          addScope.widgets = dashboard.widgets;
          var opts = {
            scope: addScope,
            templateUrl: 'scripts/dashboard/widget-add.html'
          };
          var instance = $modal.open(opts);
          addScope.addWidget = function(widget){
            var w = {
              type: widget,
              config: {}
            };
            addScope.model.rows[0].columns[0].widgets.unshift(w);
            instance.close();

            addScope.$destroy();
          };
          addScope.closeDialog = function(){
            instance.close();
            addScope.$destroy();
          };
        };
      },
      link: function ($scope, $element, $attr) {
        // pass attributes to scope
        $scope.name = $attr.name;
        $scope.structure = $attr.structure;
      },
      templateUrl: 'scripts/dashboard/dashboard.html'
    };
  });