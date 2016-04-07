angular.module('adf')
    .directive('adfDashboardPreview', function() {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                structure: '=',
            },
            templateUrl: adfTemplatePath +'dashboard-preview.html',
        };
    });