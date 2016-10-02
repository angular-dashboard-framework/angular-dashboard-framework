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

describe('adfOrderByObjectKey filter test', function() {

  var $filter;

  // Load the myApp module, which contains the directive
  beforeEach(module('adf'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$filter_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $filter = _$filter_;
  }));

  it('should order the object', function() {
    var object = {
      z: {},
      x: {},
      c: {},
      w: {}
    };

    var array = $filter('adfOrderByObjectKey')(object, 'key');
    expect(angular.isArray(array)).toBeTruthy();
    expect(array[0].key).toBe('c');
    expect(array[1].key).toBe('w');
    expect(array[2].key).toBe('x');
    expect(array[3].key).toBe('z');
  });

});
