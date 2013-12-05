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
  .directive('widget', function($log, $modal, dashboard) {

    function preLink($scope, $element, $attr){
      var definition = $scope.definition;
      if (definition) {
        var w = dashboard.widgets[definition.type];
        if (w) {

          // pass edit mode
          $scope.editMode = $attr.editMode;

          // pass copy of widget to scope
          $scope.widget = angular.copy(w);

          // create config object
          var config = definition.config;
          if (config) {
            if (angular.isString(config)) {
              config = angular.fromJson(config);
            }
          } else {
            config = {};
          }

          // pass config to scope
          $scope.config = config;
        } else {
          $log.warn('could not find widget ' + type);
        }
      } else {
        $log.debug('definition not specified, widget was probably removed');
      }
    }
    
    function postLink($scope, $element, $attr) {
      var definition = $scope.definition;
      if (definition) {
        // bind close function
        $scope.close = function() {
          var column = $scope.col;
          if (column) {
            var index = column.widgets.indexOf(definition);
            if (index >= 0) {
              column.widgets.splice(index, 1);
            }
          }
          $element.remove();
        };

        // bind edit function
        $scope.edit = function() {
          var editScope = $scope.$new();
          // editScope.config = config;

          var opts = {
            scope: editScope,
            templateUrl: 'scripts/dashboard/widget-edit.html'
          };

          var widget = $scope.widget;
          if (widget.edit.controller) {
            opts.controller = widget.edit.controller;
          }

          var instance = $modal.open(opts);
          editScope.closeDialog = function() {
            instance.close();
            editScope.$destroy();
            $scope.$broadcast('widgetConfigChanged');
          };
        };
      } else {
        $log.debug('widget not found');
      }
    }

    return {
      replace: true,
      restrict: 'EA',
      transclude: false,
      templateUrl: 'scripts/dashboard/widget.html',
      scope: {
        definition: '=',
        col: '=column',
        editMode: '@'
      },
      compile: function compile($element, $attr, transclude) {
        
        /**
         * use pre link, because link of widget-content
         * is executed before post link widget
         */ 
        return {
          pre: preLink,
          post: postLink
        };
      }
    };

  });