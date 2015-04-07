# 0.8.0

## Enhancements

- reimplement drag and drop with [Sortable](https://github.com/RubaXa/Sortable) instead of [ui-sortable](https://github.com/angular-ui/ui-sortable).
- remove [jQuery](http://jquery.com/) and [jQuery-UI](http://jqueryui.com/) dependency

## Bug fixes

- fix initialization without model attribute, to fix issue [#73](https://github.com/sdorra/angular-dashboard-framework/issues/73)

## Build

- move widgets and structures to separate repositories and use it with git submodules
- use gulp instead of grunt
- build sourcemap of minified files

# 0.7.0

## Enhancements

- added editable option to disable the edit mode, see [#68](https://github.com/sdorra/angular-dashboard-framework/issues/68)

## Bug fixes

- fix collapsible option

# 0.6.1

## Bug fixes

- fix missing undo button

# 0.6.0

## Enhancements

- switch from Font Awesome to Bootstrap glyphicons, see [#56](https://github.com/sdorra/angular-dashboard-framework/issues/56)
- added widgetPaths option to replace {widgetsPath} in the templateUrl of widgets

## Bug fixes

- added missing css to bower main section
- fixed a scope leak [#55](https://github.com/sdorra/angular-dashboard-framework/issues/55)

# 0.5.1

## Bug fixes

- fix missing files in minified version

# 0.5.0

## New features

- support for nested rows [#52](https://github.com/sdorra/angular-dashboard-framework/pull/52)
- watch dashboard model for changed [#45](https://github.com/sdorra/angular-dashboard-framework/pull/45)

# 0.4.0

## New features

- remove copy of ui-sortable and use official bower component to fix, see [#37](https://github.com/sdorra/angular-dashboard-framework/issues/37)

## Bug fixes

- support for angular.js 1.3, see [#42](https://github.com/sdorra/angular-dashboard-framework/issues/42)

# 0.3.2

## Bug fixes

- Changing dashboard structure copies widgets from previous changed dashboard structure, see [#35](https://github.com/sdorra/angular-dashboard-framework/issues/35)

# 0.3.1

## Bug fixes

- fix bug with the collapsible attribute of the dashboard directive

# 0.3.0

## New features

- support for controllerAs syntax
- added inject value for template path
- added adfVersion inject value

## Bug fixes

- fixed displaying control btns outside the panel title, when title is long ([#30](https://github.com/sdorra/angular-dashboard-framework/pull/30))

# 0.2.0

## New features

- ability to reset dashboard to original view
- support for filtering widgets

# 0.1.0

- initial release
