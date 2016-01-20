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

module.exports = function(config) {
    config.set({

        // Base path, that will be used to resolve files and exclude
        basePath: '..',

        // Frameworks to use
        frameworks: ['jasmine'],

        // List of files / patterns to load in the browser
        files: [
            'sample/components/jquery/dist/jquery.js',
            'sample/components/es5-shim/es5-shim.js',
            'sample/components/angular/angular.js',
            'sample/components/angular-mocks/angular-mocks.js',
            'sample/components/angular-route/angular-route.js',
            'sample/components/angular-bootstrap/ui-bootstrap.js',
            'sample/components/Sortable/Sortable.js',
            'sample/components/bootstrap/dist/js/bootstrap.js',
            'sample/components/angular-local-storage/dist/angular-local-storage.js',
            'sample/scripts/sample.js',

            'src/**/*.js',
            '.tmp/*.js',
            'test/unit/**/*Spec.js'
        ],

        // List of files to exclude
        exclude: [],

        // Web server port
        port: 9876,

        // Level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        // Which plugins to enable
        plugins: [
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-junit-reporter',
            'karma-coverage',
            'karma-jasmine'
        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        // coverage reporter generates the coverage
        reporters: ['junit', 'progress', 'coverage'],

        // junit report
        junitReporter: {
          // will be resolved to basePath (in the same way as files/exclude patterns)
          outputDir: 'dist/reports/junit'
        },

        preprocessors: {
          // source files, that you wanna generate coverage for
          // do not include tests or libraries
          // (these files will be instrumented by Istanbul)
          'src/**/*.js': ['coverage']
        },

        // optionally, configure the reporter
        coverageReporter: {
          subdir: '.',
          reporters:[{
            type: 'lcov',
            dir:'dist/reports/coverage/html'
          }, {
            type : 'cobertura',
            dir : 'dist/reports/coverage/cobertura/'
          }]
        }
    });
};
