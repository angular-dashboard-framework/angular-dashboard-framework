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

describe('adfUtils Service tests', function() {

  var adfUtilsService;

  // Load the myApp module, which contains the directive
  beforeEach(module('adf'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_adfUtilsService_){
    // inject the real service for testing
    adfUtilsService = _adfUtilsService_;
  }));

  it('stringToBoolean function', function() {
    var tests = [
      [ 'true', true ],
      [ 'yes', true ],
      [ '1', true ],
      [ 'TRUE', true ],
      [ 'TruE', true],
      [ 'false', false ],
      [ 'no', false ],
      [ '0', false ],
      [ '', false ],
      [ null, false ],
      [ 'asdasd', true ]
    ];

    for(var i in tests) {
      expect(adfUtilsService.stringToBoolean(tests[i][0])).toBe(tests[i][1]);
    }
  });

  it('split function', function() {
    var input = {
      '1': { rows: '1'},
      '2': { rows: '2'},
      '3': { rows: '3'},
      '4': { rows: '4'},
      '5': { rows: '5'},
      '6': { rows: '6'}
    };

    var output = [
      {'1': { rows: '1'}, '4': { rows: '4'}},
      {'2': { rows: '2'}, '5': { rows: '5'}},
      {'3': { rows: '3'}, '6': { rows: '6'}}
    ];

    expect(adfUtilsService.split(input, 3)).toEqual(output);
  });

});
