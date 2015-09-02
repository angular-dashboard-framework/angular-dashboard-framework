module.exports = function(config) {
    config.set({

        // Base path, that will be used to resolve files and exclude
        basePath: '',

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

            'dist/angular-dashboard-framework.js',
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
            'karma-jasmine'
        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
