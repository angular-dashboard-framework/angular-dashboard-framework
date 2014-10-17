/*
 * The MIT License
 *
 * Copyright (c) 2013, Sebastian Sdorra
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

 module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    dirs: {
      src: 'src/scripts'
    },
    ngtemplates: {
      adf: {
        src: 'src/templates/*.html',
        dest: '.tmp/ngtemplates/templates.js',
        options: {
          htmlmin: {
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeComments: true
          },
          prefix: '..'
        }
      },
      sample: {
        cwd: 'sample',
        src: ['scripts/widgets/*/*.html', 'partials/*.html'],
        dest: '.tmp/ngtemplates/sample.templates.js',
        options: {
          htmlmin: {
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeComments: true
          }
        }
      }
    },
    concat: {
      default: {
        src: [
          '<%= dirs.src %>/sortable.js',
          '<%= dirs.src %>/provider.js',
          '<%= dirs.src %>/adf.js',
          '<%= dirs.src %>/dashboard.js',
          '<%= dirs.src %>/widget-content.js',
          '<%= dirs.src %>/widget.js',
          '.tmp/ngtemplates/templates.js'
        ],
        dest: '.tmp/concat/adf.js'
      },
      sample: {
        src: ['.tmp/concat/js/sample.min.js', '.tmp/ngtemplates/templates.js', '.tmp/ngtemplates/sample.templates.js'],
        dest: '.tmp/concat/js/complete.min.js'
      }
    },
    'string-replace': {
      dist: {
        files: [{
          src: '.tmp/concat/adf.js',
          dest: '.tmp/concat/adf.js'
        },{
          src: '.tmp/concat/js/complete.min.js',
          dest: '.tmp/concat/js/complete.min.js'
        }],
        options: {
          replacements: [{
            pattern: '<<adfVersion>>',
            replacement: pkg.version
          }]
        }
      }
    },
    ngAnnotate: {
      default: {
        expand: true,
        cwd: '.tmp/concat',
        src: 'adf.js',
        dest: '.tmp/ngmin'
      },
      sample: {
        expand: true,
        cwd: '.tmp/concat/js/',
        src: 'complete.min.js',
        dest: '.tmp/ngmin'
      }
    },
    uglify: {
      default: {
        options: {
          banner: '/*! <%= pkg.name %> <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>) */\n'
        },
        files: {
          'dist/<%= pkg.name %>.min.js': ['.tmp/ngmin/adf.js']
        }
      },
      sample: {
        options: {
          banner: '/*! <%= pkg.name %> <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>) */\n',
          mangle: false
        },
        files: {
          'dist/sample/js/sample.min.js': ['.tmp/ngmin/complete.min.js'],
          'dist/sample/js/jquery.ui.sortable.min.js': ['.tmp/concat/js/jquery.ui.sortable.min.js']
        }
      }
    },
    cssmin: {
      default: {
        files: {
          'dist/<%= pkg.name %>.min.css': ['src/styles/main.css']
        }
      },
      sample: {
        files: {
          'dist/sample/css/sample.min.css': ['.tmp/concat/css/sample.min.css']
        }
      }
    },
    ngdocs: {
      options: {
        title: 'angular-dashboard-framework',
        dest: 'dist/docs',
        html5Mode: false
      },
      api: {
        src: ['src/scripts/*.js'],
        title: 'API Documentation'
      }
    },
    copy: {
      sample: {
        files: [{
          src: 'sample/index.html',
          dest: 'dist/sample/index.html'
        },{
          src: 'sample/components/angular/angular.min.js',
          dest: 'dist/sample/js/angular.min.js'
        },{
          src: 'sample/components/angular-route/angular-route.min.js',
          dest: 'dist/sample/js/angular-route.min.js'
        },{
          src: 'sample/components/jquery/jquery.min.js',
          dest: 'dist/sample/js/jquery.min.js'
        }]
      }
    },
    useminPrepare: {
      html: 'sample/index.html',
      options: {
        dirs: ['dist/sample']
      }
    },
    usemin: {
      html: 'dist/sample/index.html'
    },
    filerev: {
      js: {
        src: ['dist/sample/js/*.js']
      },
      css: {
        src: ['dist/sample/css/*.css']
      }
    },
    jshint: {
      options: {
        globalstrict: true,
        multistr: true,
        globals: {
          angular: true
        }
      },
      files: 'src/scripts/*.js'
    },
    connect: {
      server: {
        options: {
          port: 9001,
          livereload: true
        }
      }
    },
    watch: {
      scripts: {
        files: [
          'src/**/*.js',
          'src/**/*.html',
          'src/**/*.css',
          'sample/index.html',
          'sample/scripts/**/*.js',
          'sample/scripts/**/*.html',
          'sample/scripts/**/*.css'
        ]
      },
      options: {
        livereload: true
      }
    },
    clean: [
      '.tmp', 'dist'
    ]
  });

  // jshint
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // templates
  grunt.loadNpmTasks('grunt-angular-templates');

  // ng-annotate
  grunt.loadNpmTasks('grunt-ng-annotate');

  // concat
  grunt.loadNpmTasks('grunt-contrib-concat');

  // string-replace
  grunt.loadNpmTasks('grunt-string-replace');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // css
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // clean
  grunt.loadNpmTasks('grunt-contrib-clean');

  // ngdoc
  grunt.loadNpmTasks('grunt-ngdocs');

  // copy
  grunt.loadNpmTasks('grunt-contrib-copy');

  // usemin
  grunt.loadNpmTasks('grunt-usemin');

  // filerev
  grunt.loadNpmTasks('grunt-filerev');

  // connect
  grunt.loadNpmTasks('grunt-contrib-connect');

  // watch
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'default-wo-clean']);

  grunt.registerTask('default-wo-clean', [
    'clean',
    'ngtemplates:adf',
    'concat:default',
    'string-replace',
    'ngAnnotate:default',
    'uglify:default',
    'cssmin:default',
    'ngdocs'
  ]);

  // gocs task
  grunt.registerTask('docs', ['clean', 'ngdocs']);
  grunt.registerTask('docs-wo-clean', ['ngdocs']);

  // sample task
  grunt.registerTask('sample', ['clean', 'sample-wo-clean']);

  grunt.registerTask('sample-wo-clean', [
    'useminPrepare',
    'copy:sample',
    'concat:generated',
    'ngtemplates',
    'concat:sample',
    'string-replace',
    'cssmin:sample',
    'ngAnnotate:sample',
    'uglify:sample',
    'filerev',
    'usemin'
  ]);

  // server task
  grunt.registerTask('server', ['connect', 'watch']);

  // all task
  grunt.registerTask('all', ['clean', 'default-wo-clean', 'docs-wo-clean', 'sample-wo-clean']);
};
