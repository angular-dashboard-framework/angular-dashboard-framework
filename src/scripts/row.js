/* global angular */
angular.module("adf")
    .directive("adfDashboardRow", function ($compile, adfTemplatePath, columnTemplate) {
        'use strict';

        function stringToBoolean(string) {
            switch (string !== null ? string.toLowerCase() : null) {
                case "true": case "yes": case "1": return true;
                case "false": case "no": case "0": case null: return false;
                default: return Boolean(string);
            }
        }
        return {
            restrict: "E",
            replace: true,
            scope: {
                row: "=",
                editMode: "@",
                sortableOptions: "="
            },
            templateUrl: adfTemplatePath + "dashboard-row.html",
            link: function ($scope, $element, $attr) {
                // pass edit mode
                $attr.$observe('editMode', function (value) {
                    $scope.editMode = stringToBoolean(value);
                });

                if (angular.isDefined($scope.row.columns) && angular.isArray($scope.row.columns)) {
                    $compile(columnTemplate)($scope, function (cloned) {
                        $element.append(cloned);
                    });
                }
            }
        };
    });
