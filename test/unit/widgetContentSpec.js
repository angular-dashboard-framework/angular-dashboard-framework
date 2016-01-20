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

describe('widget-content directive tests', function() {

  var $compile,
      $rootScope,
      $scope,
      directive,
      $q,
      $templateCache,
      $httpBackend,
      dashboard;

  // Load the myApp module, which contains the directive
  beforeEach(module('adf'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_, _$q_, _$templateCache_, _$httpBackend_, _dashboard_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $q = _$q_;
      $templateCache = _$templateCache_;
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
      dashboard = _dashboard_;
      $scope = $rootScope.$new();
      directive = '<adf-widget-content model="definition" content="widget" />';

      $scope.definition = {};
      $scope.widget = {};
  }));

  function compileTemplate(template) {
      // Compile a piece of HTML containing the directive
      var el = $compile(template)($scope);
      $scope.$digest();
      return el;
  }

  it('should render a widget', function() {
      $scope.widget = {
        template: '<div class="test-widget">Hello World</div>'
      };

      var element = compileTemplate(directive);
      expect(element.find("div.test-widget").text()).toBe('Hello World');
  });

  it('should render a widget with a controller', function() {
      $scope.widget = {
        template: '<div class="test-widget">{{prop}}</div>',
        controller: function($scope){
          $scope.prop = 'Hello World'
        }
      };

      var element = compileTemplate(directive);
      expect(element.find("div.test-widget").text()).toBe('Hello World');
  });

  it('should render a widget with controller as syntax', function() {
      $scope.widget = {
        template: '<div class="test-widget">{{vm.prop}}</div>',
        controllerAs: 'vm',
        controller: function(){
          this.prop = 'Hello World'
        }
      };

      var element = compileTemplate(directive);
      expect(element.find("div.test-widget").text()).toBe('Hello World');
  });

  it('should render a widget with resolve', function() {
      $scope.widget = {
        template: '<div class="test-widget">{{prop}}</div>',
        controller: function($scope, prop){
          $scope.prop = prop;
        },
        resolve: {
          prop: function(){
            var deferred = $q.defer();
            deferred.resolve('Hello World');
            return deferred.promise;
          }
        }
      };

      var element = compileTemplate(directive);
      expect(element.find("div.test-widget").text()).toBe('Hello World');
  });

  it('should render a widget with a templateUrl', function() {
      $templateCache.put('src/test.js', '<div class="test-widget">Hello World</div>');
      $scope.widget = {
        templateUrl: 'src/test.js'
      };

      var element = compileTemplate(directive);
      expect(element.find("div.test-widget").text()).toBe('Hello World');
  });

  it('should render a widget with a remote template', function() {
      $httpBackend.whenGET('src/test.html').respond(200, '<div class="test-widget">Hello World</div>');

      $scope.widget = {
        templateUrl: 'src/test.html'
      };

      var element = compileTemplate(directive);
      $httpBackend.flush();
      expect(element.find("div.test-widget").text()).toBe('Hello World');
  });

  it('should render a widget with a failed remote template', function() {
      $httpBackend.whenGET('src/test.html').respond(500);

      $scope.widget = {
        templateUrl: 'src/test.html'
      };

      var element = compileTemplate(directive);
      $httpBackend.flush();
      expect(element.find("div.alert").text()).toContain('could not load template');
  });

  it('should render a widget with a remote template and a parsed url', function() {
      dashboard.widgetsPath = 'src';
      $httpBackend.whenGET('src/test.html').respond(200, '<div class="test-widget">Hello World</div>');

      $scope.widget = {
        templateUrl: '{widgetsPath}/test.html'
      };

      var element = compileTemplate(directive);
      $httpBackend.flush();
      expect(element.find("div.test-widget").text()).toBe('Hello World');
  });

  it('should render a widget with a remote template and a absolute parsed url', function() {
      dashboard.widgetsPath = '/src';
      $httpBackend.whenGET('src/test.html').respond(200, '<div class="test-widget">Hello World</div>');

      $scope.widget = {
        templateUrl: '{widgetsPath}/test.html'
      };

      var element = compileTemplate(directive);
      $httpBackend.flush();
      expect(element.find("div.test-widget").text()).toBe('Hello World');
  });

  it('should rerender the widget on event', function() {
      var counter = 0;
      $scope.widget = {
        template: '<div class="test-widget">{{counter}}</div>',
        controller: function($scope){
          $scope.counter = counter++;
        }
      };

      var element = compileTemplate(directive);
      expect(element.find("div.test-widget").text()).toBe('0');

      $scope.$broadcast('widgetConfigChanged');
      $scope.$digest();
      expect(element.find("div.test-widget").text()).toBe('1');

      $scope.$broadcast('widgetReload');
      $scope.$digest();
      expect(element.find("div.test-widget").text()).toBe('2');
  });

});
