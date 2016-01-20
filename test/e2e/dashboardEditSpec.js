/**
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
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/


'use strict';

var helper = require('./helper.js')

describe('dashboard edit tests', function(){

  beforeEach(function(){
    browser.get('http://localhost:9003/sample/index.html#/sample/02');
    browser.executeScript('window.localStorage.clear();');
  });

  it('should have Sample 02 as default title', function(){
    var title = element(by.css('h1')).getText();
    expect(title).toEqual('Sample 02');
  });

  it('title should be changeable', function(){
    // enter edit mode
    element(by.css('h1 a')).click();
    // open edit dialog
    element(by.css('h1 a > i.glyphicon-cog')).click();

    // select title input, press ctrl+a and write Fancy title
    var input = element(by.css('#dashboardTitle'));
    input.clear();
    input.sendKeys('Fancy title');

    // get title element
    var title = element(by.css('h1'));

    // title should only change after the dialog is closed
    expect(title.getText()).toEqual('Sample 02');

    // close dialog
    element(by.css('button.close')).click();
    expect(title.getText()).toEqual('Fancy title');
  });

  it('structure should be changeable', function(){
    // check current structure
    expect(element.all(by.css('.column')).count()).toEqual(2);

    // enter edit mode
    element(by.css('h1 a')).click();
    // open edit dialog
    element(by.css('h1 a > i.glyphicon-cog')).click();

    // wait for modal
    helper.waitForModal(browser);

    // check current selection
    var v = element(by.css('input[type=radio]:checked')).getAttribute('value');
    expect(v).toEqual('6-6');

    // change structure to 12/4-4-4
    element(by.css('input[type=radio][value="12/4-4-4"]')).click().then(function(){
      v = element(by.css('input[type=radio]:checked')).getAttribute('value');
      expect(v).toEqual('12/4-4-4');
    });

    // close dialog
    element(by.css('button.close')).click();

    // verify result
    var columns = element.all(by.css('.column'));
    expect(columns.count()).toEqual(4);
    expect(columns.first().all(by.css('.widget')).count()).toEqual(1);
    expect(columns.get(1).all(by.css('.widget')).count()).toEqual(2);
  });

});
