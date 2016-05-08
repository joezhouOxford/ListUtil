/**
 * Created by zhou on 07/05/2016.
 */
var noOfRecrodToRestore=5000;
function runCode() {
        this.clientContext = new SP.ClientContext.get_current();

        var site = clientContext.get_site();
        this.recycleItemCollection = site.get_recycleBin();

        clientContext.load(this.recycleItemCollection);
        clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded(this.recycleItemCollection)), Function.createDelegate(this, this.onQueryFailed));


}

function onQuerySucceeded(recycleItemCollection) {
    if (recycleItemCollection.get_count() > 0) {
        processNextRecord(recycleItemCollection,0);

    }
    else {
        alert("The Recycle Bin is empty.");
    }
}
function processNextRecord(recycleItemCollection,nextIndex)
{
    this.item = recycleItemCollection.itemAt(nextIndex);
    var id = item.get_id();
    var title = item.get_title();
    console.log('Title: ' + title + ';' + 'Item ID: ' + id);
    jQuery.when(addAudit(item)).done(function(){
        console.log("audit done");
        return restoreItem(item);
    }).done(function(){
        console.log("retore item done");
        nextIndex++;
        if(nextIndex<noOfRecrodToRestore)
            processNextRecord(recycleItemCollection,nextIndex);
    }).fail(promiseFail);



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
    setTimeout(function(){dfd.resolve();},30);
    return thisDefer.promise();

}
function promiseFail(error){
    alert(error);
}
function onQueryFailed(sender, args) {
    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
