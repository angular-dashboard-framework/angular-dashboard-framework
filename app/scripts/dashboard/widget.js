'use strict';

angular.module('dashboard')
  .directive('widget', function($q, $log, $compile, $controller, $injector, dashboard){

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

        // render copy of widget
        var contentEl = $element.find('div.panel-body');
        contentEl.html(dashboard.loadingTemplate);

        var templateScope = $scope.$new();

        // local injections
        var base = {
          $scope: templateScope,
          widget: widget,
          config: config,
        };

        var resolvers = {};
        resolvers['$tpl'] = dashboard.getTemplate(widget);
        if (widget.resolve){
          angular.forEach(widget.resolve, function(promise, key){
            resolvers[key] = $injector.invoke(promise, promise, base);
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
        });
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