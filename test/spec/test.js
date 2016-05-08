/*(function () {*/
  'use strict';

  describe('Recycle Bin', function () {
    describe('when there are recycle bin Items ', function () {
      var recycleItemCollection={};
      recycleItemCollection.get_count=function(){return 1;};
        recycleItemCollection.itemAt=function(index){
        var item={};
        item.get_id=function(){return 1};
        item.get_title=function(){return ""};
        return item;
      };

      it('should restore the recycle items', function () {
        console.log = jasmine.createSpy("log");
        var gotRecycleItems = loopThroughRecycleItems(recycleItemCollection);
        expect(console.log).toHaveBeenCalledWith("Title: ;Item ID: 1");

      });
    });
  });
/*})();*/
