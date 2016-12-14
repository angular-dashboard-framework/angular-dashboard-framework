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

describe('Dashboard Directive tests', function () {

    var $compile,
        $rootScope,
        $scope,
        directive,
        $uibModal,
        $uibModalInstance,
        dashboard;

    // Load the myApp module, which contains the directive
    beforeEach(function(){
      $uibModalInstance = {
        closed: false,
        close: function(){
          this.closed = true;
        }
      };

      var modalMock = {
        opts: null,
        open: function(opts){
          this.opts = opts;
          return $uibModalInstance;
        }
      };

      module('adf')
      module({
        $uibModal: modalMock
      })
    });

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$compile_, _$rootScope_, _$uibModal_,_dashboard_) {
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $uibModal = _$uibModal_;
      $scope = $rootScope.$new();
      dashboard = _dashboard_;
      directive = '<adf-dashboard name="{{name}}" collapsible="{{collapsible}}" maximizable="{{maximizable}}" categories="{{categories}}" continuous-edit-mode="continuousEditMode" structure="4-8" adf-model="model" />';

      $scope.name = 'sample-01';
      $scope.model = {
          title: "Sample 01",
          structure: "4-8",
          rows: [{
              columns: [{
                  styleClass: "col-md-4",
                  widgets: []
              },{
                styleClass: "col-md-8",
                widgets: []
              }]
          }]
      };
      $scope.collapsible = false;
      $scope.maximizable = false;
      $scope.categories = false;
      $scope.continuousEditMode = false;
    }));

    function compileTemplate(template) {
        // Compile a piece of HTML containing the directive
        var el = $compile(template)($scope);
        $scope.$digest();
        return el;
    }

    it('should have the proper name in the h1 element (default template)', function () {

        var element = compileTemplate(directive);
        expect(element.find("h1").text().trim()).toBe('Sample 01');
    });

    it('should not change the name when the title changes (default template)', function () {

        var element = compileTemplate(directive);
        expect(element.find("h1").text().trim()).toBe('Sample 01');

        // Change the name of the dashboard
        $scope.name = 'Sample 02';
        expect(element.find("h1").text().trim()).toBe('Sample 01');
    });

    it('should not change the name when the title changes (default template)', function () {

        var element = compileTemplate(directive);
        expect(element.find("h1").text().trim()).toBe('Sample 01');

        // Change the name of the dashboard
        $scope.name = 'Sample 02';
        expect(element.find("h1").text().trim()).toBe('Sample 01');
    });

    it('should toggle edit mode correctly', function () {

        var element = compileTemplate(directive);
        expect(element.controller).not.toBeUndefined();
        expect($scope).not.toBeUndefined();

        var isolatedScope = element.isolateScope();

        // By default it is false
        expect(isolatedScope.editMode).toBeFalsy();

        // Enable edit mode
        isolatedScope.toggleEditMode();
        expect(isolatedScope.editMode).toBeTruthy();

        // Disable edit mode
        isolatedScope.toggleEditMode();
        expect(isolatedScope.editMode).toBeFalsy();
    });

    it('should cancel edit mode correctly', function () {

        var element = compileTemplate(directive);
        expect(element.controller).not.toBeUndefined();
        expect($scope).not.toBeUndefined();

        var isolatedScope = element.isolateScope();

        // By default it is false
        expect(isolatedScope.editMode).toBeFalsy();

        // Enable edit mode
        isolatedScope.toggleEditMode();
        expect(isolatedScope.editMode).toBeTruthy();

        // Cancel edit mode
        isolatedScope.cancelEditMode();
        expect(isolatedScope.editMode).toBeFalsy();
    });

    it('should dispatch the `dfDashboardCollapseExapand` event downwards to all child scopes (and their children)', function () {

        var element = compileTemplate(directive);
        expect(element.controller).not.toBeUndefined();
        expect($scope).not.toBeUndefined();

        var isolatedScope = element.isolateScope();
        spyOn($rootScope, '$broadcast');

        // Enable edit mode
        isolatedScope.collapseAll(1);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('adfDashboardCollapseExpand', {collapseExpandStatus: 1});
    });

    it('should not copy the model, if the directive is in continuous edit mode', function () {

        $scope.continuousEditMode = true;

        var element = compileTemplate(directive);
        expect(element.controller).not.toBeUndefined();
        expect($scope).not.toBeUndefined();
        spyOn(angular, 'copy');

        var isolatedScope = element.isolateScope();

        isolatedScope.toggleEditMode();

        expect(isolatedScope.editMode).toBeTruthy();
        expect(angular.copy).not.toHaveBeenCalled()
    });

    it('should copy the model, if the directive is not continuous edit mode', function () {

        $scope.continuousEditMode = false;

        var element = compileTemplate(directive);
        expect(element.controller).not.toBeUndefined();
        expect($scope).not.toBeUndefined();

        var isolatedScope = element.isolateScope();

        isolatedScope.toggleEditMode();

        expect(isolatedScope.editMode).toBeTruthy();
        expect(isolatedScope.modelCopy).not.toBe(isolatedScope.adfModel);
    });

    it('should toggle the edit mode on the adfToggleEditMode event', function() {

        var element = compileTemplate(directive);
        expect(element.controller).not.toBeUndefined();
        expect($scope).not.toBeUndefined();

        var isolatedScope = element.isolateScope();

        isolatedScope.toggleEditMode = jasmine.createSpy('toggleEditMode');

        isolatedScope.$broadcast('adfToggleEditMode');

        expect(isolatedScope.toggleEditMode).toHaveBeenCalled();
    });

    it('should create a fresh model', function(){
      dashboard.structures['4-8'] = {
        rows: [{
            columns: [{
              styleClass: "col-md-4"
            },{
              styleClass: "col-md-8"
            }]
        }]
      };

      $scope.model = {};
      compileTemplate(directive);

      // default title
      expect($scope.model.title).toBe('Dashboard');

      // structure copy
      expect($scope.model.rows.length).toBe(1);
      expect($scope.model.rows[0].columns.length).toBe(2);
    });

    it('should open edit dialog', function(){
      var element = compileTemplate(directive);
      var isolatedScope = element.isolateScope();
      isolatedScope.editDashboardDialog();
      expect($uibModal.opts.templateUrl).toBe('../src/templates/dashboard-edit.html');
    });

    it('should split the structures into an array', function(){
      var element = compileTemplate(directive);
      var isolatedScope = element.isolateScope();
      isolatedScope.editDashboardDialog();
      var scope = $uibModal.opts.scope;

      var structures = {
        a: '1',
        b: '2',
        c: '3',
        d: '4'
      };

      var splitted = scope.split(structures, 2);
      expect(splitted[0].a).toBe('1');
      expect(splitted[0].c).toBe('3');
      expect(splitted[1].b).toBe('2');
      expect(splitted[1].d).toBe('4');
    });

    it('should open edit dialog with custom template', function(){
      $scope.model.editTemplateUrl = '../src/templates/widget-edit.html';
      var element = compileTemplate(directive);
      var isolatedScope = element.isolateScope();
      isolatedScope.editDashboardDialog();
      expect($uibModal.opts.templateUrl).toBe('../src/templates/widget-edit.html');
    });

    it('should close edit dialog', function(){
      var element = compileTemplate(directive);
      var isolatedScope = element.isolateScope();
      isolatedScope.editDashboardDialog();
      expect($uibModalInstance.closed).toBeFalsy();
      $uibModal.opts.scope.closeDialog();
      expect($uibModalInstance.closed).toBeTruthy();
    });

    describe('add widget functions', function(){

      var $timeout;

      beforeEach(inject(function(_$timeout_){
        $timeout = _$timeout_;
        // add widgets to dashboard
        dashboard.widgets['one'] = {
          template: '<div class="hello">Hello World</div>',
          config: {
            a: 'b'
          }
        };
      }));

      it('should open add widget dialog', function(){
        var element = compileTemplate(directive);
        var isolatedScope = element.isolateScope();
        isolatedScope.addWidgetDialog();

        expect($uibModal.opts.templateUrl).toBe('../src/templates/widget-add.html');
      });

      it('should create categories from widgets', function(){
        // enabled categories
        $scope.categories = true;

        // render directive
        var element = compileTemplate(directive);

        // get dialog scope
        var isolatedScope = element.isolateScope();
        isolatedScope.addWidgetDialog();
        var scope = $uibModal.opts.scope;

        // create sample widgets
        var widgets = [{
          title: '1',
          category: 'a'
        },{
          title: '2',
          category: 'a'
        }, {
          title: '3',
          category: 'b'
        }, {
          title: '4'
        }];

        // create categories and test
        var categories = scope.createCategories(widgets);
        expect(Object.keys(categories.a.widgets).length).toBe(2);
        expect(Object.keys(categories.b.widgets).length).toBe(1);
        expect(Object.keys(categories.Miscellaneous.widgets).length).toBe(1);
      });

      it('should close add widget dialog', function(){
        var element = compileTemplate(directive);
        var isolatedScope = element.isolateScope();
        isolatedScope.addWidgetDialog();
        expect($uibModalInstance.closed).toBeFalsy();
        $uibModal.opts.scope.closeDialog();
        expect($uibModalInstance.closed).toBeTruthy();
      });

      it('should add a new widget to the dashboard', function(){
        // open add widget dialog
        var element = compileTemplate(directive);
        var isolatedScope = element.isolateScope();
        isolatedScope.addWidgetDialog();

        // call add widget on dialog scope
        $uibModal.opts.scope.addWidget('one');
        var widget = $scope.model.rows[0].columns[0].widgets[0];
        expect(widget.type).toBe('one');
        // check for copied config
        expect(widget.config.a).toBe('b');
      });

      it('should add a new widget and open edit mode immediately', function(){
        dashboard.widgets['one'].edit = {
          immediate: true
        };
        // open add widget dialog
        var element = compileTemplate(directive);
        var isolatedScope = element.isolateScope();
        isolatedScope.addWidgetDialog();

        // add widget
        $uibModal.opts.scope.addWidget('one');

        // flush timeout and check for event
        var event, widget;
        spyOn(isolatedScope, '$broadcast').and.callFake(function(e, w){
          event = e;
          widget = w;
        });
        $timeout.flush();
        expect(event).toBe('adfWidgetEnterEditMode');
        expect(widget.type).toBe('one');
      });

    });

    describe('change structure', function(){

      beforeEach(function(){
        // add widgets to dashboard
        dashboard.widgets['one'] = {
          template: '<div class="hello">Hello from One</div>'
        };
        dashboard.widgets['two'] = {
          template: '<div class="hello">Hello from Two</div>'
        };

        // add structures to dashboard
        dashboard.structures['4-8'] = {
          rows: [{
              columns: [{
                  styleClass: "col-md-4",
                  widgets: []
              },{
                styleClass: "col-md-8",
                widgets: []
              }]
          }]
        };
        dashboard.structures['12'] = {
          rows: [{
              columns: [{
                  styleClass: "col-md-12",
                  widgets: []
              }]
          }]
        };

        dashboard.structures['3-9 (12/6-6)'] = {
          rows: [{
            columns: [{
              styleClass: 'col-md-3'
            }, {
              styleClass: 'col-md-9',
              rows: [{
                columns: [{
                  styleClass: 'col-md-12'
                }]
              }, {
                columns: [{
                  styleClass: 'col-md-6'
                }, {
                  styleClass: 'col-md-6'
                }]
              }]
            }]
          }]
        };

      });

      it('should change the dashboard structure', function(){
        var element = compileTemplate(directive);
        var isolatedScope = element.isolateScope();
        // model shoule have two column in 4-8 structure
        expect($scope.model.rows[0].columns.length).toBe(2);

        isolatedScope.editDashboardDialog();
        $uibModal.opts.scope.changeStructure('12', dashboard.structures['12']);

        // model shoule have two column in 12 structure
        expect($scope.model.rows[0].columns.length).toBe(1);
      });

      it('should read the correct number of columns in a structure', function(){
        var element = compileTemplate(directive);
        var isolatedScope = element.isolateScope();

        isolatedScope.editDashboardDialog();
        $uibModal.opts.scope.changeStructure('3-9 (12/6-6)', dashboard.structures['3-9 (12/6-6)']);

        expect(isolatedScope.readColumns($scope.model).length).toBe(4);
      });

      it('should change the dashboard structure and move widgets', function(){
        $scope.model.rows[0].columns[0].widgets.push({
          type: 'one'
        });
        $scope.model.rows[0].columns[1].widgets.push({
          type: 'two'
        });

        var element = compileTemplate(directive);
        var isolatedScope = element.isolateScope();

        isolatedScope.editDashboardDialog();
        $uibModal.opts.scope.changeStructure('12', dashboard.structures['12']);

        // column should contain two widgets
        expect($scope.model.rows[0].columns[0].widgets.length).toBe(2);
      });

    });
});
