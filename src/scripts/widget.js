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

'use strict';

angular.module('adf')
  .directive('adfWidget', function($log, $modal, dashboard, adfTemplatePath) {

    function stringToBoolean(string){
      switch(angular.isDefined(string) ? string.toLowerCase() : null){
        case 'true': case 'yes': case '1': return true;
        case 'false': case 'no': case '0': case null: return false;
        default: return Boolean(string);
      }
    }

    function preLink($scope){
      var definition = $scope.definition;
      if (definition) {
        var w = dashboard.widgets[definition.type];
        if (w) {
          // pass title
          if (!definition.title){
            definition.title = w.title;
          }
          
          $scope.fullScreen = definition.fullScreen;
          $scope.modalSize = definition.modalSize;

          // set id for sortable
          if (!definition.wid){
            definition.wid = dashboard.id();
          }

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

          // convert collapsible to string
          $scope.collapsible = stringToBoolean($scope.collapsible);

          // collapse
          $scope.isCollapsed = false;
        } else {
          $log.warn('could not find widget ' + definition.type);
        }
      } else {
        $log.debug('definition not specified, widget was probably removed');
      }
    }

    function postLink($scope, $element) {
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

        // bind reload function
        $scope.reload = function(){
          $scope.$broadcast('widgetReload');
        };

        // bind edit function
        $scope.edit = function() {
          var editScope = $scope.$new();

          var opts = {
            scope: editScope,
            templateUrl: adfTemplatePath + 'widget-edit.html'
          };

          var instance = $modal.open(opts);
          editScope.closeDialog = function() {
            instance.close();
            editScope.$destroy();

            var widget = $scope.widget;
            if (widget.edit && widget.edit.reload){
              // reload content after edit dialog is closed
              $scope.$broadcast('widgetConfigChanged');
            }
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
      templateUrl: adfTemplatePath + 'widget.html',
      scope: {
        definition: '=',
        col: '=column',
        editMode: '=',
        collapsible: '='
      },
      
      controller: function ($scope) {
        $scope.openFullScreen = function () {
        var fullScreenScope = $scope.$new();
        var controller;
        var template;
        angular.forEach(dashboard.widgets, function (widget) {
         if (widget.title === $scope.definition.title) {
          controller = widget.controller;
          template = widget.templateUrl
         }
        });
 
        var opts = {
          scope: fullScreenScope,
          templateUrl: adfTemplatePath + 'widget-fullscreen.html',
          size: $scope.modalSize || 'lg', // 'sm', 'lg'
          windowClass: ($scope.fullScreen) ? 'dashboard-modal widget-fullscreen' : 'dashboard-modal'
        };
 
        var instance = $modal.open(opts);
         fullScreenScope.closeDialog = function () {
          instance.close();
          fullScreenScope.$destroy();
         }
        };
      },

      compile: function compile(){

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
