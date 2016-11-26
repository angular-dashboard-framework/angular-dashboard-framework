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
      $uibModal,
      $uibModalInstance,
      $scope,
      directive,
      dashboard,
      $templateCache;

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
  beforeEach(inject(function(_$compile_, _$rootScope_, _$uibModal_, _dashboard_, _$templateCache_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $uibModal = _$uibModal_;
      dashboard = _dashboard_;
      dashboard.widgets = [];
      $templateCache = _$templateCache_;

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

  it('should rerender the widget on refresh', function(){
    var counter = 0;
    dashboard.widgets['test'] = {
      template: '<div class="hello">Hello World</div>',
      reload: true,
      controller: function(){
        counter++;
      }
    };
    $scope.definition = {
      type: 'test'
    };
    var element = compileTemplate(directive);
    expect(counter).toBe(1);
    element.find('.glyphicon-refresh').click();
    expect(counter).toBe(2);
  });

  it('should load the default widget template', function(){
    dashboard.widgets['test'] = {
      template: '<div class="hello">Hello World</div>',
    };
    $scope.definition = {
      type: 'test'
    };

    spyOn($templateCache, 'get').and.returnValue('<div></div>');
    var element = compileTemplate(directive);
    expect($templateCache.get).toHaveBeenCalledWith('../src/templates/widget.html');
  });

  it('should load a custom widget template', function(){
    dashboard.widgets['test'] = {
      template: '<div class="hello">Hello World</div>',
    };
    $scope.definition = {
      type: 'test'
    };

    spyOn($templateCache, 'get').and.returnValue('<div></div>');
    var customWidgetTemplatePath = null;
    dashboard.customWidgetTemplatePath = '..src/templates/customWidget.html';
    var element = compileTemplate(directive);
    expect($templateCache.get).toHaveBeenCalledWith(dashboard.customWidgetTemplatePath);
  });

  describe('delete functions', function(){

    beforeEach(function(){
      dashboard.widgets['test'] = {
        template: '<div>Confirm delete test</div>'
      };
      var widget = {
        type: 'test'
      };
      $scope.definition = widget;
      $scope.column = {
        widgets: [widget, {type: 'test'}]
      };

      $scope.editMode = true;
    });

    function removeWidget(){
      var element = compileTemplate(directive);
      element.find('.glyphicon-remove').click();
      $scope.$digest();
    }

    it('should remove the widget from dashboard', function() {
        removeWidget();
        expect($scope.column.widgets.length).toBe(1);
        expect($scope.column.widgets[0].type).toBe('test');
    });

    it('should open confirmation dialog on widget remove', function(){
      $scope.options.enableConfirmDelete = true;
      removeWidget();

      // check for delete template
      expect($uibModal.opts.templateUrl).toBe('../src/templates/widget-delete.html');
    });

    it('should open confirmation dialog with custom template', function(){
      $scope.definition.deleteTemplateUrl = '../src/templates/widget-edit.html';
      $scope.options.enableConfirmDelete = true;
      removeWidget();

      // check for delete template
      expect($uibModal.opts.templateUrl).toBe('../src/templates/widget-edit.html');
    });

    it('should not delete the widget when confirmation dialog is canceled', function(){
      $scope.options.enableConfirmDelete = true;
      removeWidget();

      $uibModal.opts.scope.closeDialog();
      expect($uibModalInstance.closed).toBeTruthy();

      // expect widget is not removed
      expect($scope.column.widgets.length).toBe(2);

      //expect dashboards translate function to be attatched to the scope
      expect($uibModal.opts.scope.translate).toEqual(dashboard.translate);
    });

    it('should delete the widget when confirmation dialog is applied', function(){
      $scope.options.enableConfirmDelete = true;
      removeWidget();

      $uibModal.opts.scope.deleteDialog();
      expect($uibModalInstance.closed).toBeTruthy();

      // expect widget is not removed
      expect($scope.column.widgets.length).toBe(1);
    });

    it('should broadcast event with the definition of the deleted', function() {
      spyOn($rootScope, '$broadcast').and.returnValue({preventDefault: true});
      $scope.options.enableConfirmDelete = false;
      removeWidget();

      var definition = jasmine.objectContaining($scope.column.widgets[0]);
      expect($rootScope.$broadcast).toHaveBeenCalledWith('adfWidgetRemovedFromColumn', definition);
    });

  });

  it('should open and close full screen dialog', function() {
    dashboard.widgets['test'] = {
      template: '<div class="hello">Hello World</div>'
    };
    $scope.definition = {
      type: 'test'
    };
    compileTemplate(directive);
    var element = compileTemplate(directive);
    element.find('.glyphicon-fullscreen').click();
    $scope.$digest();

    // check for opened full screent
    expect($uibModal.opts.templateUrl).toBe('../src/templates/widget-fullscreen.html');
    expect($uibModalInstance.closed).toBeFalsy();

    // check close function
    $uibModal.opts.scope.closeDialog();
    expect($uibModalInstance.closed).toBeTruthy();
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

  describe('edit mode tests', function(){

    beforeEach(function(){
      dashboard.widgets['test'] = {
        wid: '1',
        template: '<div class="hello">Hello World</div>',
        edit: {
          immediate: true
        }
      };

      $scope.definition = {
        wid: '1',
        type: 'test'
      };
    });

    function openEditMode(){
      compileTemplate(directive);
      $rootScope.$broadcast('adfWidgetEnterEditMode', dashboard.widgets['test']);

      // check for edit mode template
      expect($uibModal.opts.templateUrl).toBe('../src/templates/widget-edit.html');
      // check for correct widget in edit scope
      expect($uibModal.opts.scope.definition.wid).toBe('1');
    }

    function checkApplyFunction(apply, check){
      dashboard.widgets['test'].edit.apply = apply;

      openEditMode();

      // call save dialog method
      $uibModal.opts.scope.saveDialog();

      // TODO find better way as timeout
      $scope.$digest();
      check();
    }

    it('should open the edit mode', openEditMode);

    it('should open the edit mode with custom template', function() {
      $scope.definition.editTemplateUrl = '../src/templates/widget-delete.html';
      compileTemplate(directive);
      $rootScope.$broadcast('adfWidgetEnterEditMode', dashboard.widgets['test']);

      // check for custom template
      expect($uibModal.opts.templateUrl).toBe('../src/templates/widget-delete.html');
    });

    it('should open the edit mode with falsy apply', function() {
      checkApplyFunction(function(){
        return false;
      }, function(){
        expect($uibModal.opts.scope.validationError).not.toBeNull();
      });
      expect($uibModalInstance.closed).toBeFalsy();
    });

    it('should open the edit mode with truthy apply', function() {
      checkApplyFunction(function(){
        return true;
      }, function(){
        expect($uibModal.opts.scope.validationError).toBeNull();
      });
      expect($uibModalInstance.closed).toBeTruthy();
    });

    it('should open the edit mode with truthy promise apply', function() {
      checkApplyFunction(function($q){
        return $q.when('success');
      }, function(){
        expect($uibModal.opts.scope.validationError).toBeNull();
      });
      expect($uibModalInstance.closed).toBeTruthy();
    });

    it('should open the edit mode with falsy promise apply', function() {
      checkApplyFunction(function($q){
        var deferred = $q.defer();
        deferred.reject('failed');
        return deferred.promise;
      }, function(){
        expect($uibModal.opts.scope.validationError).not.toBeNull();
      });
      expect($uibModalInstance.closed).toBeFalsy();
    });

    it('should have dashboards translate function attatched to the scope', function() {
      openEditMode();
      expect($uibModal.opts.scope.translate).toEqual(dashboard.translate);
    });

  });

  describe('widget classes', function(){

    beforeEach(function(){
      dashboard.widgets['test'] = {
        template: '<div class="hello">Hello World</div>'
      };
      $scope.definition = {
        type: 'test',
        styleClass: 'sample'
      };
    });

    it('should render the widget with classes', function() {
        var element = compileTemplate(directive);
        expect(element.attr('class').indexOf('panel') !== -1).toBe(true);
        expect(element.attr('class').indexOf('panel-default') !== -1).toBe(true);
        expect(element.attr('class').indexOf('widget') !== -1).toBe(true);
        expect(element.attr('class').indexOf('sample') !== -1).toBe(true);
    });

    it('should render the widget without default classes in frameless mode', function() {
        dashboard.widgets['test'].frameless = true;
        var element = compileTemplate(directive);
        expect(element.attr('class').indexOf('panel') !== -1).toBe(false);
        expect(element.attr('class').indexOf('panel-default') !== -1).toBe(false);
        expect(element.attr('class').indexOf('widget') !== -1).toBe(true);
        expect(element.attr('class').indexOf('sample') !== -1).toBe(true);
    });

  });

});
