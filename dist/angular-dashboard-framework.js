(function (window, undefined) {
  "use strict";
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

  angular
    .module("adf", ["adf.provider", "ui.bootstrap"])
    .value("adfTemplatePath", "../src/templates/")
    .value(
      "rowTemplate",
      '<adf-dashboard-row row="row" adf-model="adfModel" options="options" edit-mode="editMode" ng-repeat="row in column.rows" />'
    )
    .value(
      "columnTemplate",
      '<adf-dashboard-column column="column" adf-model="adfModel" options="options" edit-mode="editMode" ng-repeat="column in row.columns" />'
    )
    .value("adfVersion", "2.0.0");

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
  angular.module("adf").directive("adfDashboardColumn", [
    "$log",
    "$compile",
    "$rootScope",
    "adfTemplatePath",
    "rowTemplate",
    "dashboard",
    function (
      $log,
      $compile,
      $rootScope,
      adfTemplatePath,
      rowTemplate,
      dashboard
    ) {
      /**
       * moves a widget in between a column
       */
      function moveWidgetInColumn($scope, column, evt) {
        var widgets = column.widgets;
        // move widget and apply to scope
        $scope.$apply(function () {
          widgets.splice(evt.newIndex, 0, widgets.splice(evt.oldIndex, 1)[0]);
          $rootScope.$broadcast("adfWidgetMovedInColumn");
        });
      }

      /**
       * finds a widget by its id in the column
       */
      function findWidget(column, index) {
        var widget = null;
        for (var i = 0; i < column.widgets.length; i++) {
          var w = column.widgets[i];
          if (dashboard.idEquals(w.wid, index)) {
            widget = w;
            break;
          }
        }
        return widget;
      }

      /**
       * finds a column by its id in the model
       */
      function findColumn(model, index) {
        var column = null;
        for (var i = 0; i < model.rows.length; i++) {
          var r = model.rows[i];
          for (var j = 0; j < r.columns.length; j++) {
            var c = r.columns[j];
            if (dashboard.idEquals(c.cid, index)) {
              column = c;
              break;
            } else if (c.rows) {
              column = findColumn(c, index);
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
      function getId(el) {
        var id = el.getAttribute("adf-id");
        return id ? id : "-1";
      }

      /**
       * adds a widget to a column
       */
      function addWidgetToColumn($scope, model, targetColumn, evt) {
        // find source column
        var cid = getId(evt.from);
        var sourceColumn = findColumn(model, cid);

        if (sourceColumn) {
          // find moved widget
          var wid = getId(evt.item);
          var widget = findWidget(sourceColumn, wid);

          if (widget) {
            // add new item and apply to scope
            $scope.$apply(function () {
              if (!targetColumn.widgets) {
                targetColumn.widgets = [];
              }
              targetColumn.widgets.splice(evt.newIndex, 0, widget);

              $rootScope.$broadcast("adfWidgetAddedToColumn");
            });
          } else {
            $log.warn("could not find widget with id " + wid);
          }
        } else {
          $log.warn("could not find column with id " + cid);
        }
      }

      /**
       * removes a widget from a column
       */
      function removeWidgetFromColumn($scope, column, evt) {
        // remove old item and apply to scope
        $scope.$apply(function () {
          column.widgets.splice(evt.oldIndex, 1);
          $rootScope.$broadcast("adfWidgetRemovedFromColumn");
        });
      }

      /**
       * enable sortable
       */
      function applySortable($scope, $element, model, column) {
        // enable drag and drop
        var el = $element[0];
        var sortable = Sortable.create(el, {
          group: "widgets",
          handle: ".adf-move",
          ghostClass: "placeholder",
          animation: 150,
          onAdd: function (evt) {
            addWidgetToColumn($scope, model, column, evt);
          },
          onRemove: function (evt) {
            removeWidgetFromColumn($scope, column, evt);
          },
          onUpdate: function (evt) {
            moveWidgetInColumn($scope, column, evt);
          },
        });

        // destroy sortable on column destroy event
        $element.on("$destroy", function () {
          // check sortable element, before calling destroy
          // see https://github.com/sdorra/angular-dashboard-framework/issues/118
          if (sortable.el) {
            sortable.destroy();
          }
        });
      }

      return {
        restrict: "E",
        replace: true,
        scope: {
          column: "=",
          editMode: "=",
          continuousEditMode: "=",
          adfModel: "=",
          options: "=",
        },
        templateUrl: adfTemplatePath + "dashboard-column.html",
        link: function ($scope, $element) {
          // set id
          var col = $scope.column;
          if (!col.cid) {
            col.cid = dashboard.id();
          }

          if (angular.isDefined(col.rows) && angular.isArray(col.rows)) {
            // be sure to tell Angular about the injected directive and push the new row directive to the column
            $compile(rowTemplate)($scope, function (cloned) {
              $element.append(cloned);
            });
          } else {
            // enable drag and drop for widget only columns
            applySortable($scope, $element, $scope.adfModel, col);
          }
        },
      };
    },
  ]);

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
   * @param {boolean=} enableConfirmDelete true to ask before remove an widget from the dashboard.
   * @param {string=} structure the default structure of the dashboard.
   * @param {object=} adfModel model object of the dashboard.
   * @param {function=} adfWidgetFilter function to filter widgets on the add dialog.
   * @param {boolean=} continuousEditMode enable continuous edit mode, to fire add/change/remove
   *                   events during edit mode not reset it if edit mode is exited.
   */

  angular.module("adf").directive("adfDashboard", [
    "$rootScope",
    "$log",
    "$timeout",
    "$uibModal",
    "dashboard",
    "adfTemplatePath",
    function (
      $rootScope,
      $log,
      $timeout,
      $uibModal,
      dashboard,
      adfTemplatePath
    ) {
      function stringToBoolean(string) {
        switch (angular.isDefined(string) ? string.toLowerCase() : null) {
          case "true":
          case "yes":
          case "1":
            return true;
          case "false":
          case "no":
          case "0":
          case null:
            return false;
          default:
            return Boolean(string);
        }
      }

      function copyWidgets(source, target) {
        if (source.widgets && source.widgets.length > 0) {
          var w = source.widgets.shift();
          while (w) {
            target.widgets.push(w);
            w = source.widgets.shift();
          }
        }
      }

      /**
       * Copy widget from old columns to the new model
       * @param object root the model
       * @param array of columns
       * @param counter
       */
      function fillStructure(root, columns, counter) {
        counter = counter || 0;

        if (angular.isDefined(root.rows)) {
          angular.forEach(root.rows, function (row) {
            angular.forEach(row.columns, function (column) {
              // if the widgets prop doesn't exist, create a new array for it.
              // this allows ui.sortable to do it's thing without error
              if (!column.widgets) {
                column.widgets = [];
              }

              // if a column exist at the counter index, copy over the column
              if (angular.isDefined(columns[counter])) {
                // do not add widgets to a column, which uses nested rows
                if (!angular.isDefined(column.rows)) {
                  copyWidgets(columns[counter], column);
                  counter++;
                }
              }

              // run fillStructure again for any sub rows/columns
              counter = fillStructure(column, columns, counter);
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
      function readColumns(root, columns) {
        columns = columns || [];

        if (angular.isDefined(root.rows)) {
          angular.forEach(root.rows, function (row) {
            angular.forEach(row.columns, function (col) {
              columns.push(col);
              // keep reading columns until we can't any more
              readColumns(col, columns);
            });
          });
        }

        return columns;
      }

      function changeStructure(model, structure) {
        var columns = readColumns(model);
        var counter = 0;

        model.rows = angular.copy(structure.rows);

        while (counter < columns.length) {
          counter = fillStructure(model, columns, counter);
        }
      }

      function createConfiguration(type) {
        var cfg = {};
        var config = dashboard.widgets[type].config;
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
      function findFirstWidgetColumn(model) {
        var column = null;
        if (!angular.isArray(model.rows)) {
          $log.error("model does not have any rows");
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
       * @param name name of the dashboard
       */
      function addNewWidgetToModel(model, widget, name) {
        if (model) {
          var column = findFirstWidgetColumn(model);
          if (column) {
            if (!column.widgets) {
              column.widgets = [];
            }
            column.widgets.unshift(widget);

            // broadcast added event
            $rootScope.$broadcast("adfWidgetAdded", name, model, widget);
          } else {
            $log.error("could not find first widget column");
          }
        } else {
          $log.error("model is undefined");
        }
      }

      /**
       * Checks if the edit mode of the widget should be opened immediately.
       *
       * @param widget type
       */
      function isEditModeImmediate(type) {
        var widget = dashboard.widgets[type];
        return widget && widget.edit && widget.edit.immediate;
      }

      /**
       * Opens the edit mode of the specified widget.
       *
       * @param dashboard scope
       * @param widget
       */
      function openEditMode($scope, widget) {
        // wait some time before fire enter edit mode event
        $timeout(function () {
          $scope.$broadcast("adfWidgetEnterEditMode", widget);
        }, 200);
      }

      return {
        replace: true,
        restrict: "EA",
        transclude: false,
        scope: {
          structure: "@",
          name: "@",
          collapsible: "@",
          editable: "@",
          editMode: "@",
          continuousEditMode: "=",
          maximizable: "@",
          adfModel: "=",
          adfWidgetFilter: "=",
        },
        controller: [
          "$scope",
          function ($scope) {
            var model = {};
            var structure = {};
            var widgetFilter = null;
            var structureName = {};
            var name = $scope.name;

            // Watching for changes on adfModel
            $scope.$watch(
              "adfModel",
              function (oldVal, newVal) {
                // has model changed or is the model attribute not set
                if (newVal !== null || (oldVal === null && newVal === null)) {
                  model = $scope.adfModel;
                  widgetFilter = $scope.adfWidgetFilter;
                  if (!model || !model.rows) {
                    structureName = $scope.structure;
                    structure = dashboard.structures[structureName];
                    if (structure) {
                      if (model) {
                        model.rows = angular.copy(structure).rows;
                      } else {
                        model = angular.copy(structure);
                      }
                      model.structure = structureName;
                    } else {
                      $log.error("could not find structure " + structureName);
                    }
                  }

                  if (model) {
                    if (!model.title) {
                      model.title = "Dashboard";
                    }
                    if (!model.titleTemplateUrl) {
                      model.titleTemplateUrl =
                        adfTemplatePath + "dashboard-title.html";
                    }
                    $scope.model = model;
                  } else {
                    $log.error("could not find or create model");
                  }
                }
              },
              true
            );

            // edit mode
            $scope.editMode = false;
            $scope.editClass = "";

            $scope.toggleEditMode = function () {
              $scope.editMode = !$scope.editMode;
              if ($scope.editMode) {
                if (!$scope.continuousEditMode) {
                  $scope.modelCopy = angular.copy($scope.adfModel, {});
                  $rootScope.$broadcast("adfIsEditMode");
                }
              }

              if (!$scope.editMode) {
                $rootScope.$broadcast("adfDashboardChanged", name, model);
              }
            };

            /**
             * Scope method allowing action buttons to fire the delete request
             */
            $scope.deleteDashboard = function () {
              $rootScope.$broadcast("adfDashboardDeleteRequested", name, model);
            };

            $scope.$on("adfToggleEditMode", function () {
              $scope.toggleEditMode();
            });

            $scope.collapseAll = function (collapseExpandStatus) {
              $rootScope.$broadcast("adfDashboardCollapseExpand", {
                collapseExpandStatus: collapseExpandStatus,
              });
            };

            $scope.cancelEditMode = function () {
              $scope.editMode = false;
              if (!$scope.continuousEditMode) {
                $scope.modelCopy = angular.copy(
                  $scope.modelCopy,
                  $scope.adfModel
                );
              }
              $rootScope.$broadcast("adfDashboardEditsCancelled");
            };

            // edit dashboard settings
            $scope.editDashboardDialog = function () {
              var editDashboardScope = $scope.$new();
              // create a copy of the title, to avoid changing the title to
              // "dashboard" if the field is empty
              editDashboardScope.copy = {
                title: model.title,
              };
              editDashboardScope.structures = dashboard.structures;

              var adfEditTemplatePath = adfTemplatePath + "dashboard-edit.html";
              if (model.editTemplateUrl) {
                adfEditTemplatePath = model.editTemplateUrl;
              }
              var instance = $uibModal.open({
                scope: editDashboardScope,
                templateUrl: adfEditTemplatePath,
                backdrop: "static",
              });
              editDashboardScope.changeStructure = function (name, structure) {
                $log.info("change structure to " + name);
                changeStructure(model, structure);
              };
              editDashboardScope.closeDialog = function () {
                // copy the new title back to the model
                model.title = editDashboardScope.copy.title;
                // close modal and destroy the scope
                instance.close();
                editDashboardScope.$destroy();
              };
            };

            // add widget dialog
            $scope.addWidgetDialog = function () {
              var addScope = $scope.$new();
              var model = $scope.model;
              var widgets;
              if (angular.isFunction(widgetFilter)) {
                widgets = {};
                angular.forEach(dashboard.widgets, function (widget, type) {
                  if (widgetFilter(widget, type, model)) {
                    widgets[type] = widget;
                  }
                });
              } else {
                widgets = dashboard.widgets;
              }

              function getCategories() {
                var categories = {};
                angular.forEach(widgets, function (widget, key) {
                  var category = "default";
                  if (widget.category) {
                    category = widget.category;
                  }
                  if (!categories[category]) {
                    categories[category] = {};
                  }
                  categories[category][key] = widget;
                });

                return categories;
              }

              addScope.categories = getCategories();
              addScope.recentlyAdded = [];
              addScope.widgets = widgets;

              var adfAddTemplatePath = adfTemplatePath + "widget-add.html";
              if (model.addTemplateUrl) {
                adfAddTemplatePath = model.addTemplateUrl;
              }

              var opts = {
                scope: addScope,
                templateUrl: adfAddTemplatePath,
                backdrop: "static",
              };

              var instance = $uibModal.open(opts);
              addScope.addWidget = function (widget) {
                var w = {
                  type: widget,
                  config: createConfiguration(widget),
                };

                addNewWidgetToModel(model, w, name);
                // close and destroy
                instance.close();
                addScope.$destroy();

                addScope.recentlyAdded.push(widget);

                $timeout(function () {
                  addScope.recentlyAdded.shift();
                }, 1000);

                // check for open edit mode immediately
                if (isEditModeImmediate(widget)) {
                  openEditMode($scope, w);
                }
              };
              addScope.closeDialog = function () {
                // close and destroy
                instance.close();
                addScope.$destroy();
              };
            };

            $scope.addNewWidgetToModel = addNewWidgetToModel;
          },
        ],
        link: function ($scope, $element, $attr) {
          // pass options to scope
          var options = {
            name: $attr.name,
            editable: true,
            enableConfirmDelete: stringToBoolean($attr.enableconfirmdelete),
            maximizable: stringToBoolean($attr.maximizable),
            collapsible: stringToBoolean($attr.collapsible),
          };
          if (angular.isDefined($attr.editable)) {
            options.editable = stringToBoolean($attr.editable);
          }
          $scope.options = options;
        },
        templateUrl: adfTemplatePath + "dashboard.html",
      };
    },
  ]);

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

  /**
   * @ngdoc object
   * @name adf.dashboardProvider
   * @description
   *
   * The dashboardProvider can be used to register structures and widgets.
   */
  angular.module("adf.provider", []).provider("dashboard", function () {
    var widgets = {};
    var widgetsPath = "";
    var structures = {};
    var messageTemplate = '<div class="alert alert-danger">{}</div>';
    var loadingTemplate =
      '\
      <div class="progress progress-striped active">\n\
        <div class="progress-bar" role="progressbar" style="width: 100%">\n\
          <span class="sr-only">loading ...</span>\n\
        </div>\n\
      </div>';

    // default apply function of widget.edit.apply
    var defaultApplyFunction = function () {
      return true;
    };

    /**
     * @ngdoc method
     * @name adf.dashboardProvider#widget
     * @methodOf adf.dashboardProvider
     * @description
     *
     * Registers a new widget.
     *
     * @param {string} name of the widget
     * @param {object} widget to be registered.
     *
     *   Object properties:
     *
     *   - `title` - `{string=}` - The title of the widget.
     *   - `description` - `{string=}` - Description of the widget.
     *   - `collapsed` - `{boolean=}` - true if the widget should be in collapsed state. Default is false.
     *   - `config` - `{object}` - Predefined widget configuration.
     *   - `controller` - `{string=|function()=}` - Controller fn that should be
     *      associated with newly created scope of the widget or the name of a
     *      {@link http://docs.angularjs.org/api/angular.Module#controller registered controller}
     *      if passed as a string.
     *   - `controllerAs` - `{string=}` - A controller alias name. If present the controller will be
     *      published to scope under the `controllerAs` name.
     *   - `frameless` - `{boolean=}` - false if the widget should be shown in frameless mode. The default is false.
     *   - `styleClass` - `{object}` - space delimited string or map of classes bound to the widget.
     *   - `template` - `{string=|function()=}` - html template as a string.
     *   - `templateUrl` - `{string=}` - path to an html template.
     *   - `reload` - `{boolean=}` - true if the widget could be reloaded. The default is false.
     *   - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
     *      be injected into the controller. If any of these dependencies are promises, the widget
     *      will wait for them all to be resolved or one to be rejected before the controller is
     *      instantiated.
     *      If all the promises are resolved successfully, the values of the resolved promises are
     *      injected.
     *
     *      The map object is:
     *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
     *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
     *        Otherwise if function, then it is {@link http://docs.angularjs.org/api/AUTO.$injector#invoke injected}
     *        and the return value is treated as the dependency. If the result is a promise, it is
     *        resolved before its value is injected into the controller.
     *   - `edit` - `{object}` - Edit modus of the widget.
     *      - `controller` - `{string=|function()=}` - Same as above, but for the edit mode of the widget.
     *      - `controllerAs` - `{string=}` - Same as above, but for the edit mode of the widget.
     *      - `template` - `{string=|function()=}` - Same as above, but for the edit mode of the widget.
     *      - `templateUrl` - `{string=}` - Same as above, but for the edit mode of the widget.
     *      - `resolve` - `{Object.<string, function>=}` - Same as above, but for the edit mode of the widget.
     *      - `reload` - {boolean} - true if the widget should be reloaded, after the edit mode is closed.
     *        Default is true.
     *      - `immediate` - {boolean} - The widget enters the edit mode immediately after creation. Default is false.
     *      - `apply` - `{function()=}` - The apply function is called, before the widget is saved.
     *        The function have to return a boolean or an promise which can be resolved to a boolean.
     *        The function can use injection.
     *
     * @returns {Object} self
     */
    this.widget = function (name, widget) {
      var w = angular.extend({ reload: false, frameless: false }, widget);
      if (w.edit) {
        var edit = {
          reload: true,
          immediate: false,
          apply: defaultApplyFunction,
        };
        angular.extend(edit, w.edit);
        w.edit = edit;
      }
      widgets[name] = w;
      return this;
    };

    /**
     * @ngdoc method
     * @name adf.dashboardProvider#widgetsPath
     * @methodOf adf.dashboardProvider
     * @description
     *
     * Sets the path to the directory which contains the widgets. The widgets
     * path is used for widgets with a templateUrl which contains the
     * placeholder {widgetsPath}. The placeholder is replaced with the
     * configured value, before the template is loaded, but the template is
     * cached with the unmodified templateUrl (e.g.: {widgetPath}/src/widgets).
     * The default value of widgetPaths is ''.
     *
     *
     * @param {string} path to the directory which contains the widgets
     *
     * @returns {Object} self
     */
    this.widgetsPath = function (path) {
      widgetsPath = path;
      return this;
    };

    /**
     * @ngdoc method
     * @name adf.dashboardProvider#structure
     * @methodOf adf.dashboardProvider
     * @description
     *
     * Registers a new structure.
     *
     * @param {string} name of the structure
     * @param {object} structure to be registered.
     *
     *   Object properties:
     *
     *   - `rows` - `{Array.<Object>}` - Rows of the dashboard structure.
     *     - `styleClass` - `{string}` - CSS Class of the row.
     *     - `columns` - `{Array.<Object>}` - Columns of the row.
     *       - `styleClass` - `{string}` - CSS Class of the column.
     *
     * @returns {Object} self
     */
    this.structure = function (name, structure) {
      structures[name] = structure;
      return this;
    };

    /**
     * @ngdoc method
     * @name adf.dashboardProvider#messageTemplate
     * @methodOf adf.dashboardProvider
     * @description
     *
     * Changes the template for messages.
     *
     * @param {string} template for messages.
     *
     * @returns {Object} self
     */
    this.messageTemplate = function (template) {
      messageTemplate = template;
      return this;
    };

    /**
     * @ngdoc method
     * @name adf.dashboardProvider#loadingTemplate
     * @methodOf adf.dashboardProvider
     * @description
     *
     * Changes the template which is displayed as
     * long as the widget resources are not resolved.
     *
     * @param {string} template loading template
     *
     * @returns {Object} self
     */
    this.loadingTemplate = function (template) {
      loadingTemplate = template;
      return this;
    };

    /**
     * @ngdoc service
     * @name adf.dashboard
     * @description
     *
     * The dashboard holds all options, structures and widgets.
     *
     * @property {Array.<Object>} widgets Array of registered widgets.
     * @property {string} widgetsPath Default path for widgets.
     * @property {Array.<Object>} structures Array of registered structures.
     * @property {string} messageTemplate Template for messages.
     * @property {string} loadingTemplate Template for widget loading.
     *
     * @returns {Object} self
     */
    this.$get = function () {
      var cid = 0;

      return {
        widgets: widgets,
        widgetsPath: widgetsPath,
        structures: structures,
        messageTemplate: messageTemplate,
        loadingTemplate: loadingTemplate,

        /**
         * @ngdoc method
         * @name adf.dashboard#id
         * @methodOf adf.dashboard
         * @description
         *
         * Creates an ongoing numeric id. The method is used to create ids for
         * columns and widgets in the dashboard.
         */
        id: function () {
          return new Date().getTime() + "-" + ++cid;
        },

        /**
         * @ngdoc method
         * @name adf.dashboard#idEqual
         * @methodOf adf.dashboard
         * @description
         *
         * Checks if the given ids are equal.
         *
         * @param {string} id widget or column id
         * @param {string} other widget or column id
         */
        idEquals: function (id, other) {
          // use toString, because old ids are numbers
          return id && other && id.toString() === other.toString();
        },
      };
    };
  });

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
  angular.module("adf").directive("adfDashboardRow", [
    "$compile",
    "adfTemplatePath",
    "columnTemplate",
    function ($compile, adfTemplatePath, columnTemplate) {
      return {
        restrict: "E",
        replace: true,
        scope: {
          row: "=",
          adfModel: "=",
          editMode: "=",
          continuousEditMode: "=",
          options: "=",
        },
        templateUrl: adfTemplatePath + "dashboard-row.html",
        link: function ($scope, $element) {
          if (
            angular.isDefined($scope.row.columns) &&
            angular.isArray($scope.row.columns)
          ) {
            $compile(columnTemplate)($scope, function (cloned) {
              $element.append(cloned);
            });
          }
        },
      };
    },
  ]);

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

  angular.module("adf").directive("adfWidgetContent", [
    "$log",
    "$q",
    "$sce",
    "$http",
    "$templateCache",
    "$compile",
    "$controller",
    "$injector",
    "dashboard",
    function (
      $log,
      $q,
      $sce,
      $http,
      $templateCache,
      $compile,
      $controller,
      $injector,
      dashboard
    ) {
      function parseUrl(url) {
        var parsedUrl = url;
        if (url.indexOf("{widgetsPath}") >= 0) {
          parsedUrl = url
            .replace("{widgetsPath}", dashboard.widgetsPath)
            .replace("//", "/");
          if (parsedUrl.indexOf("/") === 0) {
            parsedUrl = parsedUrl.substring(1);
          }
        }
        return parsedUrl;
      }

      function getTemplate(widget) {
        var deferred = $q.defer();

        if (widget.template) {
          deferred.resolve(widget.template);
        } else if (widget.templateUrl) {
          // try to fetch template from cache
          var tpl = $templateCache.get(widget.templateUrl);
          if (tpl) {
            deferred.resolve(tpl);
          } else {
            var url = $sce.getTrustedResourceUrl(parseUrl(widget.templateUrl));
            $http
              .get(url)
              .then(function (response) {
                // put response to cache, with unmodified url as key
                $templateCache.put(widget.templateUrl, response);
                deferred.resolve(response);
              })
              .catch(function () {
                deferred.reject("could not load template");
              });
          }
        }

        return deferred.promise;
      }

      function compileWidget($scope, $element, currentScope) {
        var model = $scope.model;
        var content = $scope.content;

        // display loading template
        $element.html(dashboard.loadingTemplate);

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
          config: model.config,
        };

        // get resolve promises from content object
        var resolvers = {};
        resolvers.$tpl = getTemplate(content);
        if (content.resolve) {
          angular.forEach(content.resolve, function (promise, key) {
            if (angular.isString(promise)) {
              resolvers[key] = $injector.get(promise);
            } else {
              resolvers[key] = $injector.invoke(promise, promise, base);
            }
          });
        }

        // resolve all resolvers
        $q.all(resolvers).then(
          function (locals) {
            angular.extend(locals, base);

            // compile & render template
            var template = locals.$tpl;
            $element.html(template);
            if (content.controller) {
              var templateCtrl = $controller(content.controller, locals);
              if (content.controllerAs) {
                templateScope[content.controllerAs] = templateCtrl;
              }
              $element.children().data("$ngControllerController", templateCtrl);
            }
            $compile($element.contents())(templateScope);
          },
          function (reason) {
            // handle promise rejection
            var msg = "Could not resolve all promises";
            if (reason) {
              msg += ": " + reason;
            }
            $log.warn(msg);
            $element.html(dashboard.messageTemplate.replace(/{}/g, msg));
          }
        );

        // destroy old scope
        if (currentScope) {
          currentScope.$destroy();
        }

        return templateScope;
      }

      return {
        replace: true,
        restrict: "EA",
        transclude: false,
        scope: {
          model: "=",
          content: "=",
          dashboardoptions: "=",
        },
        link: function ($scope, $element) {
          var currentScope = compileWidget($scope, $element, null);
          $scope.$on("widgetConfigChanged", function () {
            currentScope = compileWidget($scope, $element, currentScope);
          });
          $scope.$on("widgetReload", function () {
            currentScope = compileWidget($scope, $element, currentScope);
          });
        },
      };
    },
  ]);

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

  angular.module("adf").directive("adfWidget", [
    "$injector",
    "$q",
    "$log",
    "$uibModal",
    "$rootScope",
    "dashboard",
    "adfTemplatePath",
    function (
      $injector,
      $q,
      $log,
      $uibModal,
      $rootScope,
      dashboard,
      adfTemplatePath
    ) {
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
              definition.titleTemplateUrl =
                adfTemplatePath + "widget-title.html";
              if (w.titleTemplateUrl) {
                definition.titleTemplateUrl = w.titleTemplateUrl;
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
              $scope.widgetState.isCollapsed =
                w.collapsed === true ? w.collapsed : false;
            }
          } else {
            $log.warn("could not find widget " + definition.type);
          }
        } else {
          $log.debug("definition not specified, widget was probably removed");
        }
      }

      function postLink($scope, $element) {
        var definition = $scope.definition;
        if (definition) {
          // bind close function

          var deleteWidget = function () {
            var column = $scope.col;
            if (column) {
              var index = column.widgets.indexOf(definition);
              if (index >= 0) {
                column.widgets.splice(index, 1);
              }
            }
            $element.remove();
            $rootScope.$broadcast("adfWidgetRemovedFromColumn");
          };

          $scope.remove = function () {
            if ($scope.options.enableConfirmDelete) {
              var deleteScope = $scope.$new();
              var deleteTemplateUrl = adfTemplatePath + "widget-delete.html";
              if (definition.deleteTemplateUrl) {
                deleteTemplateUrl = definition.deleteTemplateUrl;
              }
              var opts = {
                scope: deleteScope,
                templateUrl: deleteTemplateUrl,
                backdrop: "static",
              };
              var instance = $uibModal.open(opts);

              deleteScope.closeDialog = function () {
                instance.close();
                deleteScope.$destroy();
              };
              deleteScope.deleteDialog = function () {
                deleteWidget();
                deleteScope.closeDialog();
              };
            } else {
              deleteWidget();
            }
          };

          // bind reload function
          $scope.reload = function () {
            $scope.$broadcast("widgetReload");
          };

          // bind edit function
          $scope.edit = function () {
            var editScope = $scope.$new();
            editScope.definition = angular.copy(definition);

            var adfEditTemplatePath = adfTemplatePath + "widget-edit.html";
            if (definition.editTemplateUrl) {
              adfEditTemplatePath = definition.editTemplateUrl;
            }

            var opts = {
              scope: editScope,
              templateUrl: adfEditTemplatePath,
              backdrop: "static",
            };

            var instance = $uibModal.open(opts);

            editScope.closeDialog = function () {
              instance.close();
              editScope.$destroy();
            };

            // TODO create util method
            function createApplyPromise(result) {
              var promise;
              if (typeof result === "boolean") {
                var deferred = $q.defer();
                if (result) {
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

            editScope.saveDialog = function () {
              // clear validation error
              editScope.validationError = null;

              // build injection locals
              var widget = $scope.widget;
              var applyFn = widget.edit.apply;
              var locals = {
                widget: widget,
                definition: editScope.definition,
                config: editScope.definition.config,
              };

              // invoke apply function and apply if success
              var result = $injector.invoke(applyFn, applyFn, locals);
              createApplyPromise(result).then(
                function () {
                  definition.title = editScope.definition.title;
                  angular.extend(
                    definition.config,
                    editScope.definition.config
                  );
                  if (widget.edit && widget.edit.reload) {
                    // reload content after edit dialog is closed
                    $scope.$broadcast("widgetConfigChanged");
                  }
                  editScope.closeDialog();
                },
                function (err) {
                  if (err) {
                    editScope.validationError = err;
                  } else {
                    editScope.validationError =
                      "Validation durring apply failed";
                  }
                }
              );
            };
          };
        } else {
          $log.debug("widget not found");
        }
      }

      return {
        replace: true,
        restrict: "EA",
        transclude: false,
        templateUrl: adfTemplatePath + "widget.html",
        scope: {
          definition: "=",
          col: "=column",
          editMode: "=",
          options: "=",
          widgetState: "=",
        },
        controller: [
          "$scope",
          function ($scope) {
            $scope.$on("adfDashboardCollapseExpand", function (event, args) {
              $scope.widgetState.isCollapsed = args.collapseExpandStatus;
            });

            $scope.$on("adfWidgetEnterEditMode", function (event, widget) {
              if (dashboard.idEquals($scope.definition.wid, widget.wid)) {
                $scope.edit();
              }
            });

            $scope.widgetClasses = function (w, definition) {
              var classes = definition.styleClass || "";
              if (!w.frameless || $scope.editMode) {
                classes += " panel panel-default";
              }
              return classes;
            };

            $scope.openFullScreen = function () {
              var definition = $scope.definition;
              var fullScreenScope = $scope.$new();
              var opts = {
                scope: fullScreenScope,
                templateUrl: adfTemplatePath + "widget-fullscreen.html",
                size: definition.modalSize || "lg", // 'sm', 'lg'
                backdrop: "static",
                windowClass: definition.fullScreen
                  ? "dashboard-modal widget-fullscreen"
                  : "dashboard-modal",
              };

              var instance = $uibModal.open(opts);
              fullScreenScope.closeDialog = function () {
                instance.close();
                fullScreenScope.$destroy();
              };
            };
          },
        ],
        compile: function () {
          /**
           * use pre link, because link of widget-content
           * is executed before post link widget
           */
          return {
            pre: preLink,
            post: postLink,
          };
        },
      };
    },
  ]);

  angular.module("adf").run([
    "$templateCache",
    function ($templateCache) {
      $templateCache.put(
        "../src/templates/dashboard-column.html",
        '<div adf-id={{column.cid}} class=column ng-class=column.styleClass ng-model=column.widgets> <adf-widget ng-repeat="definition in column.widgets" definition=definition column=column edit-mode=editMode options=options widget-state=widgetState>  </adf-widget></div> '
      );
      $templateCache.put(
        "../src/templates/dashboard-edit.html",
        '<div class=modal-header> <button type=button class=close ng-click=closeDialog() aria-hidden=true>&times;</button> <h4 class=modal-title>Dashboard bearbeiten</h4> </div> <div class=modal-body> <form role=form> <div class=form-group> <label for=dashboardTitle>Title</label> <input type=text class=form-control id=dashboardTitle ng-model=copy.title required placeholder="Titel des Dashboards"> </div> <div class=form-group> <label>Struktur</label> <div class=radio ng-repeat="(key, structure) in structures"> <label> <input type=radio value={{key}} ng-model=model.structure ng-change="changeStructure(key, structure)"> {{key}} </label> </div> </div> </form> </div> <div class=modal-footer> <button type=button class="btn btn-default" ng-click=closeDialog()><i class="fa fa-times"></i> Schließen</button> </div>'
      );
      $templateCache.put(
        "../src/templates/dashboard-row.html",
        "<div class=row ng-class=row.styleClass>  </div> "
      );
      $templateCache.put(
        "../src/templates/dashboard-title.html",
        '<h1> <a href ng-if=editMode title="Neues Widget hinzufügen" ng-click=addWidgetDialog()> <i class="fa fa-plus"></i> </a> <a href ng-if=editMode title="Dashboard bearbeiten" ng-click=editDashboardDialog()> <i class="fa fa-cog"></i> </a> <a href ng-if=options.editable title="{{editMode ? \'Speichern\' : \'Bearbeitungsmodus aktivieren\'}}" ng-click=toggleEditMode()> <i class=fa x-ng-class="{\'fa-edit\' : !editMode, \'fa-save\' : editMode}"></i> </a> <a href ng-if=editMode title="Änderungen verwerfen" ng-click=cancelEditMode()> <i class="fa fa-repeat adf-flip"></i> </a> </h1> '
      );
      $templateCache.put(
        "../src/templates/dashboard.html",
        '<div class=dashboard-container> <div ng-include src=model.titleTemplateUrl></div> <div class=dashboard x-ng-class="{\'edit\' : editMode}"> <adf-dashboard-row row=row adf-model=model options=options ng-repeat="row in model.rows" edit-mode=editMode continuous-edit-mode=continuousEditMode> </adf-dashboard-row></div> </div> '
      );
      $templateCache.put(
        "../src/templates/widget-add.html",
        '<div class=modal-header> <button type=button class=close ng-click=closeDialog() aria-hidden=true>&times;</button> <h4 class=modal-title>Widget hinzufügen</h4> </div> <div class=modal-body> <div class=panel-group id=accordion role=tablist aria-multiselectable=true> <div class="panel panel-default" ng-repeat="(category, widgets) in categories" is-open=isopen> <div class=panel-heading role=tab id=headingOne> <h4 class=panel-title> <a role=button data-toggle=collapse data-parent=#accordion href=#collapseOne aria-expanded=true aria-controls=collapseOne> {{category}} </a> </h4> </div> <div id=#panel{{category}} class="panel-collapse collapse in" role=tabpanel aria-labelledby=headingOne> <ul class=list-group> <li class=list-group-item ng-repeat="(key, widget) in widgets"> <a href ng-click=addWidget(key)>{{widget.title}} <i class="fa fa-spinner fa-spin" ng-show="recentlyAdded.indexOf(key) > -1"></i></a> <p> <small ng-if=widget.description>{{widget.description}}</small> </p> </li> </ul> </div> </div> </div> </div> <div class=modal-footer> <button type=button class="btn btn-default" ng-click=closeDialog()><i class="fa fa-times"></i> Schließen</button> </div>'
      );
      $templateCache.put(
        "../src/templates/widget-delete.html",
        '<div class=modal-header> <h4 class=modal-title>Delete {{widget.title}}</h4> </div> <div class=modal-body> <form role=form> <div class=form-group> <label for=widgetTitle>Are you sure you want to delete this widget ?</label> </div> </form> </div> <div class=modal-footer> <button type=button class="btn btn-default" ng-click=closeDialog()>Close</button> <button type=button class="btn btn-primary" ng-click=deleteDialog()>Delete</button> </div> '
      );
      $templateCache.put(
        "../src/templates/widget-edit.html",
        '<form name=widgetEditForm novalidate role=form ng-submit=saveDialog()> <div class=modal-header> <button type=button class=close ng-click=closeDialog() aria-hidden=true>&times;</button> <h4 class=modal-title>{{widget.title}}</h4> </div> <div class=modal-body> <div class="alert alert-danger" role=alert ng-show=validationError> <strong>Fehler:</strong> {{validationError}} </div> <div class=form-group> <label for=widgetTitle>Title</label> <input type=text class=form-control id=widgetTitle ng-model=definition.title placeholder="Titel eingeben" required> </div> <div ng-if=widget.edit> <adf-widget-content model=definition content=widget.edit> </adf-widget-content></div> </div> <div class=modal-footer> <button type=button class="btn btn-default" ng-click=closeDialog()><i class="fa fa-times"></i> Abbrechen</button> <button type=submit class="btn btn-primary" ng-disabled=widgetEditForm.$invalid><i class="fa fa-floppy-o"></i> Speichern</button> </div> </form>'
      );
      $templateCache.put(
        "../src/templates/widget-fullscreen.html",
        '<div class=modal-header> <div class="pull-right widget-icons"> <a href title="Reload Widget Content" ng-if=widget.reload ng-click=reload()> <i class="fa fa-refresh"></i> </a> <a href title=close ng-click=closeDialog()> <i class="fa fa-times"></i> </a> </div> <h4 class=modal-title>{{definition.title}}</h4> </div> <div class=modal-body> <adf-widget-content model=definition content=widget> </adf-widget-content></div> <div class=modal-footer> <button type=button class="btn btn-default" ng-click=closeDialog()><i class="fa fa-times"></i> Schließen</button> </div>'
      );
      $templateCache.put(
        "../src/templates/widget-title.html",
        '<h3 class=panel-title ng-class="editMode ? \'adf-move\' : \'\'"> {{definition.title}} <span class=pull-right> <a href title="Daten neu laden" ng-if=widget.reload ng-click=reload()> <i class="fa fa-refresh"></i> </a>  <a href title=zuklappen ng-show="options.collapsible && !widgetState.isCollapsed" ng-click="widgetState.isCollapsed = !widgetState.isCollapsed"> <i class="fa fa-minus"></i> </a>  <a href title=aufklappen ng-show="options.collapsible && widgetState.isCollapsed" ng-click="widgetState.isCollapsed = !widgetState.isCollapsed"> <i class="fa fa-plus"></i> </a>  <a href title=konfigurieren ng-click=edit() ng-if=editMode> <i class="fa fa-cog"></i> </a> <a href title=fullscreen ng-click=openFullScreen() ng-if=options.maximizable> <i class="fa fa-arrows"></i> </a>  <a href title="remove widget" ng-click=remove() ng-if=editMode> <i class="fa fa-remove"></i> </a> </span> </h3> '
      );
      $templateCache.put(
        "../src/templates/widget.html",
        '<div adf-id={{definition.wid}} adf-widget-type={{definition.type}} ng-class="widgetClasses(widget, definition)" class=widget> <div class="panel-heading clearfix" ng-if="!widget.frameless || editMode"> <div ng-include src=definition.titleTemplateUrl></div> </div> <div ng-class="{\'panel-body\':!widget.frameless || editMode}" uib-collapse=widgetState.isCollapsed> <adf-widget-content model=definition dashboardoptions=options content=widget> </adf-widget-content></div> </div> '
      );
    },
  ]);
})(window);
