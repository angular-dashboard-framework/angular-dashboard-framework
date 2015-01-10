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

angular.module('sample.widgets.weather', ['adf.provider'])
  .value('weatherServiceUrl', 'http://api.openweathermap.org/data/2.5/weather?units=metric&callback=JSON_CALLBACK&q=')
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('weather', {
        title: 'Weather',
        description: 'Display the current temperature of a city',
        templateUrl: 'scripts/widgets/weather/weather.html',
        controller: 'weatherCtrl',
        reload: true,
        resolve: {
          data: function(weatcherService, config){
            if (config.location){
              return weatcherService.get(config.location);
            }
          }
        },
        edit: {
          templateUrl: 'scripts/widgets/weather/edit.html'
        }
      });
  })
  .service('weatcherService', function($q, $http, weatherServiceUrl){
    return {
      get: function(location){
        var deferred = $q.defer();
        var url = weatherServiceUrl + location;
        $http.jsonp(url)
          .success(function(data){
            if (data && data.cod === 200){
              deferred.resolve(data);
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
  .controller('weatherCtrl', function($scope, data){
    $scope.data = data;
  });
