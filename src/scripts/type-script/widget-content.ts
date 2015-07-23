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

 /// <reference path="./libs/angular.d.ts" />

'use strict';

// angular.module('adf')
//   .directive('adfWidgetContent', function($log, $q, $sce, $http, $templateCache,
//     $compile, $controller, $injector, dashboard) {

//     function parseUrl(url){
//       var parsedUrl = url;
//       if ( url.indexOf('{widgetsPath}') >= 0 ){
//         parsedUrl = url.replace('{widgetsPath}', dashboard.widgetsPath)
//                        .replace('//', '/');
//         if (parsedUrl.indexOf('/') === 0){
//           parsedUrl = parsedUrl.substring(1);
//         }
//       }
//       return parsedUrl;
//     }

//     function getTemplate(widget){
//       var deferred = $q.defer();

//       if ( widget.template ){
//         deferred.resolve(widget.template);
//       } else if (widget.templateUrl) {
//         // try to fetch template from cache
//         var tpl = $templateCache.get(widget.templateUrl);
//         if (tpl){
//           deferred.resolve(tpl);
//         } else {
//           var url = $sce.getTrustedResourceUrl(parseUrl(widget.templateUrl));
//           $http.get(url)
//             .success(function(response){
//               // put response to cache, with unmodified url as key
//               $templateCache.put(widget.templateUrl, response);
//               deferred.resolve(response);
//             })
//             .error(function(){
//               deferred.reject('could not load template');
//             });
//         }
//       }

//       return deferred.promise;
//     }

//     function compileWidget($scope, $element, currentScope) {
//       var model = $scope.model;
//       var content = $scope.content;

//       // display loading template
//       $element.html(dashboard.loadingTemplate);

//       // create new scope
//       var templateScope = $scope.$new();

//       // pass config object to scope
//       if (!model.config) {
//         model.config = {};
//       }

//       templateScope.config = model.config;

//       // local injections
//       var base = {
//         $scope: templateScope,
//         widget: model,
//         config: model.config
//       };

//       // get resolve promises from content object
//       var resolvers = {};
//       resolvers.$tpl = getTemplate(content);
//       if (content.resolve) {
//         angular.forEach(content.resolve, function(promise, key) {
//           if (angular.isString(promise)) {
//             resolvers[key] = $injector.get(promise);
//           } else {
//             resolvers[key] = $injector.invoke(promise, promise, base);
//           }
//         });
//       }

//       // resolve all resolvers
//       $q.all(resolvers).then(function(locals) {
//         angular.extend(locals, base);

//         // compile & render template
//         var template = locals.$tpl;
//         $element.html(template);
//         if (content.controller) {
//           var templateCtrl = $controller(content.controller, locals);
//           if (content.controllerAs){
//             templateScope[content.controllerAs] = templateCtrl;
//           }
//           $element.children().data('$ngControllerController', templateCtrl);
//         }
//         $compile($element.contents())(templateScope);
//       }, function(reason) {
//         // handle promise rejection
//         var msg = 'Could not resolve all promises';
//         if (reason) {
//           msg += ': ' + reason;
//         }
//         $log.warn(msg);
//         $element.html(dashboard.messageTemplate.replace(/{}/g, msg));
//       });

//       // destroy old scope
//       if (currentScope){
//         currentScope.$destroy();
//       }

//       return templateScope;
//     }

//     return {
//       replace: true,
//       restrict: 'EA',
//       transclude: false,
//       scope: {
//         model: '=',
//         content: '='
//       },
//       link: function($scope, $element) {
//         var currentScope = compileWidget($scope, $element, null);
//         $scope.$on('widgetConfigChanged', function(){
//           currentScope = compileWidget($scope, $element, currentScope);
//         });
//         $scope.$on('widgetReload', function(){
//           currentScope = compileWidget($scope, $element, currentScope);
//         });
//       }
//     };

//   });

// ----------------- // ----------------- // ----------------- // ----------------- // ---------------

 module Widget {

  interface scopeType implements ng.IScope {
    model: string;
    content: string;
  }

  interface adfWidgetContentType implements ng.IDirective {
    constructor(public $log: ng.ILogService, public $q: ng.IQService, public $sce: ng.ISCEService, public $http: ng.ITemplateRequestService, 
      public $templateCache: ng.ITemplateCacheService, public $compile: ng.ICompileService, public $controller: ng.IControllerService, 
      public $injector: ng.IInjectorService, public dashboard: any) : void;

    parseUrl(url: string): string;
    getTemplate(widget: any): any;
    compileWidget($scope: ng.IScope, $element: ng.IAugmentedJQuery, currentScope: ng.IScope) : string;
  }

  export class AdfWidgetContent implements adfWidgetContentType {
    public scope: scopeType;

    constructor(public $log,public  $q,public $sce,public $http,public $templateCache,
                public $compile, public $controller, public $injector, public dashboard) {

      this.replace  = true,
      this.restrict = 'EA',
      this.transclude = false,
      this.scope = {
        model: '=',
        content: '='
      },
      this.link = function($scope, $element) {
        var currentScope = this.compileWidget($scope, $element, null);
        $scope.$on('widgetConfigChanged', function(){
          currentScope = this.compileWidget($scope, $element, currentScope);
        });
        $scope.$on('widgetReload', function(){
          currentScope = this.compileWidget($scope, $element, currentScope);
        });
      }
    }

    parseUrl(url) {
      var parsedUrl = url;
        if ( url.indexOf('{widgetsPath}') >= 0 ){
          parsedUrl = url.replace('{widgetsPath}', this.dashboard.widgetsPath)
                         .replace('//', '/');
          if (parsedUrl.indexOf('/') === 0){
            parsedUrl = parsedUrl.substring(1);
          }
        }
        return parsedUrl;
    }

    getTemplate(widget){
      var deferred = this.$q.defer();

      if ( widget.template ){
        deferred.resolve(widget.template);
      } else if (widget.templateUrl) {
        // try to fetch template from cache
        var tpl = this.$templateCache.get(widget.templateUrl);
        if (tpl){
          deferred.resolve(tpl);
        } else {
          var url = this.$sce.getTrustedResourceUrl(this.parseUrl(widget.templateUrl));
          this.$http.get(url)
            .success(function(response){
              // put response to cache, with unmodified url as key
              this.$templateCache.put(widget.templateUrl, response);
              deferred.resolve(response);
            })
            .error(function(){
              deferred.reject('could not load template');
            });
        }
      }

      return deferred.promise;
    }

    compileWidget($scope, $element, currentScope) {
        var model = $scope.model;
        var content = $scope.content;

        // display loading template
        $element.html(this.dashboard.loadingTemplate);

        // create new scope
        var templateScope = $scope.$new();

        // pass config object to scope
        if (!model.config) {
          model.config = {};
        }

        templateScope.config = model.config;

        // local injections
        var base = {
          $scope: templateScope,
          widget: model,
          config: model.config
        };

        // get resolve promises from content object
        var resolvers = {};
        resolvers.$tpl = this.getTemplate(content);
        if (content.resolve) {
          angular.forEach(content.resolve, function(promise, key) {
            if (angular.isString(promise)) {
              resolvers[key] = this.$injector.get(promise);
            } else {
              resolvers[key] = this.$injector.invoke(promise, promise, base);
            }
          });
        }

        // resolve all resolvers
        this.$q.all(resolvers).then(function(locals) {
          angular.extend(locals, base);

          // compile & render template
          var template = locals.$tpl;
          $element.html(template);
          if (content.controller) {
            var templateCtrl = this.$controller(content.controller, locals);
            if (content.controllerAs){
              templateScope[content.controllerAs] = templateCtrl;
            }
            $element.children().data('$ngControllerController', templateCtrl);
          }
          this.$compile($element.contents())(templateScope);
        }, function(reason) {
          // handle promise rejection
          var msg = 'Could not resolve all promises';
          if (reason) {
            msg += ': ' + reason;
          }
          this.$log.warn(msg);
          $element.html(this.dashboard.messageTemplate.replace(/{}/g, msg));
        });

        // destroy old scope
        if (currentScope){
          currentScope.$destroy();
        }

        return templateScope;
      }
  }
}

angular.module('adf')
  .directive('adfWidgetContent', ['$log', '$q', '$sce', '$http', '$templateCache', '$compile', '$controller', '$injector', 'dashboard', 
    ($log, $q, $sce, $http, $templateCache, $compile, $controller, $injector, dashboard) 
      => new Widget.AdfWidgetContent($log, $q, $sce, $http, $templateCache, $compile, $controller, $injector, dashboard)
  ]);