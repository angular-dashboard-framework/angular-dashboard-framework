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

describe('adf dashboard service tests', function() {

  var adfDashboardService;

  // Load the myApp module, which contains the directive
  beforeEach(module('adf'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_adfDashboardService_){
    // inject the real service for testing
    adfDashboardService = _adfDashboardService_;
  }));

  describe('create category function tests', function() {

    it('should split categories a and b into different objects', function() {
      var input = {
        '1': { category: 'a', rows: '1'},
        '2': { category: 'a', rows: '2'},
        '3': { category: 'a', rows: '3'},
        '4': { category: 'a', rows: '4'},
        '5': { category: 'a', rows: '5'},
        '6': { category: 'b', rows: '6'}
      };

      var output = {
        'a': {
          widgets: {
            '1': { category: 'a', rows: '1'},
            '2': { category: 'a', rows: '2'},
            '3': { category: 'a', rows: '3'},
            '4': { category: 'a', rows: '4'},
            '5': { category: 'a', rows: '5'}
          }
        },
        'b': {
          widgets: {
            '6': { category: 'b', rows: '6'}
          }
        }
      };

      expect(adfDashboardService.createCategories(input)).toEqual(output);
    });

    it('should group widgets with no category into "Miscellaneous" category', function() {
      var input = {
        '1': { rows: '1'}
      };

      var output = {
        'Miscellaneous': {
          widgets: {
            '1': { rows: '1'}
          }
        }
      };

      expect(adfDashboardService.createCategories(input)).toEqual(output);
    });

  });

  describe('structure related tests', function(){

        var modelTwelve = {
          rows: [{
              columns: [{
                  styleClass: "col-md-12",
                  widgets: []
              }]
          }]
        };

        var modelFourEight = {
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

        var modelThreeNineEtc = {
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

      it('should read the correct number of columns in a structure', function(){
        function readColumns(model) {
          return adfDashboardService._tests._readColumns(model, []).length;
        }

        expect(readColumns(modelTwelve)).toBe(1);
        expect(readColumns(modelFourEight)).toBe(2);
        expect(readColumns(modelThreeNineEtc)).toBe(4);
      });

  });

});
