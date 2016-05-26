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

describe('Dashboard Provider tests', function() {

  var provider;

  // Load the adf module, which contains the provider
  beforeEach(module('adf.provider', function(dashboardProvider){
    provider = dashboardProvider;
  }));

  it('should attach default properties to the widget', inject(function(){
    provider.widget('test', {});

    var widget = provider.$get().widgets['test'];
    expect(widget.reload).toBe(false);
    expect(widget.frameless).toBe(false);
  }));

  it('should attach default edit properties to the widget', inject(function(){
    provider.widget('test', {});
    provider.widget('test-2', {edit:{}});

    var widget = provider.$get().widgets['test'];
    expect(widget.edit).toBeUndefined();

    var widget2 = provider.$get().widgets['test-2'];
    expect(widget2.edit.reload).toBe(true);
    expect(widget2.edit.immediate).toBe(false);
    expect(widget2.edit.apply).toBeDefined();
    expect(widget2.edit.apply()).toBeTruthy();
  }));

  it('should store widget path', inject(function(){
    provider.widgetsPath('some-path');

    expect(provider.$get().widgetsPath).toBe('some-path');
  }));

  it('should store structure by name', inject(function(){
    provider.structure('test', { name: 'test' });
    provider.structure('test-2', { name: 'test-2' });

    var dashboard = provider.$get();

    var structure = dashboard.structures['test'];
    expect(structure.name).toBe('test');

    structure = dashboard.structures['test-2'];
    expect(structure.name).toBe('test-2')
  }));

  it('should store message template', inject(function(){
    provider.messageTemplate('unit-test');

    expect(provider.$get().messageTemplate).toBe('unit-test');
  }));

  it('should store loading template', inject(function(){
    provider.loadingTemplate('unit-test');

    expect(provider.$get().loadingTemplate).toBe('unit-test');
  }));

  it('should increase the id', inject(function(){
    var dashboard = provider.$get();

    var ids = [];
    for (var i=0; i<1000; i++){
      var id = dashboard.id();
      expect(ids).not.toContain(id);
      ids[i] = id;
    }
  }));

  it('ids should be equals', inject(function(){
    var dashboard = provider.$get();
    expect(dashboard.idEquals('1', '1')).toBe(true);
    expect(dashboard.idEquals('1', 1)).toBe(true);
    expect(dashboard.idEquals(1, '1')).toBe(true);
    expect(dashboard.idEquals(1, 1)).toBe(true);
  }));

  describe('culture', function() {

    it('should default to en-GB', function() {
      var dashboard = provider.$get();
      expect(dashboard.activeCulture()).toBe('en-GB');
    });

    it('should set the culture', function() {
      var dashboard = provider.$get();
      var newCulture = 'sv-SE';

      provider.setCulture(newCulture);
      expect(dashboard.activeCulture()).toBe(newCulture);
      expect(dashboard.translate('ADF_COMMON_CLOSE')).toBe('Stäng');
    });

    it('should throw an exception if culture doesnt exist', function() {
      var func = function() {
        provider.setCulture('af-ZA');
      };

      expect(func).toThrowError('Cannot set culture: af-ZA. Culture is not defined.');
    });

    it('should add a culture', function() {
      var dashboard = provider.$get();
      var culture = 'af-ZA';
      var translations = {
        'ADF_COMMON_CLOSE': 'Naby'
      };

      provider.addCulture(culture, translations);
      expect(dashboard.cultures()[culture]).toBe(translations);

      provider.setCulture(culture);
      expect(dashboard.translate('ADF_COMMON_CLOSE')).toBe('Naby');
    });

    it('should throw an exception when adding culture without a culture code or translation', function() {
      var dashboard = provider.$get();
      var culture = null;
      var translations = [];
      var call1 = function() {
          provider.addCulture(null, null);
      };
      var call2 = function() {
          provider.addCulture('af-AZ', null);
      };

      expect(call1).toThrowError('cultureCode must be an string');
      expect(call2).toThrowError('translations must be an object');
    });

    it('should return the label value if translation doesn´t exists', function() {
      var dashboard = provider.$get();
      var nonExistenceLabelKey = 'MY_FAKE_LABEL';
      var translation = dashboard.translate(nonExistenceLabelKey);
      expect(translation).toBe(nonExistenceLabelKey);
    });
    
  });

});
