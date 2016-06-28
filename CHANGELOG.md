# 0.12.0

## Enhancements
* build separate script files without templates [#203](https://github.com/angular-dashboard-framework/angular-dashboard-framework/issue/203)
* added a structure preview to dashboard edit dialog
* added seperate widgetService to handle template resolving outside of the directive
* added optional categories for the widget add dialog
* order widgets in widget add dialog
* implemented resolveAs to pass resolve map to widget scope. This change should make passing only controllers superfluous.
* added support for custom widget template [247](https://github.com/angular-dashboard-framework/angular-dashboard-framework/pull/247)
* added support for custom widget edit template [#224](https://github.com/angular-dashboard-framework/angular-dashboard-framework/pull/224)
* option enableConfirmDelete is now configurable via attribute to adf-dashboard [#248](https://github.com/angular-dashboard-framework/angular-dashboard-framework/pull/248)
* added multi-language support [#249](https://github.com/angular-dashboard-framework/angular-dashboard-framework/pull/249)

## Bug fixes
* fix edit mode for widgets without edit section [#211](https://github.com/angular-dashboard-framework/angular-dashboard-framework/issue/211)
* display error message, if a widget type could not be resolved [#216](https://github.com/angular-dashboard-framework/angular-dashboard-framework/issue/216)


# 0.11.0

## Enhancements

* enable form validation for widget edit dialog
* custom apply function for edit dialog [#152](https://github.com/angular-dashboard-framework/angular-dashboard-framework/issues/152)
* add event to toggle editMode
* adding styleClass to widget definition to bind custom css styles [#171](https://github.com/angular-dashboard-framework/angular-dashboard-framework/pull/171)
* broadcast when dashboard is in edit mode [#168](https://github.com/angular-dashboard-framework/angular-dashboard-framework/pull/168)
* added support for SCSS syntax in styles [#167](https://github.com/angular-dashboard-framework/angular-dashboard-framework/pull/167)
* custom add edit templates [#120](https://github.com/angular-dashboard-framework/angular-dashboard-framework/pull/120)
* added unit test support for angular-dashboard-framework [#137](https://github.com/angular-dashboard-framework/angular-dashboard-framework/pull/137)
* support for frameless widgets [#134](https://github.com/angular-dashboard-framework/angular-dashboard-framework/pull/134)

## Bug fixes

* fix incompatibility with angular 1.2 and 1.3, see issue [#187](https://github.com/angular-dashboard-framework/angular-dashboard-framework/issues/187)
* check for sortable element before destroy, fix issue #118
* added immediate option to widget config, to fix issue #155
* fix typo rename event adfDashboardCollapseExapand to adfDashboardCollapseExpand, to fix issue #141
* edit widget cancel shouldn't cause the 'widgetConfigChanged' event [#140](https://github.com/angular-dashboard-framework/angular-dashboard-framework/pull/140)
* added missing documentation for controllerAs of widget edit mode
* fix for widget title being overwritten [#139](https://github.com/angular-dashboard-framework/angular-dashboard-framework/pull/139)


# 0.10.0

## Enhancements

* update Sortable to version 1.2.1
* update bootstrap to version 3.3.5
* use angular dependency >=1.2 instead of 1.2.28
* Ok-cancel prompt for edit widget [#127](https://github.com/sdorra/angular-dashboard-framework/pull/127)
* Added enableConfirmDelete option for prompt before widget delete [#128](https://github.com/sdorra/angular-dashboard-framework/pull/128)
* Collapse and expand all widgets [#121](https://github.com/sdorra/angular-dashboard-framework/pull/121)
* Add adf-widget-type attribute to panel div [#117](https://github.com/sdorra/angular-dashboard-framework/pull/117)
* Added the ability to customize the dashboard and widget title templates [#116](https://github.com/sdorra/angular-dashboard-framework/pull/116)
* Added adfDashboardEditsCancelled broadcast message to cancelEditMode() [#114](https://github.com/sdorra/angular-dashboard-framework/pull/114)

## Bug fixes

* Fixed error when moving widget to empty column [#119](https://github.com/sdorra/angular-dashboard-framework/pull/119)

# 0.9.0

## Enhancements

* support for maximize/minimize option, see [#87](https://github.com/sdorra/angular-dashboard-framework/pull/87)
* rap the JavaScript code in an IIFE, see [#94](https://github.com/sdorra/angular-dashboard-framework/pull/94)
* pass model as parameter for widget filter, see [#85](https://github.com/sdorra/angular-dashboard-framework/issues/85)
* pass maximizable and collapsible as options object, to simplify creation of new attributes, see [#101](https://github.com/sdorra/angular-dashboard-framework/issues/101) and [#100](https://github.com/sdorra/angular-dashboard-framework/issues/100).

## Bug fixes

* remove the unused dev dependency json3, see [#92](https://github.com/sdorra/angular-dashboard-framework/pull/92)
* use backdrop static in $modal options, see [#90](https://github.com/sdorra/angular-dashboard-framework/pull/90)
* implement more robust method to add new widgets to the model, see [#81](https://github.com/sdorra/angular-dashboard-framework/issues/81)
* use ng-annotate to annotate unminified version, see issue [#84](https://github.com/sdorra/angular-dashboard-framework/issues/84) and [#82](https://github.com/sdorra/angular-dashboard-framework/issues/82)
* use .adf-move as handle for sortable to fix issue [#80](https://github.com/sdorra/angular-dashboard-framework/issues/80)

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
