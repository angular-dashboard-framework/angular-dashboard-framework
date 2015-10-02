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

describe('column directive tests', function() {

  var $compile,
      $rootScope,
      $scope,
      directive,
      dashboard;

  // Load the myApp module, which contains the directive
  beforeEach(module('adf'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_, _dashboard_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      dashboard = _dashboard_;
      dashboard.widgets = [];
      dashboard.widgets['test'] = {
        title: 'Test',
        template: '<div class="test-widget">Hello</div>'
      };

      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      directive = '<adf-dashboard-column column="column" adf-model="adfModel" options="options" edit-mode="editMode" />';

      $scope.column = {};
      $scope.adfModel = {};
      $scope.options = {};
      $scope.editMode = false;
  }));

  function compileTemplate(template) {
      // Compile a piece of HTML containing the directive
      var el = $compile(template)($scope);
      $scope.$digest();
      return el;
  }

  it('should render a single column without widgets', function() {
      var element = compileTemplate(directive);
      expect(element.hasClass("column")).toBeTruthy();
      expect(element.attr("adf-id").length).toBeDefined();
      expect(element.find(".widget").length).toBe(0);
  });

  it('should render a single column with a single widget', function() {
      $scope.column = {
        widgets: [{
          type: 'test'
        }]
      };

      var element = compileTemplate(directive);
      expect(element.hasClass("column")).toBeTruthy();
      expect(element.find(".widget").length).toBe(1);
      expect(element.find("div.test-widget").text()).toBe('Hello');
  });

  it('should render a single column with a nested row', function() {
      $scope.column = {
        rows: [{}]
      };

      var element = compileTemplate(directive);
      expect(element.find(".row").length).toBe(1);
  });

    it('should create the sortable', function () {
        spyOn(Sortable, 'create');

        var element = compileTemplate(directive);
        $scope.$digest();

        expect(Sortable.create).toHaveBeenCalled();
    });

  describe('applySortable', function () {
    var fromElement, itemElement, sourceColumn, desinationColumn, event, element, onAdd, onRemove, onUpdate;

    beforeEach(function () {
      spyOn(Sortable, 'create')
      .and.callFake(function (element, options) {
        onAdd = options.onAdd;
        onRemove = options.onRemove;
        onUpdate = options.onUpdate;
      });

      spyOn($rootScope, '$broadcast').and.callThrough();

      fromElement = angular.element("<div adf-id='1'>")[0];
      itemElement = angular.element("<div adf-id='2'>")[0];
      sourceColumn = {cid: 1, widgets: [{wid: 2, type: 'test'}]};
      desinationColumn = {cid: 2, widgets: []};

      $scope.adfModel.rows = [
        {
          columns: [sourceColumn]
        }
      ];

      $scope.column = desinationColumn;

      event = {
        from: fromElement,
        item: itemElement
      };

      element = compileTemplate(directive);
      $scope.$digest();
    });

    it('should broadcast an event after adding the widget to the column', function () {

      onAdd(event);

      expect(Sortable.create).toHaveBeenCalled();
      expect($rootScope.$broadcast).toHaveBeenCalled();
    });

    it('should broadcast an event after removing the widget from the column', function () {

      onRemove(event);

      expect(Sortable.create).toHaveBeenCalled();
      expect($rootScope.$broadcast).toHaveBeenCalled();
    });
  });
});
