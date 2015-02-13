'use strict';

describe('Drag and drop tests', function(){

  beforeEach(function(){
    browser.get('http://localhost:9001/sample/index.html#/sample/03');
  });

  it('widgets should be moveable', function(){
    // enter edit mode
    element(by.css('h1 a')).click();

    // move first widget to second column
    var mover = element.all(by.css('a > i.glyphicon-move')).first();

    // check source col
    var sourceCol = element.all(by.css('.column')).first();
    expect(sourceCol.all(by.css('.widget')).count()).toEqual(1);

    // check target col
    var targetCol = element.all(by.css('.column')).get(1);
    expect(targetCol.all(by.css('.widget')).count()).toEqual(1);

    // dnd
    browser.actions()
      .dragAndDrop(mover, targetCol)
      .perform();

    // verifiy dnd result
    expect(sourceCol.all(by.css('.widget')).count()).toBe(0);
    expect(targetCol.all(by.css('.widget')).count()).toBe(2);
  });

});
