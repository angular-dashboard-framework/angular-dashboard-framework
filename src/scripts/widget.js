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
  .directive('adfWidget', function($log, $modal, $rootScope, dashboard, adfTemplatePath) {

    function preLink($scope) {
      var definition = $scope.definition;
      if (definition) {
        var w = dashboard.widgets[definition.type];
        if (w) {
          // pass title
          if (!definition.title) {
            definition.title = w.title;
          }

          if (!definition.titleTemplateUrl) {
            definition.titleTemplateUrl = adfTemplatePath + 'widget-title.html';
            if (w.titleTemplateUrl) {
              definition.titleTemplateUrl = w.titleTemplateUrl;
            }
          }

          if (!definition.titleTemplateUrl) {
            definition.frameless = w.frameless;
          }

          // set id for sortable
          if (!definition.wid) {
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

          // collapse exposed $scope.widgetState property
          if (!$scope.widgetState) {
            $scope.widgetState = {};
            $scope.widgetState.isCollapsed = false;
          }

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

        var deleteWidget = function() {
          var column = $scope.col;
          if (column) {
            var index = column.widgets.indexOf(definition);
            if (index >= 0) {
              column.widgets.splice(index, 1);
            }
          }
          $element.remove();
          $rootScope.$broadcast('adfWidgetRemovedFromColumn');
        };

        $scope.remove = function() {
          if ($scope.options.enableConfirmDelete) {
            var deleteScope = $scope.$new();
            var deleteTemplateUrl = adfTemplatePath + 'widget-delete.html';
            if (definition.deleteTemplateUrl) {
              deleteTemplateUrl = definition.deleteTemplateUrl;
            }
            var opts = {
              scope: deleteScope,
              templateUrl: deleteTemplateUrl,
              backdrop: 'static'
            };
            var instance = $modal.open(opts);

            deleteScope.closeDialog = function() {
              instance.close();
              deleteScope.$destroy();
            };
            deleteScope.deleteDialog = function() {
              deleteWidget();
              deleteScope.closeDialog();
            };
          } else {
            deleteWidget();
          }
        };

        // bind reload function
        $scope.reload = function() {
          $scope.$broadcast('widgetReload');
        };

        // bind edit function
        $scope.edit = function() {
          var editScope = $scope.$new();
          editScope.definition = angular.copy(definition);

          var adfEditTemplatePath = adfTemplatePath + 'widget-edit.html';
          if (definition.editTemplateUrl) {
            adfEditTemplatePath = definition.editTemplateUrl;
          }

          var opts = {
            scope: editScope,
            templateUrl: adfEditTemplatePath,
            backdrop: 'static'
          };

          var instance = $modal.open(opts);
          editScope.closeDialog = function() {
            instance.close();
            editScope.$destroy();
          };
          editScope.saveDialog = function() {
            definition.title = editScope.definition.title;
            angular.extend(definition.config, editScope.definition.config);
            var widget = $scope.widget;
            if (widget.edit && widget.edit.reload) {
                // reload content after edit dialog is closed
                $scope.$broadcast('widgetConfigChanged');
            }
            editScope.closeDialog();
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
        options: '=',
        widgetState: '='
      },
      controller: function($scope) {

        $scope.$on('adfDashboardCollapseExpand', function(event, args) {
          $scope.widgetState.isCollapsed = args.collapseExpandStatus;
        });

        $scope.$on('adfWidgetEnterEditMode', function(event, widget){
          if ($scope.definition.wid === widget.wid){
            $scope.edit();
          }
        });

        $scope.openFullScreen = function() {
          var definition = $scope.definition;
          var fullScreenScope = $scope.$new();
          var opts = {
            scope: fullScreenScope,
            templateUrl: adfTemplatePath + 'widget-fullscreen.html',
            size: definition.modalSize || 'lg', // 'sm', 'lg'
            backdrop: 'static',
            windowClass: (definition.fullScreen) ? 'dashboard-modal widget-fullscreen' : 'dashboard-modal'
          };

          var instance = $modal.open(opts);
          fullScreenScope.closeDialog = function() {
            instance.close();
            fullScreenScope.$destroy();
          };
        };
      },
      compile: function() {

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
