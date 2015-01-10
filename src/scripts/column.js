/* global angular */
angular.module('adf')
    .directive('adfDashboardColumn', function ($compile, adfTemplatePath, rowTemplate) {
        'use strict';

        function stringToBoolean(string){
            switch(string != null ? string.toLowerCase() : null){
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
        }
    });
