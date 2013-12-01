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

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dirs: {
      src: 'app/scripts/dashboard',
      dest: 'dist/<%= pkg.name %>/<%= pkg.version %>',
    },
    ngtemplates: {
      dashboard: {
        cwd: 'app',
        src: 'scripts/dashboard/*.html',
        dest: 'build/templates.js',
        options: {
          htmlmin: {
            collapseWhitespace: true, 
            collapseBooleanAttributes: true,
            removeComments: true,
          }
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          '<%= dirs.src %>/provider.js', 
          '<%= dirs.src %>/dashboard.js', 
          '<%= dirs.src %>/sortable.js', 
          '<%= dirs.src %>/widget.js', 
          'build/templates.js'
        ],
        dest: 'build/concat.js',
      },
    },
    ngmin: {
      directives: {
        expand: true,
        cwd: 'build',
        src: 'concat.js',
        dest: 'build/ngmin'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/ngmin/concat.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    cssmin: {
      minify: {
        src: 'app/styles/main.css',
        dest: 'dist/<%= pkg.name %>.min.css',
      }
    }
  });

  // jshint
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // templates
  grunt.loadNpmTasks('grunt-angular-templates');

  // ngmin
  grunt.loadNpmTasks('grunt-ngmin');

  // concat
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // css
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // clean 
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['ngtemplates', 'concat', 'ngmin', 'uglify', 'cssmin']);
};