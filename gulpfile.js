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


var gulp = require('gulp');
var connect = require('gulp-connect');
var modRewrite = require('connect-modrewrite');
var $ = require('gulp-load-plugins')();
var del = require('del');
var jsReporter = require('jshint-stylish');
var pkg = require('./package.json');
var karmaServer = require('karma').Server;
var name = pkg.name;

var templateOptions = {
  root: '../src/templates',
  module: 'adf'
};

var annotateOptions = {
  enable: [
    'angular-dashboard-framework'
  ]
};

var minifyHtmlOptions = {
  empty: true,
  loose: true
};

var ngdocOptions = {
  html5Mode: false,
  title: 'ADF API Documentation'
};

var protractorOptions = {
  configFile: 'test/protractor.conf.js'
};

/** lint **/

gulp.task('csslint', function(){
  gulp.src('src/styles/*.css')
      .pipe($.csslint())
      .pipe($.csslint.reporter());
});

gulp.task('jslint', function(){
  gulp.src('src/scripts/*.js')
      .pipe($.jshint())
      .pipe($.jshint.reporter(jsReporter));
});

gulp.task('lint', ['csslint', 'jslint']);

/** clean **/

gulp.task('clean', function(cb){
  del(['dist', '.tmp'], cb);
});

/** build **/

gulp.task('styles', function(){
  gulp.src(['src/styles/**/*.scss'])
      .pipe($.sass({
        precision: 10,
        outputStyle: 'expanded'
      }).on('error', $.sass.logError))
      .pipe($.concat(name + '.css'))
      .pipe(gulp.dest('dist/'))
      .pipe($.rename(name + '.min.css'))
      .pipe($.minifyCss())
      .pipe(gulp.dest('dist/'));
});

gulp.task('js', function(){
  gulp.src(['src/scripts/*.js', 'src/templates/*.html'])
      .pipe($.if('*.html', $.minifyHtml(minifyHtmlOptions)))
      .pipe($.if('*.html', $.angularTemplatecache(name + '.tpl.js', templateOptions)))
      .pipe($.sourcemaps.init())
      .pipe($.if('*.js', $.replace('<<adfVersion>>', pkg.version)))
      .pipe($.if('*.js', $.replace(/'use strict';/g, '')))
      .pipe($.concat(name + '.js'))
      .pipe($.headerfooter('(function(window, undefined) {\'use strict\';\n', '})(window);'))
      .pipe($.ngAnnotate(annotateOptions))
      .pipe(gulp.dest('dist/'))
      .pipe($.rename(name + '.min.js'))
      .pipe($.uglify())
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['styles', 'js']);

/** build docs **/

gulp.task('docs', function(){
  return gulp.src('src/scripts/*.js')
    .pipe($.ngdocs.process(ngdocOptions))
    .pipe(gulp.dest('./dist/docs'));
});

/** build sample **/
gulp.task('install-widgets', function(){
  return gulp.src('sample/widgets/*/bower.json')
             .pipe($.install());
});

gulp.task('widget-templates', ['install-widgets'], function(){
  var opts = {
    root: '{widgetsPath}',
    module: 'sample'
  };
  return gulp.src('sample/widgets/*/src/*.html')
             .pipe($.minifyHtml(minifyHtmlOptions))
             .pipe($.angularTemplatecache('widgets.js', opts))
             .pipe(gulp.dest('.tmp'));
});

gulp.task('sample-templates', function(){
  var opts = {
    root: 'partials',
    module: 'sample'
  };
  return gulp.src('sample/partials/*.html')
             .pipe($.minifyHtml(minifyHtmlOptions))
             .pipe($.angularTemplatecache('samples.js', opts))
             .pipe(gulp.dest('.tmp'));
});

gulp.task('dashboard-templates', function(){
  var opts = {
    root: '../src/templates',
    module: 'adf'
  };
  return gulp.src('src/templates/*.html')
             .pipe($.minifyHtml(minifyHtmlOptions))
             .pipe($.angularTemplatecache('adf.js', opts))
             .pipe(gulp.dest('.tmp'));
});

gulp.task('copy-font', function(){
  gulp.src('sample/components/bootstrap/dist/fonts/*')
      .pipe(gulp.dest('dist/sample/fonts'));
});

gulp.task('sample', ['widget-templates', 'sample-templates', 'dashboard-templates', 'copy-font'], function(){
  var templates = gulp.src('.tmp/*.js', {read: false});
  var assets = $.useref.assets();
  gulp.src('sample/index.html')
      // inject templates
      .pipe($.inject(templates, {relative: true}))
      .pipe(assets)
      .pipe($.if('*.js', $.replace('<<adfVersion>>', pkg.version)))
      .pipe($.if('*.js', $.ngAnnotate(annotateOptions)))
      .pipe($.if('*.js', $.uglify()))
      .pipe($.if('*.css', $.minifyCss()))
      .pipe($.rev())
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.revReplace())
      .pipe(gulp.dest('dist/sample'));
});

/** livereload **/

gulp.task('watch', function(){
  var paths = [
    'src/scripts/*.js',
    'src/styles/*.scss',
    'src/templates/*.html',
    'sample/*.html',
    'sample/scripts/*.js',
    'sample/partials/*.html',
    'sample/widgets/*/*.js',
    'sample/widgets/*/*.css',
    'sample/widgets/*/*.html',
    'sample/widgets/*/src/*.js',
    'sample/widgets/*/src/*.css',
    'sample/widgets/*/src/*.html'
  ];
  gulp.watch(paths).on('change', function(file){
    gulp.src(file.path)
        .pipe(connect.reload());
  });
});

gulp.task('webserver', ['install-widgets'], function(){
  connect.server({
    port: 9001,
    livereload: true,
    // redirect / to /sample
    middleware: function() {
      return [
        modRewrite([
          '^/$ /sample/ [R]'
        ])
      ];
    }
  });
});

gulp.task('serve', ['webserver', 'watch']);

/** unit tests */

gulp.task('test', ['dashboard-templates', 'karma']);

gulp.task('karma', ['dashboard-templates'], function(done) {
    new karmaServer({
        configFile : __dirname +'/test/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('coverall', ['test'], function() {
    return gulp.src('dist/reports/coverage/html/lcov.info')
               .pipe($.coveralls());
});

/** e2e **/

// The protractor task
var protractor = require('gulp-protractor').protractor;

// Start a standalone server
var webdriver_standalone = require('gulp-protractor').webdriver_standalone;

// Download and update the selenium driver
var webdriver_update = require('gulp-protractor').webdriver_update;

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);

// Start the standalone selenium server
// NOTE: This is not needed if you reference the
// seleniumServerJar in your protractor.conf.js
gulp.task('webdriver_standalone', webdriver_standalone);

// start webserver for e2e tests
gulp.task('e2e-server', ['install-widgets'], function(){
  connect.server({
    port: 9003
  });
});

// Setting up the test task
gulp.task('e2e', ['e2e-server', 'webdriver_update'], function(cb) {
  gulp.src('test/e2e/*Spec.js')
      .pipe(protractor(protractorOptions))
      .on('error', function(e) {
        // stop webserver
        connect.serverClose();
        // print test results
        console.log(e);
      })
      .on('end', function(){
        // stop webserver
        connect.serverClose();
        cb();
      });
});

/** travis ci **/

gulp.task('travis', ['jslint', 'test', 'coverall', 'build']);

/** shorthand methods **/
gulp.task('all', ['build', 'docs', 'sample']);

gulp.task('default', ['jslint', 'test', 'build']);
