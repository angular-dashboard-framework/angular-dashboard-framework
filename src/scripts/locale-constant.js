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

'use strict';

/**
* @ngdoc object
* @name adf.locale#adfLocale
* @description
*
* Holds settings and values for framework supported locales
*/
angular.module('adf.locale')
.constant('adfLocale',
  {
    defaultLocale: 'en-GB',
    frameworkLocales: {
      'en-GB': {
        ADF_COMMON_CLOSE: 'Close',
        ADF_COMMON_DELETE: 'Delete',
        ADF_COMMON_TITLE: 'Title',
        ADF_COMMON_CANCEL: 'Cancel',
        ADF_COMMON_APPLY: 'Apply',
        ADF_COMMON_EDIT_DASHBOARD: 'Edit dashboard',
        ADF_EDIT_DASHBOARD_STRUCTURE_LABEL: 'Structure',
        ADF_DASHBOARD_TITLE_TOOLTIP_ADD: 'Add new widget',
        ADF_DASHBOARD_TITLE_TOOLTIP_SAVE: 'Save changes',
        ADF_DASHBOARD_TITLE_TOOLTIP_EDIT_MODE: 'Enable edit mode',
        ADF_DASHBOARD_TITLE_TOOLTIP_UNDO: 'Undo changes',
        ADF_WIDGET_ADD_HEADER: 'Add new widget',
        ADF_WIDGET_DELETE_CONFIRM_MESSAGE: 'Are you sure you want to delete this widget ?',
        ADF_WIDGET_TOOLTIP_REFRESH: 'Reload widget Content',
        ADF_WIDGET_TOOLTIP_MOVE: 'Change widget location',
        ADF_WIDGET_TOOLTIP_COLLAPSE: 'Collapse widget',
        ADF_WIDGET_TOOLTIP_EXPAND: 'Expand widget',
        ADF_WIDGET_TOOLTIP_EDIT: 'Edit widget configuration',
        ADF_WIDGET_TOOLTIP_FULLSCREEN: 'Fullscreen widget',
        ADF_WIDGET_TOOLTIP_REMOVE: 'Remove widget'
      },
      'sv-SE': {
        ADF_COMMON_CLOSE: 'Stäng',
        ADF_COMMON_DELETE: 'Ta bort',
        ADF_COMMON_TITLE: 'Titel',
        ADF_COMMON_CANCEL: 'Avbryt',
        ADF_COMMON_APPLY: 'Använd',
        ADF_COMMON_EDIT_DASHBOARD: 'Redigera dashboard',
        ADF_EDIT_DASHBOARD_STRUCTURE_LABEL: 'Struktur',
        ADF_DASHBOARD_TITLE_TOOLTIP_ADD: 'Lägg till ny widget',
        ADF_DASHBOARD_TITLE_TOOLTIP_SAVE: 'Spara förändringar',
        ADF_DASHBOARD_TITLE_TOOLTIP_EDIT_MODE: 'Slå på redigeringsläge',
        ADF_DASHBOARD_TITLE_TOOLTIP_UNDO: 'Ångra förändringar',
        ADF_WIDGET_ADD_HEADER: 'Lägg till ny widget',
        ADF_WIDGET_DELETE_CONFIRM_MESSAGE: 'Är du säker på att du vill ta bort denna widget ?',
        ADF_WIDGET_TOOLTIP_REFRESH: 'Ladda om widget',
        ADF_WIDGET_TOOLTIP_MOVE: 'Ändra widgets position',
        ADF_WIDGET_TOOLTIP_COLLAPSE: 'Stäng widget',
        ADF_WIDGET_TOOLTIP_EXPAND: 'Öppna widget',
        ADF_WIDGET_TOOLTIP_EDIT: 'Ändra widget konfigurering',
        ADF_WIDGET_TOOLTIP_FULLSCREEN: 'Visa widget i fullskärm',
        ADF_WIDGET_TOOLTIP_REMOVE: 'Ta bort widget'
      }
    }
  }
);
