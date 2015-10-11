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

describe('widget directive tests', function() {

  var $compile,
      $rootScope,
      $modal,
      $scope,
      directive,
      dashboard;

  // Load the myApp module, which contains the directive
  beforeEach(function(){
    var modalMock = {
      opts: null,
      open: function(opts){
        this.opts = opts;
      }
    };

    module('adf')
    module({
      $modal: modalMock
    })
  });

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_, _$modal_, _dashboard_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $modal = _$modal_;
      dashboard = _dashboard_;
      dashboard.widgets = [];

      $scope = $rootScope.$new();
      directive = '<adf-widget definition="definition" column="column" options="options" edit-mode="editMode" widget-state="widgetState" />';

      $scope.definition = {};
      $scope.column = {};
      $scope.widgetState = {};
      $scope.options = {};
      $scope.editMode = false;
  }));

  function compileTemplate(template) {
      // Compile a piece of HTML containing the directive
      var el = $compile(template)($scope);
      $scope.$digest();
      return el;
  }

  it('should render a single widget', function() {
      dashboard.widgets['test'] = {
        template: '<div class="hello">Hello World</div>'
      };
      $scope.definition = {
        type: 'test'
      };
      var element = compileTemplate(directive);
      expect(element.attr('adf-widget-type')).toBe('test');
      expect(element.find('.hello').text()).toBe('Hello World');
  });

  it('should remove the widget from dashboard', function() {
      dashboard.widgets['test'] = {
        template: '<div>Hello World</div>'
      };
      var widget = {
        type: 'test'
      };
      $scope.definition = widget;
      $scope.column = {
        widgets: [widget, {type: 'tesa'}]
      };
      $scope.editMode = true;

      var element = compileTemplate(directive);
      element.find('.glyphicon-remove').click();
      $scope.$digest();

      expect($scope.column.widgets.length).toBe(1);
      expect($scope.column.widgets[0].type).toBe('tesa');
  });

  it('should set isCollapsed to true', function() {
    dashboard.widgets['test'] = {
      template: '<div class="hello">Hello World</div>'
    };
    $scope.definition = {
      type: 'test'
    };
    compileTemplate(directive);
    expect($scope.widgetState.isCollapsed).toBeUndefined();
    $rootScope.$broadcast('adfDashboardCollapseExpand', {
      collapseExpandStatus: true
    });
    $scope.$digest();
    expect($scope.widgetState.isCollapsed).toBe(true);
  });

  it('should open the edit mode', function() {
    dashboard.widgets['test'] = {
      wid: 1,
      template: '<div class="hello">Hello World</div>',
      edit: {
        immediate: true
      }
    };
    $scope.definition = {
      type: 'test'
    };
    compileTemplate(directive);
    $rootScope.$broadcast('adfWidgetEnterEditMode', dashboard.widgets['test']);

    // check for edit mode template
    expect($modal.opts.templateUrl).toBe('../src/templates/widget-edit.html');
    // check for correct widget in edit scope
    expect($modal.opts.scope.definition.wid).toBe(1);
  });

});
