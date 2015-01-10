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

'use strict';

angular.module('sample.widgets.github', ['adf.provider', 'highcharts-ng'])
  .value('githubApiUrl', 'https://api.github.com/repos/')
  .config(function(dashboardProvider){
    // template object for github widgets
    var widget = {
      templateUrl: 'scripts/widgets/github/github.html',
      reload: true,
      resolve: {
        commits: function(githubService, config){
          if (config.path){
            return githubService.get(config.path);
          }
        }
      },
      edit: {
        templateUrl: 'scripts/widgets/github/edit.html'
      }
    };

    // register github template by extending the template object
    dashboardProvider
      .widget('githubHistory', angular.extend({
        title: 'Github History',
        description: 'Display the commit history of a GitHub project as chart',
        controller: 'githubHistoryCtrl'
        }, widget))
      .widget('githubAuthor', angular.extend({
        title: 'Github Author',
        description: 'Displays the commits per author as pie chart',
        controller: 'githubAuthorCtrl'
        }, widget));

  })
  .service('githubService', function($q, $http, githubApiUrl){
    return {
      get: function(path){
        var deferred = $q.defer();
        var url = githubApiUrl + path + '/commits?callback=JSON_CALLBACK';
        $http.jsonp(url)
          .success(function(data){
            if (data && data.meta){
              var status = data.meta.status;
              if ( status < 300 ){
                deferred.resolve(data.data);
              } else {
                deferred.reject(data.data.message);
              }
            }
          })
          .error(function(){
            deferred.reject();
          });
        return deferred.promise;
      }
    };
  })
  .controller('githubHistoryCtrl', function($scope, config, commits){

    function parseDate(input) {
      var parts = input.split('-');
      return Date.UTC(parts[0], parts[1]-1, parts[2]);
    }

    var data = {};
    angular.forEach(commits, function(commit){
      var day = commit.commit.author.date;
      day = day.substring(0, day.indexOf('T'));

      if (data[day]){
        data[day]++;
      } else {
        data[day] = 1;
      }
    });

    var seriesData = [];
    angular.forEach(data, function(count, day){
      seriesData.push([parseDate(day), count]);
    });
    seriesData.sort(function(a, b){
      return a[0] - b[0];
    });

    if ( commits ){
      $scope.chartConfig = {
        chart: {
          type: 'spline'
        },
        title: {
          text: 'Github commit history'
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: 'Commits'
          },
          min: 0
        },
        series: [{
          name: config.path,
          data: seriesData
        }]
      };
    }

  })
  .controller('githubAuthorCtrl', function($scope, config, commits){

    var data = {};
    angular.forEach(commits, function(commit){
      var author = commit.commit.author.name;
      if (data[author]){
        data[author]++;
      } else {
        data[author] = 1;
      }
    });

    var seriesData = [];
    angular.forEach(data, function(count, author){
      seriesData.push([author, count]);
    });
    if (seriesData.length > 0){
      seriesData.sort(function(a, b){
        return b[1] - a[1];
      });
      var s = seriesData[0];
      seriesData[0] = {
        name: s[0],
        y: s[1],
        sliced: true,
        selected: true
      };
    }

    if ( commits ){
      $scope.chartConfig = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: config.path
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [{
          type: 'pie',
          name: config.path,
          data: seriesData
        }]
      };
    }

  });
