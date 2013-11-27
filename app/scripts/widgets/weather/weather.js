'use strict';

angular.module('dashboard.widgets.weather', ['dashboard.provider'])
  .value('weatherServiceUrl', 'http://api.openweathermap.org/data/2.5/weather?units=metric&callback=JSON_CALLBACK&q=')
  .service('weatcherService', function($q, $http, weatherServiceUrl){
    return {
      get: function(location){
        var deferred = $q.defer();
        var url = weatherServiceUrl + location;
        $http.jsonp(url)
          .success(function(data){
            if (data){
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
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('weather', {
        title: 'Weather',
        templateUrl: 'scripts/widgets/weather/weather.html',
        controller: 'weatherCtrl',
        resolve: {
          data: function(weatcherService, config){
            return weatcherService.get(config.location);
          }
        }
      });
  })
  .controller('weatherCtrl', function($scope, data){
    $scope.data = data;
  });