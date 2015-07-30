
module Adf {

    export interface IWidget  {
        title?: string;
        description?: string;
        config?: any;
        controller?: string | (() => any);
        controllerAs?: string;
        template?: string | (() => any);
        templateUrl?: string;
        reload?: boolean;
        resolve?: any;
        edit: {
            controller: string;
            template?: string | (() => any);
            templateUrl?: string;
            resolve?: any;
            reload: boolean;
        }

    }

    export interface IStructure {
        rows: IRow[],

    }

    export interface IRow {
        styleClass: string,
        columns: IColumn[];
    }

    export interface IColumn {
        styleClass: string;
        widgets?: IWidget[];
    }
    export interface IDashBoardService {
        id: () => number;
        widgets: any[];
        widgetsPath: string;
        structures: any[];
        messageTemplate: string;
        loadingTemplate: string;
    }

    export class Dashboard implements ng.IServiceProvider{


        static widgetsPath = '';
        static widgets = {};
        static messageTemplate = '<div class="alert alert-danger">{}</div>';

       static  structures = {};

        static loadingTemplate = '\
      <div class="progress progress-striped active">\n\
        <div class="progress-bar" role="progressbar" style="width: 100%">\n\
          <span class="sr-only">loading ...</span>\n\
        </div>\n\
      </div>';
        constructor() {

        }

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
                 *   - `config` - `{object}` - Predefined widget configuration.
                 *   - `controller` - `{string=|function()=}` - Controller fn that should be
                 *      associated with newly created scope of the widget or the name of a
                 *      {@link http://docs.angularjs.org/api/angular.Module#controller registered controller}
                 *      if passed as a string.
                 *   - `controllerAs` - `{string=}` - A controller alias name. If present the controller will be
                 *      published to scope under the `controllerAs` name.
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
                 *      - `template` - `{string=|function()=}` - Same as above, but for the edit mode of the widget.
                 *      - `templateUrl` - `{string=}` - Same as above, but for the edit mode of the widget.
                 *      - `resolve` - `{Object.<string, function>=}` - Same as above, but for the edit mode of the widget.
                 *      - `reload` - {boolean} - true if the widget should be reloaded, after the edit mode is closed.
                 *        Default is true.
                 *
                 * @returns {Object} self
                 */
        widget = (name: string, widget:IWidget) => {
            var w = angular.extend({ reload: false }, widget);
            if (w.edit) {
                var edit = { reload: true };
                angular.extend(edit, w.edit);
                w.edit = edit;
            }
            Dashboard.widgets[name] = w;
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
        widgetsPath = (path:string) => {
            Dashboard.widgetsPath = path;
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
        structure = (name: string, structure: IStructure) => {
            Dashboard.structures[name] = structure;
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
        messageTemplate = (template: string) => {
            Dashboard.messageTemplate = <any> template;
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
             * @param {string} loading template
             *
             * @returns {Object} self
             */
        loadingTemplate = (template: string) => {
           Dashboard.loadingTemplate = <any> template;
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
        $get = (): IDashBoardService => {
            var cid = 0;

            return <IDashBoardService> {
                widgets: Dashboard.widgets,
                widgetsPath: Dashboard.widgetsPath,
                structures:Dashboard.structures,
                messageTemplate: Dashboard.messageTemplate,
                loadingTemplate: Dashboard.loadingTemplate,

                /**
                     * @ngdoc method
                     * @name adf.dashboard#id
                     * @methodOf adf.dashboard
                     * @description
                     *
                     * Creates an ongoing numeric id. The method is used to create ids for
                     * columns and widgets in the dashboard.
                     */
                id: (): number => (++cid)
            };
        }

    }
    angular.module('adf.provider', [])
        .provider('dashboard', Dashboard);
}
