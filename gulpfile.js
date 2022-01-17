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

var gulp = require("gulp");
var connect = require("gulp-connect");
var modRewrite = require("connect-modrewrite");
var $ = require("gulp-load-plugins")();
var del = require("del");
var jsReporter = require("jshint-stylish");
var pkg = require("./package.json");
var name = pkg.name;

var templateOptions = {
  root: "../src/templates",
  module: "adf",
};

var annotateOptions = {
  enable: ["angular-dashboard-framework"],
};

var minifyHtmlOptions = {
  empty: true,
  loose: true,
};

var ngdocOptions = {
  html5Mode: false,
  title: "ADF API Documentation",
};

/** clean **/

gulp.task("clean", function (cb) {
  del(["dist", ".tmp"], cb);
});

/** build **/

gulp.task("styles", function () {
  gulp
    .src(["src/styles/**/*.scss"])
    .pipe(
      $.sass({
        precision: 10,
        outputStyle: "expanded",
      }).on("error", $.sass.logError)
    )
    .pipe($.concat(name + ".css"))
    .pipe(gulp.dest("dist/"))
    .pipe($.rename(name + ".min.css"))
    .pipe($.minifyCss())
    .pipe(gulp.dest("src/styles"))
    .pipe(gulp.dest("dist/"));
});

gulp.task("js", function () {
  gulp
    .src(["src/scripts/*.js", "src/templates/*.html"])
    .pipe($.if("*.html", $.minifyHtml(minifyHtmlOptions)))
    .pipe(
      $.if("*.html", $.angularTemplatecache(name + ".tpl.js", templateOptions))
    )
    .pipe($.sourcemaps.init())
    .pipe($.if("*.js", $.replace("<<adfVersion>>", pkg.version)))
    .pipe($.if("*.js", $.replace(/'use strict';/g, "")))
    .pipe($.concat(name + ".js"))
    .pipe(
      $.headerfooter(
        "(function(window, undefined) {'use strict';\n",
        "})(window);"
      )
    )
    .pipe($.ngAnnotate(annotateOptions))
    .pipe(gulp.dest("dist/"))
    .pipe($.rename(name + ".min.js"))
    .pipe($.uglify())
    .pipe($.sourcemaps.write("."))
    .pipe(gulp.dest("dist/"));
});

gulp.task("build", ["styles", "js"]);

/** build docs **/

gulp.task("docs", function () {
  return gulp
    .src("src/scripts/*.js")
    .pipe($.ngdocs.process(ngdocOptions))
    .pipe(gulp.dest("./dist/docs"));
});

/** build sample **/
gulp.task("install-widgets", function () {
  return gulp.src("sample/widgets/*/bower.json").pipe($.install());
});

gulp.task("widget-templates", ["install-widgets"], function () {
  var opts = {
    root: "{widgetsPath}",
    module: "sample",
  };
  return gulp
    .src("sample/widgets/*/src/*.html")
    .pipe($.minifyHtml(minifyHtmlOptions))
    .pipe($.angularTemplatecache("widgets.js", opts))
    .pipe(gulp.dest(".tmp"));
});

gulp.task("sample-templates", function () {
  var opts = {
    root: "partials",
    module: "sample",
  };
  return gulp
    .src("sample/partials/*.html")
    .pipe($.minifyHtml(minifyHtmlOptions))
    .pipe($.angularTemplatecache("samples.js", opts))
    .pipe(gulp.dest(".tmp"));
});

gulp.task("dashboard-templates", function () {
  var opts = {
    root: "../src/templates",
    module: "adf",
  };
  return gulp
    .src("src/templates/*.html")
    .pipe($.minifyHtml(minifyHtmlOptions))
    .pipe($.angularTemplatecache("adf.js", opts))
    .pipe(gulp.dest(".tmp"));
});

gulp.task("copy-font", function () {
  gulp
    .src("sample/components/components-font-awesome/fonts/*")
    .pipe(gulp.dest("dist/sample/fonts"));
});

gulp.task(
  "sample",
  ["widget-templates", "sample-templates", "dashboard-templates", "copy-font"],
  function () {
    var templates = gulp.src(".tmp/*.js", { read: false });
    var assets = $.useref.assets();
    gulp
      .src("sample/index.html")
      // inject templates
      .pipe($.inject(templates, { relative: true }))
      .pipe(assets)
      .pipe($.if("*.js", $.replace("<<adfVersion>>", pkg.version)))
      .pipe($.if("*.js", $.ngAnnotate(annotateOptions)))
      .pipe($.if("*.js", $.uglify()))
      .pipe($.if("*.css", $.minifyCss()))
      .pipe($.rev())
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.revReplace())
      .pipe(gulp.dest("dist/sample"));
  }
);

/** livereload **/

gulp.task("reload", function () {
  gulp.src("sample/*.html").pipe(connect.reload());
});

gulp.task("watch-styles", function () {
  gulp.watch("src/styles/*.scss", ["styles", "reload"]);
});

gulp.task("watch", ["watch-styles"], function () {
  var paths = [
    "src/scripts/*.js",
    "src/styles/*.css",
    "src/templates/*.html",
    "sample/*.html",
    "sample/scripts/*.js",
    "sample/partials/*.html",
    "sample/widgets/*/*.js",
    "sample/widgets/*/*.css",
    "sample/widgets/*/*.html",
    "sample/widgets/*/src/*.js",
    "sample/widgets/*/src/*.css",
    "sample/widgets/*/src/*.html",
  ];
  gulp.watch(paths, ["reload"]);
});

gulp.task("webserver", ["install-widgets"], function () {
  connect.server({
    port: 9001,
    livereload: true,
    // redirect / to /sample
    middleware: function () {
      return [modRewrite(["^/$ /sample/ [R]"])];
    },
  });
});

gulp.task("serve", ["webserver", "styles", "watch"]);

/** shorthand methods **/
gulp.task("all", ["build", "docs", "sample"]);

gulp.task("default", ["build"]);
