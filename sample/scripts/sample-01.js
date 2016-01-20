/* *
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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
'use strict';

angular.module('sample-01', ['adf', 'LocalStorageModule'])
.controller('sample01Ctrl', function($scope, localStorageService){

  var name = 'sample-01';
  var model = localStorageService.get(name);
  if (!model) {
    // set default model for demo purposes
    model = {
      title: "Sample 01",
      structure: "4-8",
      rows: [{
        columns: [{
          styleClass: "col-md-4",
          widgets: [{
            type: "linklist",
            config: {
              links: [{
                title: "SCM-Manager",
                href: "http://www.scm-manager.org"
              }, {
                title: "Github",
                href: "https://github.com"
              }, {
                title: "Bitbucket",
                href: "https://bitbucket.org"
              }, {
                title: "Stackoverflow",
                href: "http://stackoverflow.com"
              }]
            },
            title: "Links"
          }, {
            type: "weather",
            config: {
              location: "Hildesheim"
            },
            title: "Weather Hildesheim"
          }, {
            type: "weather",
            config: {
              location: "Edinburgh"
            },
            title: "Weather"
          }, {
            type: "weather",
            config: {
              location: "Dublin,IE"
            },
            title: "Weather"
          }]
        }, {
          styleClass: "col-md-8",
          widgets: [{
            type: "randommsg",
            config: {},
            title: "Douglas Adams"
          }, {
            type: "markdown",
            config: {
              content: "![scm-manager logo](https://bitbucket.org/sdorra/scm-manager/wiki/resources/scm-manager_logo.jpg)\n\nThe easiest way to share and manage your Git, Mercurial and Subversion repositories over http.\n\n* Very easy installation\n* No need to hack configuration files, SCM-Manager is completely configureable from its Web-Interface\n* No Apache and no database installation is required\n* Central user, group and permission management\n* Out of the box support for Git, Mercurial and Subversion\n* Full RESTFul Web Service API (JSON and XML)\n* Rich User Interface\n* Simple Plugin API\n* Useful plugins available ( f.e. Ldap-, ActiveDirectory-, PAM-Authentication)\n* Licensed under the BSD-License"
            },
            title: "Markdown"
          }]
        }]
      }]
    };
  }
  $scope.name = name;
  $scope.model = model;
  $scope.collapsible = false;
  $scope.maximizable = false;

  $scope.$on('adfDashboardChanged', function (event, name, model) {
    localStorageService.set(name, model);
  });
});
