'use strict';

angular.module('dashboard.widgets.news', ['dashboard.provider'])
  .value('newsServiceUrl', 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=JSON_CALLBACK&q=')
  .service('newsService', function($q, $http, newsServiceUrl){
    return {
      get: function(url){
        var deferred = $q.defer();
        var url =  newsServiceUrl + encodeURIComponent(url) ;
        $http.jsonp(url).success(function(data){
          deferred.resolve(data.responseData.feed.entries);
        });
        return deferred.promise;
      }
    };
  })
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('news', {
        title: 'News',
        templateUrl: 'scripts/widgets/news/news.html',
        controller: 'newsCtrl',
        resolve: {
          entries: function(newsService, config){
            return newsService.get(config.url);
          }
        }
      });
  })
  .controller('newsCtrl', function($scope, entries){
    $scope.entries = entries;
  });