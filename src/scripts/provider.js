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

/**
 * @ngdoc object
 * @name adf.dashboardProvider
 * @description
 * 
 * The dashboardProvider can be used to register structures and widgets.
 */
angular.module('adf.provider', [])
  .provider('dashboard', function(){

    var widgets = {};
    var structures = {};
    var messageTemplate = '<div class="alert alert-danger">{}</div>';
    var loadingTemplate = '\
      <div class="progress progress-striped active">\n\
        <div class="progress-bar" role="progressbar" style="width: 100%">\n\
          <span class="sr-only">loading ...</span>\n\
        </div>\n\
      </div>';

   /**
    * @ngdoc method
    * @name adf.dashboardProvider#widget
    * @methodOf adf.dashboardProvider
    * @description
    * 
    * Registeres a new widget.
    *
    * @param {string} name of the widget
    * @param {object} widget to be registered.
    *
    *   Object properties:
    *
    *   - `title` - `{string=}` - The title of the widget.
    *   - `controller` - `{string=|function()=}` - Controller fn that should be 
    *      associated with newly created scope of the widget or the name of a 
    *      {@link http://docs.angularjs.org/api/angular.Module#controller registered controller} 
    *      if passed as a string.
    *   - `template` - `{string=|function()=}` - html template as a string.
    *   - `templateUrl` - `{string=}` - path to an html template.
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
    this.widget = function(name, widget){
      if ( widget.edit ){
        var edit = {reload: true};
        angular.extend(edit, widget.edit);
        widget.edit = edit;
      }
      widgets[name] = widget;
      return this;
    };

   /**
    * @ngdoc method
    * @name adf.dashboardProvider#widget
    * @methodOf adf.dashboardProvider
    * @description
    * 
    * Registeres a new structure.
    *
    * @param {string} name of the structure
    * @param {object} structure to be registered.
    *
    *   Object properties:
    *   - 
    * 
    */
    this.structure = function(name, structure){
      structures[name] = structure;
      return this;
    };
    
    this.messageTemplate = function(template){
      messageTemplate = template;
    };

    this.loadingTemplate = function(template){
      loadingTemplate = template;
      return this;
    };

   /**
    * @ngdoc object
    * @name adf.dashboard
    * @description
    * 
    * The dashboard holds all structures and widgets.
    */
    this.$get = function(){
      return {
        widgets: widgets,
        structures: structures,
        messageTemplate: messageTemplate,
        loadingTemplate: loadingTemplate
      };
    };

  });