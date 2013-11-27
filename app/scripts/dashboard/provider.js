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

    var getTemplate = function($q, $sce, $http, $templateCache, widget){
      var deferred = $q.defer();

      if ( widget.template ){
        deferred.resolve(widget.template);
      } else if (widget.templateUrl) {
        var url = $sce.getTrustedResourceUrl(widget.templateUrl);
        $http.get(url, {cache: $templateCache})
          .success(function(response){
            deferred.resolve(response);
          })
          .error(function(){
            deferred.reject('could not load template');
          });
      }

      return deferred.promise;
    };

    var widgets = {};
    var structures = {};
    var loadingTemplate = '<div class="progress progress-striped active"><div class="progress-bar" role="progressbar" style="width: 100%"><span class="sr-only">loading ...</span></div></div>';

    this.widget = function(name, widget){
      widgets[name] = widget;
      return this;
    };

    this.structure = function(name, structure){
      structures[name] = structure;
      return this;
    };

    this.loadingTemplate = function(template){
      loadingTemplate = template;
      return this;
    }

    this.$get = function($q, $sce, $http, $templateCache){
      return {
        widgets: widgets,
        structures: structures,
        loadingTemplate: loadingTemplate,
        getTemplate: function(widget){
          return getTemplate($q, $sce, $http, $templateCache, widget);
        }
      };
    };

  });