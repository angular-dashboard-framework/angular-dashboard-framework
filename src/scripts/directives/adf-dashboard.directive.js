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

/**
 * @ngdoc directive
 * @name adf.directive:adfDashboard
 * @element div
 * @restrict EA
 * @scope
 * @description
 *
 * `adfDashboard` is a directive which renders the dashboard with all its
 * components. The directive requires a name attribute. The name of the
 * dashboard can be used to store the model.
 *
 * @param {string} name name of the dashboard. This attribute is required.
 * @param {boolean=} editable false to disable the editmode of the dashboard.
 * @param {boolean=} collapsible true to make widgets collapsible on the dashboard.
 * @param {boolean=} maximizable true to add a button for open widgets in a large modal panel.
 * @param {boolean=} enableConfirmDelete true to ask before remove an widget from the dashboard.
 * @param {string=} structure the default structure of the dashboard.
 * @param {object=} adfModel model object of the dashboard.
 * @param {function=} adfWidgetFilter function to filter widgets on the add dialog.
 * @param {boolean=} continuousEditMode enable continuous edit mode, to fire add/change/remove
 *                   events during edit mode not reset it if edit mode is exited.
 * @param {boolean=} categories enable categories for the add widget dialog.
 */

angular.module('adf')
  .directive('adfDashboard', function ($rootScope, $log, $timeout, $uibModal, dashboard, adfTemplatePath, adfDashboardService, adfUtilsService) {
    'use strict';

    return {
      replace: true,
      restrict: 'EA',
      transclude : false,
      scope: {
        structure: '@',
        name: '@',
        collapsible: '@',
        editable: '@',
        editMode: '@',
        continuousEditMode: '=',
        maximizable: '@',
        adfModel: '=',
        adfWidgetFilter: '=',
        categories: '@'
      },
      controller: controller,
      link: link,
      templateUrl: adfTemplatePath + 'dashboard.html'
    };

    /**
     * Opens the edit mode of the specified widget.
     *
     * @param dashboard scope
     * @param widget
     */
    function _openEditMode($scope, widget){
      // wait some time before fire enter edit mode event
      $timeout(function(){
        $scope.$broadcast('adfWidgetEnterEditMode', widget);
      }, 200);
    }

    /**
     * Directive controller function.
     *
     * @param dashboard scope
     */
    function controller($scope){
      var model = {};
      var structure = {};
      var widgetFilter = null;
      var structureName = {};
      var name = $scope.name;

      // Watching for changes on adfModel
      $scope.$watch('adfModel', function(oldVal, newVal) {
       // has model changed or is the model attribute not set
       if (newVal !== null || (oldVal === null && newVal === null)) {
         model = $scope.adfModel;
         widgetFilter = $scope.adfWidgetFilter;
         if ( ! model || ! model.rows ){
           structureName = $scope.structure;
           structure = dashboard.structures[structureName];
           if (structure){
             if (model){
               model.rows = angular.copy(structure).rows;
             } else {
               model = angular.copy(structure);
             }
             model.structure = structureName;
           } else {
             $log.error( 'could not find structure ' + structureName);
           }
         }

         if (model) {
           if (!model.title){
             model.title = 'Dashboard';
           }
           if (!model.titleTemplateUrl) {
             model.titleTemplateUrl = adfTemplatePath + 'dashboard-title.html';
           }
           $scope.model = model;
         } else {
           $log.error('could not find or create model');
         }
       }
      }, true);

      // edit mode
      $scope.editMode = false;
      $scope.editClass = '';

      //passs translate function from dashboard so we can translate labels inside html templates
      $scope.translate = dashboard.translate;

      function getNewModalScope() {
       var scope = $scope.$new();
       //pass translate function to the new scope so we can translate the labels inside the modal dialog
       scope.translate = dashboard.translate;
       return scope;
      }

      $scope.toggleEditMode = function(){
       $scope.editMode = ! $scope.editMode;
       if ($scope.editMode){
         if (!$scope.continuousEditMode) {
           $scope.modelCopy = angular.copy($scope.adfModel, {});
           $rootScope.$broadcast('adfIsEditMode');
         }
       }

       if (!$scope.editMode){
         $rootScope.$broadcast('adfDashboardChanged', name, model);
       }
      };

      $scope.$on('adfToggleEditMode', function() {
         $scope.toggleEditMode();
      });

      $scope.collapseAll = function(collapseExpandStatus){
       $rootScope.$broadcast('adfDashboardCollapseExpand',{collapseExpandStatus : collapseExpandStatus});
      };

      $scope.cancelEditMode = function(){
       $scope.editMode = false;
       if (!$scope.continuousEditMode) {
         $scope.modelCopy = angular.copy($scope.modelCopy, $scope.adfModel);
       }
       $rootScope.$broadcast('adfDashboardEditsCancelled');
      };

      // edit dashboard settings
      $scope.editDashboardDialog = function(){
       var editDashboardScope = getNewModalScope();
       // create a copy of the title, to avoid changing the title to
       // "dashboard" if the field is empty
       editDashboardScope.copy = {
         title: model.title
       };

       // pass dashboard structure to scope
       editDashboardScope.structures = dashboard.structures;

       // pass split function to scope, to be able to display structures in multiple columns
       editDashboardScope.split = adfUtilsService.split;

       var adfEditTemplatePath = adfTemplatePath + 'dashboard-edit.html';
       if(model.editTemplateUrl) {
         adfEditTemplatePath = model.editTemplateUrl;
       }
       var instance = $uibModal.open({
         scope: editDashboardScope,
         templateUrl: adfEditTemplatePath,
         backdrop: 'static',
         size: 'lg'
       });
       editDashboardScope.changeStructure = function(name, structure){
         $log.info('change structure to ' + name);
         adfDashboardService.changeStructure(model, structure);
         if (model.structure !== name){
           model.structure = name;
         }
       };
       editDashboardScope.closeDialog = function(){
         // copy the new title back to the model
         model.title = editDashboardScope.copy.title;
         // close modal and destroy the scope
         instance.close();
         editDashboardScope.$destroy();
       };
      };

      // add widget dialog
      $scope.addWidgetDialog = function(){
       var addScope = getNewModalScope();
       var model = $scope.model;
       var widgets;
       if (angular.isFunction(widgetFilter)){
         widgets = {};
         angular.forEach(dashboard.widgets, function(widget, type){
           if (widgetFilter(widget, type, model)){
             widgets[type] = widget;
           }
         });
       } else {
         widgets = dashboard.widgets;
       }
       addScope.widgets = widgets;

       //pass translate function to the new scope so we can translate the labels inside the modal dialog
       addScope.translate = $scope.translate;

       // pass createCategories function to scope, if categories option is enabled
       if ($scope.options.categories){
         $scope.createCategories = adfDashboardService.createCategories;
       }

       var adfAddTemplatePath = adfTemplatePath + 'widget-add.html';
       if(model.addTemplateUrl) {
         adfAddTemplatePath = model.addTemplateUrl;
       }

       var opts = {
         scope: addScope,
         templateUrl: adfAddTemplatePath,
         backdrop: 'static'
       };

       var instance = $uibModal.open(opts);
       addScope.addWidget = function(widget){
         var w = {
           type: widget,
           config: adfDashboardService.createConfiguration(widget)
         };
         adfDashboardService.addNewWidgetToModel(model, w, name);
         // close and destroy
         instance.close();
         addScope.$destroy();

         // check for open edit mode immediately
         if (adfDashboardService.isEditModeImmediate(widget)){
           _openEditMode($scope, w);
         }
       };
       addScope.closeDialog = function(){
         // close and destroy
         instance.close();
         addScope.$destroy();
       };
      };

      $scope.addNewWidgetToModel = adfDashboardService.addNewWidgetToModel;
    }

    /**
     * Directive link function.
     *
     * @param dashboard scope
     * @param directive DOM element
     * @param directive attributes
     */
    function link($scope, $element, $attr) {
      // pass options to scope
      var options = {
        name: $attr.name,
        editable: true,
        enableConfirmDelete: adfUtilsService.stringToBoolean($attr.enableConfirmDelete),
        maximizable: adfUtilsService.stringToBoolean($attr.maximizable),
        collapsible: adfUtilsService.stringToBoolean($attr.collapsible),
        categories: adfUtilsService.stringToBoolean($attr.categories)
      };
      if (angular.isDefined($attr.editable)){
        options.editable = adfUtilsService.stringToBoolean($attr.editable);
      }
      $scope.options = options;
    }
  });
