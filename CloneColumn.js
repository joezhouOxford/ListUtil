/**
 * Created by zhou on 05/05/2016.
 */

var sourceListTitle="Importtest5";
var targetListTitleList="ImportTest1";
var sourceFieldInternalNameList="Datum,Geschatte_x0020_BMI";


//noinspection JSUnresolvedFunction
var clientContext = new SP.ClientContext.get_current();
//get web
var oWebsite = clientContext.get_web();

//get list
this.oList = oWebsite.get_lists();
var sourceList=oList.getByTitle(sourceListTitle);


//read source list field XML
 // Getting All Fields From the List
var oFields=sourceList.get_fields();
function cloneFields(sourceFieldInternalNameArray,j){
    var promise=cloneField(sourceFieldInternalNameArray,j);
    jQuery.when(promise).then(function(index){
        console.log("current index "+index);
        var nexti=index+1;
        if(nexti < sourceFieldInternalNameArray.length)
        {
            console.log("nexti index "+nexti);
            cloneFields(sourceFieldInternalNameArray,nexti);
        }
        else
        {
            console.log("all fields clone completed");
        }

    });
}
function cloneField(sourceFieldInternalNameArray,j){
    this.dfd = jQuery.Deferred();
    this.sourceField=oFields.getByInternalNameOrTitle(sourceFieldInternalNameArray[j]);
    this.j=j;
    clientContext.load(sourceField);
    clientContext.executeQueryAsync(Function.createDelegate(this, this.onGetFieldSuccess),Function.createDelegate(this, this.onFail));
    return dfd.promise();
}
function onFail(errormsg,msg,status){
    console.error(errormsg);
    console.error(msg);
    console.error(status);

}
function onGetFieldSuccess(){
    var sourceFieldXML=this.sourceField.get_schemaXml();
    var targetListTitleArray=targetListTitleList.split(',');
    console.log(sourceFieldXML);
    for (var i = 0; i < targetListTitleArray.length; i++) {
        this.currentIndex=i;
        addListFieldBySchemaXML(targetListTitleArray[i],sourceFieldXML);
    }

}

function addListFieldBySchemaXML(targetListTitle,schemaXML)
{

    var targetList=oList.getByTitle(targetListTitle);
    console.log("for list " +targetListTitle);
    var fieldValue = targetList.get_fields().addFieldAsXml(schemaXML, false, SP.AddFieldOptions.addToNoContentType);
    fieldValue.update();
    clientContext.load(fieldValue );
    clientContext.executeQueryAsync(Function.createDelegate(this, this.OnaddListFieldSuccess),Function.createDelegate(this, this.onFail));
}
function OnaddListFieldSuccess()
{
    console.log("add field success");
    this.dfd.resolve(this.j);
}

var sourceFieldInternalNameArray=sourceFieldInternalNameList.split(',');


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
        cloneFields(sourceFieldInternalNameArray,0);
    });
})();



