/* *
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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
'use strict';

angular.module('structures', ['adf'])
.config(function(dashboardProvider){

  dashboardProvider
    .structure('6-6', {
      rows: [{
        columns: [{
          styleClass: 'col-md-6'
        }, {
          styleClass: 'col-md-6'
        }]
      }]
    })
    .structure('4-8', {
      rows: [{
        columns: [{
          styleClass: 'col-md-4',
          widgets: []
        }, {
          styleClass: 'col-md-8',
          widgets: []
        }]
      }]
    })
    .structure('12/4-4-4', {
      rows: [{
        columns: [{
          styleClass: 'col-md-12'
        }]
      }, {
        columns: [{
          styleClass: 'col-md-4'
        }, {
          styleClass: 'col-md-4'
        }, {
          styleClass: 'col-md-4'
        }]
      }]
    })
    .structure('12/6-6', {
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
    })
    .structure('12/6-6/12', {
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
      }, {
        columns: [{
          styleClass: 'col-md-12'
        }]
      }]
    })
    .structure('3-9 (6-6/12)', {
      rows: [{
        columns: [{
          styleClass: "col-md-3"
        }, {
          styleClass: "col-md-9",
          rows: [{
            columns: [{
              styleClass: "col-md-6"
            }, {
              styleClass: "col-md-6"
            }]
          }, {
            columns: [{
              styleClass: "col-md-12"
            }]
          }]
        }]
      }]
    });

});
