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


/* global angular */
module Adf {
    declare var Sortable;

    interface IAdfDashboardColumnLinkScope extends ng.IScope {
        column:any;
        adfModel:any;
    }

    class AdfDashboardColumn {
        restrict = 'E';
        replace = true;
        scope = {
            column: '=',
        editMode: '=',
        adfModel: '=',
        options: '='
    }
    templateUrl = this.adfTemplatePath + 'dashboard-column.html';
    link : ng.IDirectiveLinkFn;

    static $inject = ['$log', '$compile', 'adfTemplatePath', 'rowTemplate', 'dashboard'];

    static instance($log: ng.ILogService,  $compile: ng.ICompileService, adfTemplatePath: String,  rowTemplate: ng.IAugmentedJQuery,  dashboard: any) {

        return new AdfDashboardColumn($log, $compile, adfTemplatePath, rowTemplate, dashboard);
    }
        constructor(private $log: ng.ILogService, private  $compile: ng.ICompileService, private adfTemplatePath: String, private rowTemplate: ng.IAugmentedJQuery,private dashboard: any) {
            this.link = this.linkFn.bind(this);
        }
       moveWidgetInColumn($scope: ng.IScope, column: IColumn, evt: any) {
        var widgets = column.widgets;
        // move widget and apply to scope
        $scope.$apply(() => {
            widgets.splice(evt.newIndex, 0, widgets.splice(evt.oldIndex, 1)[0]);
        });
    }

    /**
     * finds a widget by its id in the column
     */
   private   findWidget(column: any, index: any) {
        var widget = null;
        for (var i = 0; i < column.widgets.length; i++) {
            var w = column.widgets[i];
            if (w.wid === index) {
                widget = w;
                break;
            }
        }
        return widget;
    }

    /**
     * finds a column by its id in the model
     */
   private   findColumn(model: any, index: any) {
        var column = null;
        for (var i = 0; i < model.rows.length; i++) {
            var r = model.rows[i];
            for (var j = 0; j < r.columns.length; j++) {
                var c = r.columns[j];
                if (c.cid === index) {
                    column = c;
                    break;
                } else if (c.rows) {
                    column = this.findColumn(c, index);
                }
            }
            if (column) {
                break;
            }
        }
        return column;
    }

    /**
     * get the adf id from an html element
     */
 private     getId(el: Element) {
        var id = el.getAttribute('adf-id');
        return id ? parseInt(id) : -1;
    }

    /**
     * adds a widget to a column
     */
private  addWidgetToColumn($scope: ng.IScope, model: any, targetColumn: IColumn, evt: any) {
        // find source column
        var cid = this.getId(evt.from);
        var sourceColumn = this.findColumn(model, cid);

        if (sourceColumn) {
            // find moved widget
            var wid = this.getId(evt.item);
            var widget = this.findWidget(sourceColumn, wid);

            if (widget) {
                // add new item and apply to scope
                $scope.$apply(() => {
                    if (!targetColumn.widgets) {
                        targetColumn.widgets = [];
                    }

                    targetColumn.widgets.splice(evt.newIndex, 0, widget);
                });
            } else {
                this.$log.warn('could not find widget with id ' + wid);
            }
        } else {
            this.$log.warn('could not find column with id ' + cid);
        }
    }

    /**
     * removes a widget from a column
     */
  private   removeWidgetFromColumn($scope: ng.IScope, column: IColumn, evt: any) {
        // remove old item and apply to scope
        $scope.$apply(() => {
            column.widgets.splice(evt.oldIndex, 1);
        });
    }

    /**
     * enable sortable
     */

  private   applySortable($scope: ng.IScope, $element: ng.IAugmentedJQuery, model: any, column: IColumn) {
        // enable drag and drop
        var el = $element[0];
        var sortable = Sortable.create(el, {
            group: 'widgets',
            handle: '.adf-move',
            ghostClass: 'placeholder',
            animation: 150,
            onAdd(evt) {
                this.addWidgetToColumn($scope, model, column, evt);
            },
            onRemove(evt) {
                this.removeWidgetFromColumn($scope, column, evt);
            },
            onUpdate(evt) {
                this.moveWidgetInColumn($scope, column, evt);
            }
        });

        // destroy sortable on column destroy event
        $element.on('$destroy', () => {
            sortable.destroy();
        });
    }
   private  linkFn($scope: IAdfDashboardColumnLinkScope, $element: ng.IAugmentedJQuery)  {
        // set id
        var col = $scope.column;
        if (!col.cid) {
            col.cid = this.dashboard.id();
        }

        if (angular.isDefined(col.rows) && angular.isArray(col.rows)) {
            // be sure to tell Angular about the injected directive and push the new row directive to the column
            this.$compile(this.rowTemplate)($scope, cloned => {
                $element.append(cloned);
            });
        } else {
            // enable drag and drop for widget only columns
            this.applySortable($scope, $element, $scope.adfModel, col);
        }
    }
    }
   
 

    angular.module('adf')
        .directive('adfDashboardColumn', ['$log', '$compile', 'adfTemplatePath', 'rowTemplate', 'dashboard', AdfDashboardColumn.instance]);
}

