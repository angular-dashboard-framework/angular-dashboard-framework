# angular-dashboard-framework

[![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)](https://github.com/angular-dashboard-framework/angular-dashboard-framework/blob/master/LICENSE.md) [![Build Status](https://travis-ci.org/angular-dashboard-framework/angular-dashboard-framework.svg?branch=master)](https://travis-ci.org/angular-dashboard-framework/angular-dashboard-framework) [![Dependency Status](https://www.versioneye.com/user/projects/562008b836d0ab001900070b/badge.svg?style=flat)](https://www.versioneye.com/user/projects/562008b836d0ab001900070b) [![Join the chat at https://gitter.im/sdorra/angular-dashboard-framework](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/angular-dashboard-framework/angular-dashboard-framework?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> Dashboard framework with Angular.js and Twitter Bootstrap.

The api of angular-dashboard-framework (adf) is documented [here](http://angular-dashboard-framework.github.io/angular-dashboard-framework/docs/). A getting
started guide can be found [here](https://github.com/angular-dashboard-framework/angular-dashboard-framework/wiki/Getting-started).
Follow me ([@ssdorra](https://twitter.com/ssdorra)) on twitter for latest updates and news about adf.

## Demo

A live demo of the adf can be viewed [here](http://angular-dashboard-framework.github.io/angular-dashboard-framework/). The demo uses html5 localStorage to store the state of the dashboard. The source of the demo can be found [here](https://github.com/angular-dashboard-framework/angular-dashboard-framework/tree/master/sample).

A more dynamic example can be found [here](https://github.com/angular-dashboard-framework/adf-dynamic-example).

## Build from source

Install bower and grunt:

```bash
npm install -g bower
npm install -g gulp
```

Clone the repository:

```bash
git clone https://github.com/angular-dashboard-framework/angular-dashboard-framework
cd angular-dashboard-framework
```

Install npm and bower dependencies:

```bash
npm install
bower install
```

Checkout git submodule widgets:

```bash
git submodule init
git submodule update
```

You can start the sample dashboard, by using the serve gulp task:

```bash
gulp serve
```

Now you open the sample in your browser at http://localhost:9001/sample

Or you can create a release build of angular-dashboard-framework and the samples:

```bash
gulp all
```
The sample and the final build of angular-dashboard-framework are now in the dist directory.

## Contributing

Please do not commit changes to the dist folder. The dist folder is only generated for releases.


## License

    The MIT License

    Copyright (c) 2015, Sebastian Sdorra

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
