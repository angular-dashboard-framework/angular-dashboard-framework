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


/* global angular */
angular.module('adf')
  .directive('adfDashboardRow', [($compile, adfTemplatePath, columnTemplate): ng.IDirective => {
        'use strict';
        
    return {
      restrict: 'E',
      replace: true,
      scope: {
        row: '=',
        adfModel: '=',
        editMode: '=',
        options: '='
      },
      templateUrl: adfTemplatePath + 'dashboard-row.html',
      link: function ($scope, $element) {
        if (angular.isDefined($scope.row.columns) && angular.isArray($scope.row.columns)) {
          $compile(columnTemplate)($scope, function(cloned) {
            $element.append(cloned);
          });
        }
      }
    };
  });

class adfDashboardRow {
  public restrict: string;
  public replace : boolean;
  public scope: ng.IScope;
  public templateUrl: string;
  public link: () => void;

  constructor ($scope: ng.IScope, $element: any) {
    this.restrict = 'E';
    this.replace  = true;
    this.scope = {
      row: '=',
      adfModel: '=',
      editMode: '=',
      options: '='
    };
    this.templateUrl = adfTemplatePath + 'dashboard-row.html';
    this.link = function ($scope, $element) {
      if (angular.isDefined($scope.row.columns) && angular.isArray($scope.row.columns)) {
        $compile(columnTemplate)($scope, function(cloned) {
          $element.append(cloned);
        });
      }
    }
  }
}