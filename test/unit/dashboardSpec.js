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
        directive;

    // Load the myApp module, which contains the directive
    beforeEach(module('adf'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$compile_, _$rootScope_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        directive = '<adf-dashboard name="{{name}}" collapsible="{{collapsible}}" maximizable="{{maximizable}}" continuous-edit-mode="continuousEditMode" structure="4-8" adf-model="model" />';


        $scope.name = 'sample-01';
        $scope.model = {
            title: "Sample 01",
            structure: "4-8",
            rows: [{
                columns: [{
                    styleClass: "col-md-4",
                    widgets: []
                }]
            }]
        };
        $scope.collapsible = false;
        $scope.maximizable = false;
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

});
