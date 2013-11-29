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
  .directive('widget', function($q, $log, $compile, $controller, $injector, $modal, dashboard){

    var compileWidget = function($scope, $element, widget, config){
      // clear errors
      $scope.error = "";

      // render copy of widget
      var contentEl = $element.find('div.panel-content');
      contentEl.html(dashboard.loadingTemplate);

      // create new scope for widget & controller
      var templateScope = $scope.$new();

      // pass config to templateScope
      templateScope.config = config;

      // local injections
      var base = {
        $scope: templateScope,
        widget: widget,
        config: config
      };

      // get resolve promises from widget
      var resolvers = {};
      resolvers['$tpl'] = dashboard.getTemplate(widget);
      if (widget.resolve){
        angular.forEach(widget.resolve, function(promise, key){
          if (angular.isString(promise)){
            resolvers[key] = $injector.get(promise);
          } else {
            resolvers[key] = $injector.invoke(promise, promise, base);
          }
        });
      }

      // resolve all resolvers
      $q.all(resolvers).then(function(locals){
        angular.extend(locals, base);

        // compile & render template
        var template = locals['$tpl'];
        contentEl.html(template);
        if (widget.controller){
          var templateCtrl = $controller(widget.controller, locals);
          contentEl.children().data('$ngControllerController', templateCtrl);
        }
        $compile( contentEl.contents() )( templateScope );
      }, function(reason){
        // handle promise rejection
        contentEl.empty();
        $scope.error = 'Could not resolve all promises';
        if (reason){
          $scope.error += ': ' + reason;
        }
      });
    };

    var renderWidget = function ($scope, $element, definition, column, editMode){
      var type = definition.type;
      var w = dashboard.widgets[type];
      if (w){
        // create a copy
        var widget = angular.copy(w);

        // pass edit mode
        $scope.editMode = editMode;

        // pass widget to scope
        $scope.widget = widget;

        // create config object
        var config = definition.config;
        if (config){
          if (angular.isString(config)){
            config = angular.fromJson(config);
          }
        } else {
          config = {};
        }

        // bind close function
        $scope.close = function(){
          if (column){
            var index = column.widgets.indexOf(definition);
            if (index >= 0){
              column.widgets.splice(index, 1);
            }
          }
        };

        // bind edit function
        $scope.edit = function(){
          var editScope = $scope.$new();
          editScope.config = config;

          var opts = {
            scope: editScope,
            templateUrl: 'scripts/dashboard/widget-edit.html'            
          };

          if (widget.edit.controller){
            opts.controller = widget.edit.controller;
          }

          var instance = $modal.open(opts);
          editScope.closeDialog = function(){
            instance.close();
            editScope.$destroy();
            
            // recompile widget
            compileWidget($scope, $element, widget, config);
          };
        };

        compileWidget($scope, $element, widget, config);
      } else {
        $log.warn('could not find widget ' + type);
      }
    };

    return {
      replace: true,
      restrict: 'EA',
      transclude : false,
      templateUrl: 'scripts/dashboard/widget.html',
      scope: {
        definition: '=',
        col: '=column',
        editMode: '@'
      },
      link: function ($scope, $element, $attr) {
        var definition = $scope.definition;
        if ( definition ){
          renderWidget($scope, $element, definition, $scope.col, $attr.editMode);
        } else {
          $log.debug('definition not specified, widget was probably removed');
          $element.remove();
        }
      }
    };

  });