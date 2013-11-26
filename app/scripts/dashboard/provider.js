'use strict';

angular.module('dashboard.provider', [])
  .provider('dashboard', function(){

    var getTemplate = function($q, $sce, $http, $templateCache, widget){
      var deferred = $q.defer();

      if ( widget.template ){
        deferred.resolve(widget.template);
      } else if (widget.templateUrl) {
        var url = $sce.getTrustedResourceUrl(widget.templateUrl);
        $http.get(url).success(function(response){
          deferred.resolve(response);
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