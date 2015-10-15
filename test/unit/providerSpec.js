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

    var structure = dashboard.structures['test-2'];
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

    expect(dashboard.id()).toBe(1);
    expect(dashboard.id()).toBe(2);
    expect(dashboard.id()).toBe(3);
  }));

});
