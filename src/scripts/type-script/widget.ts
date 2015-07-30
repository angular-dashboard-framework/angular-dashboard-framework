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

    class AdfWidget implements ng.IDirective {

        static $inject = ['$log', '$modal', 'dashboard', 'adfTemplatePath'];

        static instance( $log: ng.ILogService, $modal: angular.ui.bootstrap.IModalService,  dashboard: any,  adfTemplatePath: string ){

            return new AdfWidget($log, $modal, dashboard, adfTemplatePath);
        }
        constructor(private $log:ng.ILogService, private  $modal:angular.ui.bootstrap.IModalService, private dashboard:any, private adfTemplatePath:string) {
            this.compile = this.compileFn.bind(this);
        }
        replace = true;
        restrict = 'EA';
        transclude = false;
        templateUrl = this.adfTemplatePath + 'widget.html';
        scope = {
            definition: '=',
        col: '=column',
        editMode: '=',
        options: '=',
        widgetState: '='
        }
        compile: ng.IDirectiveCompileFn;

    controller = $scope => {
        $scope.openFullScreen = () => {
            var definition = $scope.definition;
            var fullScreenScope = $scope.$new();
            var opts = {
                scope: fullScreenScope,
                templateUrl: this.adfTemplatePath + 'widget-fullscreen.html',
                size: definition.modalSize || 'lg', // 'sm', 'lg'
                backdrop: 'static',
                windowClass: (definition.fullScreen) ? 'dashboard-modal widget-fullscreen' : 'dashboard-modal'
            };

            var instance = this.$modal.open(opts);
            fullScreenScope.closeDialog = () => {
                instance.close();
                fullScreenScope.$destroy();
            };
        };
    }

    compileFn () {

        /**
         * use pre link, because link of widget-content
         * is executed before post link widget
         */
        return {
            pre: this.preLinkFn.bind(this),
            post: this.postLinkFn.bind(this)
        };
    }

     preLinkFn($scope) {
        var definition = $scope.definition;
        if (definition) {
            var w = this.dashboard.widgets[definition.type];
            if (w) {
                // pass title
                if (!definition.title) {
                    definition.title = w.title;
                }

                if (!definition.titleTemplateUrl) {
                    definition.titleTemplateUrl = this.adfTemplatePath + 'widget-title.html';
                }

                // set id for sortable
                if (!definition.wid) {
                    definition.wid = this.dashboard.id();
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
                this.$log.warn('could not find widget ' + definition.type);
            }
        } else {
            this.$log.debug('definition not specified, widget was probably removed');
        }
    }

     postLinkFn($scope, $element) {
        var definition = $scope.definition;
        if (definition) {
            // bind close function
            $scope.close = () => {
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
            $scope.reload = () => {
                $scope.$broadcast('widgetReload');
            };

            // bind edit function
            $scope.edit = () => {
                var editScope = $scope.$new();

                var opts = {
                    scope: editScope,
                    templateUrl: this.adfTemplatePath + 'widget-edit.html',
                    backdrop: 'static'
                };

                var instance = this.$modal.open(opts);
                editScope.closeDialog = () => {
                    instance.close();
                    editScope.$destroy();

                    var widget = $scope.widget;
                    if (widget.edit && widget.edit.reload) {
                        // reload content after edit dialog is closed
                        $scope.$broadcast('widgetConfigChanged');
                    }
                };
            };
        } else {
            this.$log.debug('widget not found');
        }
    }

    }


    angular.module('adf')
        .directive('adfWidget', ['$log', '$modal', 'dashboard', 'adfTemplatePath', AdfWidget.instance]);
}
