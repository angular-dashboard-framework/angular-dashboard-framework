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

module Adf {
    class AdfWidgetContent {
        replace = true;
        restrict = 'EA';
        transclude = false;
        scope = {
            model: '=',
        content: '='
    };
        link : ng.IDirectiveLinkFn;

        static $inject = ['$log', '$q', '$sce', '$http', '$templateCache', '$compile', '$controller', '$injector', 'dashboard'];

        static instance($log: ng.ILogService, $q: ng.IQService, $sce: ng.ISCEService, $http: ng.IHttpService, $templateCache: ng.ITemplateCacheService,
            $compile: ng.ICompileService, $controller: ng.IControllerService, $injector, dashboard: IDashBoardService) {

            return new AdfWidgetContent($log, $q, $sce, $http, $templateCache, $compile, $controller, $injector, dashboard);
        }

        constructor( private $log: ng.ILogService, private  $q: ng.IQService, private  $sce: ng.ISCEService, private $http: ng.IHttpService, private $templateCache: ng.ITemplateCacheService,
          private  $compile: ng.ICompileService, private $controller: ng.IControllerService,private  $injector, private dashboard: IDashBoardService) {
            this.link = this.linkFn.bind(this);
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
        var resolvers: any = {};
        resolvers.$tpl = this.getTemplate(content);
        if (content.resolve) {
            angular.forEach(content.resolve, (promise, key) => {
                if (angular.isString(promise)) {
                    resolvers[key] = this.$injector.get(promise);
                } else {
                    resolvers[key] = this.$injector.invoke(promise, promise, base);
                }
            });
        }

        // resolve all resolvers
        this.$q.all(resolvers).then((locals: any) => {
            angular.extend(locals, base);

            // compile & render template
            var template = locals.$tpl;
            $element.html(template);
            if (content.controller) {
                var templateCtrl = this.$controller(content.controller, locals);
                if (content.controllerAs) {
                    templateScope[content.controllerAs] = templateCtrl;
                }
                $element.children().data('$ngControllerController', templateCtrl);
            }
            this.$compile($element.contents())(templateScope);
        }, reason => {
            // handle promise rejection
            var msg = 'Could not resolve all promises';
            if (reason) {
                msg += ': ' + reason;
            }
            this.$log.warn(msg);
            $element.html(this.dashboard.messageTemplate.replace(/{}/g, msg));
        });

        // destroy old scope
        if (currentScope) {
            currentScope.$destroy();
        }

        return templateScope;
    }

    linkFn($scope, $element) {
        var currentScope = this.compileWidget($scope, $element, null);
        $scope.$on('widgetConfigChanged', () => {
            currentScope = this.compileWidget($scope, $element, currentScope);
        });
        $scope.$on('widgetReload', () => {
            currentScope = this.compileWidget($scope, $element, currentScope);
        });
    }
     parseUrl(url) {
        var parsedUrl = url;
        if (url.indexOf('{widgetsPath}') >= 0) {
            parsedUrl = url.replace('{widgetsPath}', this.dashboard.widgetsPath)
                .replace('//', '/');
            if (parsedUrl.indexOf('/') === 0) {
                parsedUrl = parsedUrl.substring(1);
            }
        }
        return parsedUrl;
    }

    getTemplate(widget: IWidget) {
        var deferred = this.$q.defer();

        if (widget.template) {
            deferred.resolve(widget.template);
        } else if (widget.templateUrl) {
            // try to fetch template from cache
            var tpl = this.$templateCache.get(widget.templateUrl);
            if (tpl) {
                deferred.resolve(tpl);
            } else {
                var url = this.$sce.getTrustedResourceUrl(this.parseUrl(widget.templateUrl));
                this.$http.get(url)
                    .success(response => {
                        // put response to cache, with unmodified url as key
                        this.$templateCache.put(widget.templateUrl, response);
                        deferred.resolve(response);
                    })
                    .error(() => {
                        deferred.reject('could not load template');
                    });
            }
        }

        return deferred.promise;
    }
    }

angular.module('adf')
    .directive('adfWidgetContent', ['$log', '$q', '$sce', '$http', '$templateCache', '$compile', '$controller', '$injector', 'dashboard', AdfWidgetContent.instance]);
}