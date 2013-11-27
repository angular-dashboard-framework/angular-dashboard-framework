'use strict';

angular.module('dashboard')
  .directive('dashboard', function($log, dashboard, $compile, $controller, $modal){

    // fill structure with widgets from model
    var fillStructure = function(structure, model){
      var index = -1;
      angular.forEach(structure.rows, function(row){
        angular.forEach(row.columns, function(column){
          column.index = ++index;
          angular.forEach(model, function(widget){
            if (widget.column === index){
              if (!column.widgets){
                column.widgets = [];
              }
              column.widgets.push(widget);
            }
          }); 
        });
      });
    };

    return {
      replace: true,
      restrict: 'EA',
      transclude : false,
      require: '?ngModel',
      scope: {
        structure: '@',
        ngModel: '='
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

        // get rows from structure
        var structureName = $scope.structure;
        var structure = dashboard.structures[structureName];
        if (structure){
          $scope.$watch('ngModel', function(newValue){
            structure = angular.copy(structure);
            fillStructure(structure, newValue);
            $scope.rows = structure.rows;
          });
        } else {
          $log.error( 'could not find structure ' + structureName);
        }

        // edit mode
        $scope.editMode = false;
        $scope.editClass = "";

        $scope.toggleEditMode = function(){
          $scope.editMode = ! $scope.editMode;
          if ($scope.editClass == ""){
            $scope.editClass = "edit";
          } else {
            $scope.editClass = "";
          }
          if (!$scope.editMode){
            // dashboardService.set(dashboard.id, $scope.rows);
          }
        }

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
            // add widget to structure
            instance.close();
          }
          addScope.closeDialog = function(){
            instance.close();
          }
        }

        // format json
        $scope.stringify = function(obj){
          return JSON.stringify(obj, null, 2);
        }
      },
      link: function ($scope, $element, $attr, ngModel) {
        // pass structure attribute to scope
        $scope.structure = $attr.structure;
      },
      templateUrl: 'scripts/dashboard/dashboard.html'
    }
  });