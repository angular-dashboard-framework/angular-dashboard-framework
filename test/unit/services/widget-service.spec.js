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

describe('widgetService tests', function() {

  var $rootScope,
      dashboard,
      $templateCache,
      $httpBackend,
      widgetService;

  // Load the myApp module, which contains the directive
  beforeEach(module('adf'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$rootScope_, _$templateCache_, _$httpBackend_, _dashboard_, widgetService){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $rootScope = _$rootScope_;
    $templateCache = _$templateCache_;
    $httpBackend = _$httpBackend_;
    dashboard = _dashboard_;
    // inject the real service for testing
    this.widgetService = widgetService;

    // configure widgets path for {widgetsPath} placeholder
    dashboard.widgetsPath = 'views';
  }));

  it('should resolve the widget template', function() {
    var widget = {
      template: '<h1>Hello</h1>'
    };

    var promise = this.widgetService.getTemplate(widget);
    expect(promise).toBeDefined();

    var template;
    promise.then(function(tpl){
      template = tpl;
    });
    $rootScope.$apply();

    expect(template).toBe('<h1>Hello</h1>');
  });

  it('should resolve the widget template url', function(){
    $httpBackend.when('GET', 'views/hello.html').respond('<h1>Hello</h1>');

    var widget = {
      templateUrl: 'views/hello.html'
    };

    var promise = this.widgetService.getTemplate(widget);
    expect(promise).toBeDefined();

    $httpBackend.flush();

    var template;
    promise.then(function(tpl){
      template = tpl;
    });
    $rootScope.$apply();

    expect(template).toBe('<h1>Hello</h1>');
  });

  it('should resolve the widget template from cache', function(){
    $templateCache.put('views/cache.html', '<h1>Hello from Cache</h1>');
    var widget = {
      templateUrl: 'views/cache.html'
    };

    var promise = this.widgetService.getTemplate(widget);
    expect(promise).toBeDefined();

    var template;
    promise.then(function(tpl){
      template = tpl;
    });
    $rootScope.$apply();

    expect(template).toBe('<h1>Hello from Cache</h1>');
  });

  it('should reject the widget template, if the http request fails', function(){
    $httpBackend.when('GET', 'views/error.html').respond(500, 'error');
    var widget = {
      templateUrl: 'views/error.html'
    };

    var promise = this.widgetService.getTemplate(widget);
    expect(promise).toBeDefined();

    $httpBackend.flush();

    var message;
    promise.catch(function(msg){
      message = msg;
    });
    $rootScope.$apply();

    expect(message).toBe('could not load template');
  });

  it('should resolve the widget template url with placeholder', function(){
    $httpBackend.when('GET', 'views/ph.html').respond('<h1>Hello</h1>');

    var widget = {
      templateUrl: '{widgetsPath}/ph.html'
    };

    var promise = this.widgetService.getTemplate(widget);
    expect(promise).toBeDefined();

    $httpBackend.flush();

    var template;
    promise.then(function(tpl){
      template = tpl;
    });
    $rootScope.$apply();

    expect(template).toBe('<h1>Hello</h1>');
  });

});
