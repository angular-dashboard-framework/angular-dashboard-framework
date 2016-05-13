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

describe('structure preview directive tests', function() {

  var $compile,
      $rootScope,
      $scope,
      directive;

  // Load the myApp module, which contains the directive
  beforeEach(module('adf'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      directive = '<adf-structure-preview name="name" structure="structure" selected="selected" />';

      $scope.name = 'name';
      $scope.structure = {};
      $scope.selected = false;
  }));

  function compileTemplate(template) {
      // Compile a piece of HTML containing the directive
      var el = $compile(template)($scope);
      $scope.$digest();
      return el;
  }

  it('should add style attribute to rows', function() {
    $scope.structure = {
      rows: [{},{}]
    };
    var scope = compileTemplate(directive).isolateScope();

    expect(scope.preview.rows[0].style.height).toBe('50%');
    expect(scope.preview.rows[1].style.height).toBe('50%');
  });

  it('should add style attribute to nested rows', function() {
    $scope.structure = {
      rows: [{
        columns: [{
          rows: [{},{},{},{}]
        }]
      }]
    };
    var scope = compileTemplate(directive).isolateScope();

    expect(scope.preview.rows[0].style.height).toBe('100%');
    var nestedRows = scope.preview.rows[0].columns[0];
    for (var i=0; i<nestedRows.length; i++){
      expect(nestedRows[i]).toBe('25%');
    }
  });

  it('should not fail without rows', function() {
    $scope.structure = {};
    compileTemplate(directive);
  });

});
