/*
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
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/


/* global angular */
angular.module('adf')
  .directive('adfDashboardColumn', function ($log, $compile, $rootScope, adfTemplatePath, rowTemplate, dashboard) {
    'use strict';

    /**
     * enable sortable
     */
    function applySortable($scope){

      // enable drag and drop
      $scope.sortableConfig = {
        group: 'widgets',
        handle: '.adf-move',
        ghostClass: 'placeholder',
        animation: 150
      };
    }

    return {
      restrict: 'E',
      replace: true,
      scope: {
        column: '=',
        editMode: '=',
        continuousEditMode: '=',
        adfModel: '=',
        options: '='
      },
      templateUrl: adfTemplatePath + 'dashboard-column.html',
      controller: function($scope) {

        $scope.hasNestedRows = function(){
          return angular.isDefined($scope.column.rows) && angular.isArray($scope.column.rows);
        };

        if(!$scope.hasNestedRows()) {
          applySortable($scope);
        }
      },
      link: function ($scope, $element) {
        // set id
        var col = $scope.column;
        if (!col.cid){
          col.cid = dashboard.id();
        }

        if ($scope.hasNestedRows()) {
          // be sure to tell Angular about the injected directive and push the new row directive to the column
          $compile(rowTemplate)($scope, function(cloned) {
            $element.append(cloned);
          });
        }
        //else {
        //  // enable drag and drop for widget only columns
        //  applySortable($scope);
        //}
      }
    };
  });
