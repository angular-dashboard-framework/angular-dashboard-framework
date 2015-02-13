'use strict';

describe('dashboard edit tests', function(){

  beforeEach(function(){
    browser.get('http://localhost:9001/sample/index.html#/sample/03');
  });

  it('should have Sample 01 as default title', function(){
    var title = element(by.css('h1')).getText();
    expect(title).toEqual('Sample 03');
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
    expect(title.getText()).toEqual('Sample 03');

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
    expect(columns.get(1).all(by.css('.widget')).count()).toEqual(1);
  });

});
