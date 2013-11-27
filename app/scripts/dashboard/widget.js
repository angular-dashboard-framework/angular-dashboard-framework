'use strict';

angular.module('dashboard')
  .directive('widget', function($q, $log, $compile, $controller, $injector, $modal, dashboard){

    var compileWidget = function($scope, $element, widget, config){
      // render copy of widget
      var contentEl = $element.find('div.panel-content');
      contentEl.html(dashboard.loadingTemplate);

      // create new scope for widget & controller
      var templateScope = $scope.$new();

      // local injections
      var base = {
        $scope: templateScope,
        widget: widget,
        config: config,
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
        var templateCtrl = $controller(widget.controller, locals);
        contentEl.html(template);
        contentEl.children().data('$ngControllerController', templateCtrl);
        $compile( contentEl.contents() )( templateScope );
      }, function(reason){
        // handle promise rejection
        contentEl.empty();
        $scope.error = 'Could not resolve all promises';
        if (reason){
          $scope.error += ': ' + reason;
        }
      });
    }

    var renderWidget = function ($scope, $element, type, config, editMode){
      var w = dashboard.widgets[type];
      if (w){
        // create a copy
        var widget = angular.copy(w);

        // pass edit mode
        $scope.editMode = editMode;

        // pass widget to scope
        $scope.widget = widget;

        // create config object
        if (config){
          if (angular.isString(config)){
            config = angular.fromJson(config);
          }
        } else {
          config = {};
        }

        // bind close function
        $scope.close = function(){
          $element.remove();
        }

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
            // recompile widget
            compileWidget($scope, $element, widget, config);
          }
        }

        compileWidget($scope, $element, widget, config);
      } else {
        $log.warn('could not find widget ' + type);
      }
    }

    return {
      replace: true,
      restrict: 'EA',
      transclude : false,
      templateUrl: 'scripts/dashboard/widget.html',
      scope: {
        type: '@',
        config: '@',
        editMode: '@'
      },
      link: function ($scope, $element, $attr) {
        var type = $attr.type;
        if ( type ){
          renderWidget($scope, $element, type, $attr.config, $attr.editMode);
        } else {
          $log.warn('type not specified');
        }
      }
    }

  });