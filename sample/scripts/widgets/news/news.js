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

angular.module('sample.widgets.news', ['adf.provider'])
  .value('newsServiceUrl', 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=JSON_CALLBACK&q=')
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('news', {
        title: 'News',
        description: 'Displays a RSS/Atom feed',
        templateUrl: 'scripts/widgets/news/news.html',
        controller: 'newsCtrl',
        resolve: {
          feed: function(newsService, config){
            if (config.url){
              return newsService.get(config.url);
            }
          }
        },
        edit: {
          templateUrl: 'scripts/widgets/news/edit.html'
        }
      });
  })
  .service('newsService', function($q, $http, newsServiceUrl){
    return {
      get: function(url){
        var deferred = $q.defer();
        $http.jsonp(newsServiceUrl + encodeURIComponent(url))
          .success(function(data){
            if (data && data.responseData && data.responseData.feed){
              deferred.resolve(data.responseData.feed);
            } else {
              deferred.reject();
            }
          })
          .error(function(){
            deferred.reject();
          });
        return deferred.promise;
      }
    };
  })
  .controller('newsCtrl', function($scope, feed){
    $scope.feed = feed;
  });