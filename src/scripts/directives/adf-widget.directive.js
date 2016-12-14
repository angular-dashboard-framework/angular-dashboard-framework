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
  .directive('adfWidget', function($injector, $q, $log, $uibModal, $rootScope, dashboard, adfTemplatePath) {

    function preLink($scope) {
      var definition = $scope.definition;

      //passs translate function from dashboard so we can translate labels inside html templates
      $scope.translate = dashboard.translate;

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

          if (!definition.editTemplateUrl) {
            definition.editTemplateUrl = adfTemplatePath + 'widget-edit.html';
            if (w.editTemplateUrl) {
              definition.editTemplateUrl = w.editTemplateUrl;
            }
          }

          if (!definition.titleTemplateUrl) {
            definition.frameless = w.frameless;
          }

          if (!definition.styleClass) {
            definition.styleClass = w.styleClass;
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
            $scope.widgetState.isCollapsed= (w.collapsed === true) ? w.collapsed : false;
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
            deleteScope.translate = dashboard.translate;

            var deleteTemplateUrl = adfTemplatePath + 'widget-delete.html';
            if (definition.deleteTemplateUrl) {
              deleteTemplateUrl = definition.deleteTemplateUrl;
            }
            var opts = {
              scope: deleteScope,
              templateUrl: deleteTemplateUrl,
              windowClass: 'adf-remove-widget-modal',
              backdrop: 'static'
            };
            var instance = $uibModal.open(opts);

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
          editScope.translate = dashboard.translate;
          editScope.definition = angular.copy(definition);

          var adfEditTemplatePath = adfTemplatePath + 'widget-edit.html';
          if (definition.editTemplateUrl) {
            adfEditTemplatePath = definition.editTemplateUrl;
          }

          var opts = {
            scope: editScope,
            templateUrl: adfEditTemplatePath,
            windowClass: 'adf-edit-widget-modal',
            backdrop: 'static'
          };

          var instance = $uibModal.open(opts);

          editScope.closeDialog = function() {
            instance.close();
            editScope.$destroy();
          };

          // TODO create util method
          function createApplyPromise(result){
            var promise;
            if (typeof result === 'boolean'){
              var deferred = $q.defer();
              if (result){
                deferred.resolve();
              } else {
                deferred.reject();
              }
              promise = deferred.promise;
            } else {
              promise = $q.when(result);
            }
            return promise;
          }

          editScope.saveDialog = function() {
            // clear validation error
            editScope.validationError = null;

            // build injection locals
            var widget = $scope.widget;

            // create a default apply method for widgets
            // without edit mode
            // see issue https://goo.gl/KHPQLZ
            var applyFn;
            if (widget.edit){
              applyFn = widget.edit.apply;
            } else {
              applyFn = function(){
                return true;
              };
            }

            // injection locals
            var locals = {
              widget: widget,
              definition: editScope.definition,
              config: editScope.definition.config
            };

            // invoke apply function and apply if success
            var result = $injector.invoke(applyFn, applyFn, locals);
            createApplyPromise(result).then(function(){
              definition.title = editScope.definition.title;
              angular.extend(definition.config, editScope.definition.config);
              if (widget.edit && widget.edit.reload) {
                // reload content after edit dialog is closed
                $scope.$broadcast('widgetConfigChanged');
              }
              editScope.closeDialog();
            }, function(err){
              if (err){
                editScope.validationError = err;
              } else {
                editScope.validationError = 'Validation durring apply failed';
              }
            });
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
      templateUrl: dashboard.customWidgetTemplatePath ? dashboard.customWidgetTemplatePath : adfTemplatePath + 'widget.html',
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
          if (dashboard.idEquals($scope.definition.wid, widget.wid)){
            $scope.edit();
          }
        });

        $scope.widgetClasses = function(w, definition){
          var classes = definition.styleClass || '';
          // w is undefined, if the type of the widget is unknown
          // see issue #216
          if (!w || !w.frameless || $scope.editMode){
            classes += ' panel panel-default';
          }
          return classes;
        };

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

          var instance = $uibModal.open(opts);
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
