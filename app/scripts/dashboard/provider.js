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

angular.module('dashboard.provider', [])
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

    this.widget = function(name, widget){
      if ( widget.edit ){
        var edit = {reload: true};
        angular.extend(edit, widget.edit);
        widget.edit = edit;
      }
      widgets[name] = widget;
      return this;
    };

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

    this.$get = function(){
      return {
        widgets: widgets,
        structures: structures,
        messageTemplate: messageTemplate,
        loadingTemplate: loadingTemplate
      };
    };

  });