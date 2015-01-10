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
    .directive('adfDashboardColumn', function ($compile, adfTemplatePath, rowTemplate) {
        'use strict';

        function stringToBoolean(string){
            switch(string !== null ? string.toLowerCase() : null){
                case "true": case "yes": case "1": return true;
                case "false": case "no": case "0": case null: return false;
                default: return Boolean(string);
            }
        }

        return {
            restrict: "E",
            replace: true,
            scope: {
                column: "=",
                editMode: "@",
                sortableOptions: "="
            },
            templateUrl: adfTemplatePath + "dashboard-column.html",
            link: function ($scope, $element, $attr) {
                // pass edit mode
                $attr.$observe('editMode', function (value) {
                    $scope.editMode = stringToBoolean(value);
                });

                if (angular.isDefined($scope.column.rows) && angular.isArray($scope.column.rows)) {
                    // be sure to tell Angular about the injected directive and push the new row directive to the column
                    $compile(rowTemplate)($scope, function (cloned) {
                        $element.append(cloned);
                    });
                }
            }
        };
    });
