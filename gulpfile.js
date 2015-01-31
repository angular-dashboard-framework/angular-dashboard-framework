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
var $ = require('gulp-load-plugins')();
var del = require('del');
var jsReporter = require('jshint-stylish');
var pkg = require('./package.json');
var name = pkg.name;

var templateOptions = {
  root: '../src/templates',
  module: 'adf'
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

gulp.task('css', function(){
  gulp.src('src/styles/*.css')
      .pipe($.concat(name + '.min.css'))
      .pipe($.minifyCss())
      .pipe(gulp.dest('dist/'));
});

gulp.task('js', function(){
  gulp.src(['src/scripts/*.js', 'src/templates/*.html'])
      .pipe($.if('*.html', $.minifyHtml()))
      .pipe($.if('*.html', $.angularTemplatecache(name + '.tpl.js', templateOptions)))
      .pipe($.if('*.js', $.replace('<<adfVersion>>', pkg.version)))
      .pipe($.ngAnnotate())
      .pipe($.concat(name + '.min.js'))
      .pipe($.uglify())
      .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['css', 'js']);

/** build docs **/

gulp.task('docs', function(){
  return gulp.src('src/scripts/*.js')
    .pipe($.ngdocs.process({}))
    .pipe(gulp.dest('./dist/docs'));
});

/** build sample **/
gulp.task('install-widgets', function(){
  return gulp.src(['sample/widgets/*/package.json', 'sample/widgets/*/bower.json'])
             .pipe($.install());
});

gulp.task('new-widget-templates', ['install-widgets'], function(){
  var opts = {
    root: '{widgetsPath}',
    module: 'sample'
  };
  return gulp.src('sample/widgets/*/src/*.html')
             .pipe($.minifyHtml())
             .pipe($.angularTemplatecache('new-widgets.js', opts))
             .pipe(gulp.dest('.tmp'));
});

gulp.task('widget-templates', ['new-widget-templates'], function(){
  var opts = {
    root: 'widgets',
    module: 'sample'
  };
  return gulp.src('sample/widgets/*/*.html')
             .pipe($.minifyHtml())
             .pipe($.angularTemplatecache('widgets.js', opts))
             .pipe(gulp.dest('.tmp'));
});

gulp.task('sample-templates', function(){
  var opts = {
    root: 'partials',
    module: 'sample'
  };
  return gulp.src('sample/partials/*.html')
             .pipe($.minifyHtml())
             .pipe($.angularTemplatecache('samples.js', opts))
             .pipe(gulp.dest('.tmp'));
});

gulp.task('dashboard-templates', function(){
  var opts = {
    root: '../src/templates',
    module: 'adf'
  };
  return gulp.src('src/templates/*.html')
             .pipe($.minifyHtml())
             .pipe($.angularTemplatecache('adf.js', opts))
             .pipe(gulp.dest('.tmp'));
});

gulp.task('sample', ['widget-templates', 'sample-templates', 'dashboard-templates'], function(){
  var templates = gulp.src('.tmp/*.js', {read: false});
  var assets = $.useref.assets();
  gulp.src('sample/index.html')
      // inject templates
      .pipe($.inject(templates, {relative: true}))
      .pipe(assets)
      .pipe($.if('*.js', $.replace('<<adfVersion>>', pkg.version)))
      // https://github.com/olov/ng-annotate/issues/133
      //.pipe($.if('*.js', $.ngAnnotate()))
      //.pipe($.if('*.js', $.uglify()))
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
    'src/styles/*.css',
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
    livereload: true
  });
});

gulp.task('serve', ['webserver', 'watch']);

/** shorthand methods **/
gulp.task('all', ['build', 'docs', 'sample']);

gulp.task('default', ['build']);
