/**
 * Created by zhou on 07/05/2016.
 */
var noOfRecrodToRestore=1;
this.live=true;
this.itemState=1;
function onQuerySucceeded()
{
    loopThroughRecycleItems(this.recycleItemCollection);
}
function loopThroughRecycleItems(recycleItemCollection) {
    if (recycleItemCollection.get_count() > 0) {
        console.log("has recycle item");
        processNextRecord(recycleItemCollection,0);

    }
    else {
        alert("The Recycle Bin is empty.");
    }
}
function processNextRecord(recycleItemCollection,nextIndex)
{
  if(nextIndex<noOfRecrodToRestore&&nextIndex<recycleItemCollection.get_count()){
    this.item = recycleItemCollection.itemAt(nextIndex);
    var id = item.get_id();
    var title = item.get_title();
    var itemState=item.get_itemState();
    console.log('Title: ' + title + ';' + 'Item ID: ' + id);
      if(itemState==1)
    {
        jQuery.when(addAudit(item)).done(function(){
            console.log("audit done");
            return restoreItem(item);
        }).done(function(){
            console.log("retore item done");
            processNextRecord(recycleItemCollection,nextIndex+1);
        }).fail(promiseFail);
    }
    else{
            processNextRecord(recycleItemCollection,nextIndex+1);
    }

 }


}
function addAudit(item){
    var dfd=jQuery.Deferred();
    //add audit trial
    setTimeout(function(){dfd.resolve();},30);
    return dfd.promise();

}

function restoreItem(item){
    var dfd=jQuery.Deferred();
    //retore item

    if(this.live)
    {
        item.restore();
        var itemContext=item.get_context();
        itemContext.load(item);
        itemContext.executeQueryAsync(function(){dfd.resolve();},onQueryFailed);
    }
    else
    {
        setTimeout(function(){dfd.resolve();},30);
    }

    return dfd.promise();

}
function promiseFail(error){
    alert(error);
}
function onQueryFailed(sender, args) {
    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
function runCode() {
    this.clientContext = new SP.ClientContext.get_current();

    var site = clientContext.get_site();
    this.recycleItemCollection = site.get_recycleBin();

    clientContext.load(this.recycleItemCollection);
    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));


}
// Anonymous "self-invoking" function
(function() {
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(script);

    // Poll for jQuery to come into existance
    var checkReady = function(callback) {
        if (window.jQuery) {
            callback(jQuery);
        }
        else {
            window.setTimeout(function() { checkReady(callback); }, 100);
        }
    };

    // Start polling...
    checkReady(function(jQuery) {
        //runCode();
    });
})();