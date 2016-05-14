/**
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

angular.module('sample-02', ['adf', 'LocalStorageModule'])
.controller('sample02Ctrl', function($scope, localStorageService) {
  var name = 'sample-02';
  var model = localStorageService.get(name);
  if (!model) {
    // set default model for demo purposes

    model = {
      title: "Sample 02",
      structure: "6-6",
      rows: [{
        columns: [{
          styleClass: "col-md-6",
          widgets: [{
            fullScreen: false,
            modalSize: 'lg',
            type: "markdown",
            config: {
              content: "# angular-dashboard-framework\n\n> Dashboard framework with Angular.js and Twitter Bootstrap.\n\nThe api of angular-dashboard-framework (adf) is documented [here](http://angular-dashboard-framework.github.io/angular-dashboard-framework/docs/). A getting\nstarted guide can be found [here](https://github.com/angular-dashboard-framework/angular-dashboard-framework/wiki/Getting-started).\nFollow me ([@ssdorra](https://twitter.com/ssdorra)) on twitter for latest updates and news about adf.\n\n## Demo\n\nA live demo of the adf can be viewed [here](http://angular-dashboard-framework.github.io/angular-dashboard-framework/). The demo uses html5 localStorage to store the state of the dashboard. The source of the demo can be found [here](https://github.com/angular-dashboard-framework/angular-dashboard-framework/tree/master/sample).\n\nA more dynamic example can be found [here](https://github.com/angular-dashboard-framework/adf-dynamic-example).\n\n## Build from source\n\nInstall bower and gulp:\n\n```bash\nnpm install -g bower\nnpm install -g gulp\n```\n\nClone the repository:\n\n```bash\ngit clone https://github.com/angular-dashboard-framework/angular-dashboard-framework\ncd angular-dashboard-framework\n```\n\nInstall npm and bower dependencies:\n\n```bash\nnpm install\nbower install\n```\n\nCheckout git submodule widgets:\n\n```bash\ngit submodule init\ngit submodule update\n```\n\nYou can start the sample dashboard, by using the serve gulp task:\n\n```bash\ngulp serve\n```\n\nNow you open the sample in your browser at http://localhost:9001/sample\n\nOr you can create a release build of angular-dashboard-framework and the samples:\n\n```bash\ngulp all\n```\nThe sample and the final build of angular-dashboard-framework are now in the dist directory."
            },
            title: "Markdown"
          }]
        }, {
          styleClass: "col-md-6",
          widgets: [{
            fullScreen: false,
            modalSize: 'sm',
            type: "githubAuthor",
            config: {
              path: "angular/angular.js"
            },
            title: "Github Author"
          }, {
            fullScreen: true,
            //modalSize: 'lg',
            type: "githubHistory",
            config: {
              path: "angular-dashboard-framework/angular-dashboard-framework"
            },
            title: "Github History"
          }]
        }]
      }]
    };
  }
  $scope.name = name;
  $scope.model = model;
  $scope.collapsible = true;
  $scope.maximizable = true;
  $scope.categories = false;

  $scope.$on('adfDashboardChanged', function(event, name, model) {
    localStorageService.set(name, model);
  });
});
