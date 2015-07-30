
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


module Adf {
    interface IAdfDasboardCtrlScope extends ng.IScope {
        name:String;
        adfModel:any;
        adfWidgetFilter:any;
        structure:String;
        model:any;
        editMode: boolean;
        editClass: string;
        toggleEditMode: () => void;
        modelCopy:any;
        cancelEditMode: () => void;
        editDashboardDialog: () => void;
        changeStructure: (name: String, structure: any) => void;
        addWidgetDialog: () => void;
    }

    interface IAdfDashboardLinkFnScope extends ng.IScope {
        options: {
            name: String;
            editable: boolean;
            maximizable: boolean;
            collapsible: boolean;
        };
    }

    interface IAdfDashboardAtributes extends ng.IAttributes {
        name:String;
        maximizable:boolean;
        collapsible:boolean;
        editable:boolean;
    }
   /**
 * @ngdoc directive
 * @name adf.directive:adfDashboard
 * @element div
 * @restrict EA
 * @scope
 * @description
 *
 * `adfDashboard` is a directive which renders the dashboard with all its
 * components. The directive requires a name attribute. The name of the
 * dashboard can be used to store the model.
 *
 * @param {string} name name of the dashboard. This attribute is required.
 * @param {boolean=} editable false to disable the editmode of the dashboard.
 * @param {boolean=} collapsible true to make widgets collapsible on the dashboard.
 * @param {boolean=} maximizable true to add a button for open widgets in a large modal panel.
 * @param {string=} structure the default structure of the dashboard.
 * @param {object=} adfModel model object of the dashboard.
 * @param {function=} adfWidgetFilter function to filter widgets on the add dialog.
 */
    

    class AdfDashboard implements ng.IDirective{

        static $inject = ['$rootScope', '$log', '$modal', 'dashboard', 'adfTemplatePath'];

        static instance($rootScope: ng.IRootScopeService, $log: ng.ILogService, $modal: angular.ui.bootstrap.IModalService,
            dashboard: IDashBoardService, adfTemplatePath: String) {

            return new AdfDashboard($rootScope, $log, $modal, dashboard, adfTemplatePath);
        }

       constructor( private $rootScope: ng.IRootScopeService, private $log: ng.ILogService,  private $modal: angular.ui.bootstrap.IModalService,
                    private dashboard: IDashBoardService, private adfTemplatePath:String) {
           this.link = this.linkFn.bind(this);
       }

       replace = true;
       restrict = 'EA';
       transclude = false;
       scope = {
           structure: '@',
           name: '@',
           collapsible: '@',
           editable: '@',
           maximizable: '@',
           adfModel: '=',
           adfWidgetFilter: '='
       }
       controller = this.controllerFn;
       link : ng.IDirectiveLinkFn;
       templateUrl = this.adfTemplatePath  + 'dashboard.html';


    private    linkFn($scope:IAdfDashboardLinkFnScope, $element:ng.IAugmentedJQuery, $attr: IAdfDashboardAtributes) {
       // pass options to scope
       var options = {
           name: $attr.name,
           editable: true,
           maximizable: this.stringToBoolean($attr.maximizable),
           collapsible: this.stringToBoolean($attr.collapsible)
       };
       if (angular.isDefined($attr.editable)) {
           options.editable = this.stringToBoolean($attr.editable);
       }
       $scope.options = options;
       }
        
       controllerFn($scope: IAdfDasboardCtrlScope) {
        var model: any = {};
        var structure: any = {};
        var widgetFilter: any = null;
        var structureName: any = {};
        var name = $scope.name;

        // Watching for changes on adfModel
        $scope.$watch('adfModel', (oldVal, newVal) => {
            // has model changed or is the model attribute not set
            if (newVal !== null || (oldVal === null && newVal === null)) {
                model = $scope.adfModel;
                widgetFilter = $scope.adfWidgetFilter;
                if (!model || !model.rows) {
                    structureName = $scope.structure;
                    structure = this.dashboard.structures[structureName];
                    if (structure) {
                        if (model) {
                            model.rows = angular.copy(structure).rows;
                        } else {
                            model = angular.copy(structure);
                        }
                        model.structure = structureName;
                    } else {
                        this.$log.error('could not find structure ' + structureName);
                    }
                }

                if (model) {
                    if (!model.title) {
                        model.title = 'Dashboard';
                    }
                    if (!model.titleTemplateUrl) {
                        model.titleTemplateUrl = this.adfTemplatePath + 'dashboard-title.html';
                    }
                    $scope.model = model;
                } else {
                    this.$log.error('could not find or create model');
                }
            }
        }, true);

        // edit mode
        $scope.editMode = false;
        $scope.editClass = '';

        $scope.toggleEditMode = () => {
            $scope.editMode = !$scope.editMode;
            if ($scope.editMode) {
                $scope.modelCopy = angular.copy($scope.adfModel, {});
            }

            if (!$scope.editMode) {
                this.$rootScope.$broadcast('adfDashboardChanged', name, model);
            }
        };

        $scope.cancelEditMode = () => {
            $scope.editMode = false;
            $scope.modelCopy = angular.copy($scope.modelCopy, $scope.adfModel);
            this.$rootScope.$broadcast('adfDashboardEditsCancelled');
        };

        // edit dashboard settings
        $scope.editDashboardDialog = () => {
            var editDashboardScope: any = $scope.$new();
            // create a copy of the title, to avoid changing the title to
            // "dashboard" if the field is empty
            editDashboardScope.copy = {
                title: model.title
            };
            editDashboardScope.structures = this.dashboard.structures;
            var instance = this.$modal.open({
                scope: editDashboardScope,
                templateUrl: this.adfTemplatePath + 'dashboard-edit.html',
                backdrop: 'static'
            });
            $scope.changeStructure = (name, structure) => {
                this.$log.info('change structure to ' + name);
                this.changeStructure(model, structure);
            };
            editDashboardScope.closeDialog = () => {
                // copy the new title back to the model
                model.title = editDashboardScope.copy.title;
                // close modal and destroy the scope
                instance.close();
                editDashboardScope.$destroy();
            };
        };

        // add widget dialog
        $scope.addWidgetDialog = () => {
            var addScope: any = $scope.$new();
            var model = $scope.model;
            var widgets;
            if (angular.isFunction(widgetFilter)) {
                widgets = {};
                angular.forEach(this.dashboard.widgets, (widget, type) => {
                    if (widgetFilter(widget, type, model)) {
                        widgets[type] = widget;
                    }
                });
            } else {
                widgets = this.dashboard.widgets;
            }
            addScope.widgets = widgets;
            var opts = {
                scope: addScope,
                templateUrl: this.adfTemplatePath + 'widget-add.html',
                backdrop: 'static'
            };
            var instance = this.$modal.open(opts);
            addScope.addWidget = widget => {
                var w = {
                    type: widget,
                    config: this.createConfiguration(widget)
                };
                this.addNewWidgetToModel(model, w);
                this.$rootScope.$broadcast('adfWidgetAdded', name, model, w);
                // close and destroy
                instance.close();
                addScope.$destroy();
            };
            addScope.closeDialog = () => {
                // close and destroy
                instance.close();
                addScope.$destroy();
            };
        };
    }



        
    private     stringToBoolean(string): boolean {
        switch (angular.isDefined(string) ? string.toLowerCase() : null) {
            case 'true': case 'yes': case '1': return true;
            case 'false': case 'no': case '0': case null: return false;
            default: return Boolean(string);
        }
    }

    /**
          * Copy widget from old columns to the new model
          * @param object root the model
          * @param array of columns
          * @param counter
          */
   private   copyWidgets(source, target) {
        if (source.widgets && source.widgets.length > 0) {
            var w = source.widgets.shift();
            while (w) {
                target.widgets.push(w);
                w = source.widgets.shift();
            }
        }
    }


  private    fillStructure(root, columns: IColumn, counter?: number) {
        counter = counter || 0;

        if (angular.isDefined(root.rows)) {
            angular.forEach(root.rows, row => {
                angular.forEach(row.columns, column => {
                    // if the widgets prop doesn't exist, create a new array for it.
                    // this allows ui.sortable to do it's thing without error
                    if (!column.widgets) {
                        column.widgets = [];
                    }

                    // if a column exist at the counter index, copy over the column
                    if (angular.isDefined(columns[counter])) {
                        // do not add widgets to a column, which uses nested rows
                        if (!angular.isDefined(column.rows)) {
                            this.copyWidgets(columns[counter], column);
                            counter++;
                        }
                    }

                    // run fillStructure again for any sub rows/columns
                    counter = this.fillStructure(column, columns, counter);
                });
            });
        }
        return counter;
    }

    /**
    * Read Columns: recursively searches an object for the 'columns' property
    * @param object model
    * @param array  an array of existing columns; used when recursion happens
    */
   private  readColumns(root, columns?) {
        columns = columns || [];

        if (angular.isDefined(root.rows)) {
            angular.forEach(root.rows, row => {
                angular.forEach(row.columns, col => {
                    columns.push(col);
                    // keep reading columns until we can't any more
                    this.readColumns(col, columns);
                });
            });
        }

        return columns;
    }

 private    changeStructure(model, structure) {
        var columns = this.readColumns(model);
        var counter = 0;

        model.rows = angular.copy(structure.rows);

        while (counter < columns.length) {
            counter = this.fillStructure(model, columns, counter);
        }
    }


   private   createConfiguration(type) {

        var cfg = {};
        var config = this.dashboard.widgets[type].config;
        if (config) {
            cfg = angular.copy(config);
        }
        return cfg;
     }
         /**
         * Find first widget column in model.
         *
         * @param dashboard model
         */
         findFirstWidgetColumn(model) {
        var column = null;
        if (!angular.isArray(model.rows)) {
            this.$log.error('model does not have any rows');
            return null;
        }
        for (var i = 0; i < model.rows.length; i++) {
            var row = model.rows[i];
            if (angular.isArray(row.columns)) {
                for (var j = 0; j < row.columns.length; j++) {
                    var col = row.columns[j];
                    if (!col.rows) {
                        column = col;
                        break;
                    }
                }
            }
            if (column) {
                break;
            }
        }
        return column;
    }

    /**
     * Adds the widget to first column of the model.
     *
     * @param dashboard model
     * @param widget to add to model
     */
 private    addNewWidgetToModel(model, widget) {
        if (model) {
            var column = this.findFirstWidgetColumn(model);
            if (column) {
                if (!column.widgets) {
                    column.widgets = [];
                }
                column.widgets.unshift(widget);
            } else {
                this.$log.error('could not find first widget column');
            }
        } else {
            this.$log.error('model is undefined');
        }
    }



   }


    angular.module('adf')
        .directive('adfDashboard', ['$rootScope', '$log', '$modal', 'dashboard', 'adfTemplatePath', AdfDashboard.instance]);
}
