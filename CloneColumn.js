/**
 * Created by zhou on 05/05/2016.
 */

var sourceListTitle="Importtest5";
var targetListTitleList="ImportTest1,ImportTest2";
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

var sourceFieldInternalNameArray=sourceFieldInternalNameList.split(',');
var targetListTitleArray=targetListTitleList.split(',');


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
        cloneFields(sourceFieldInternalNameArray,0,targetListTitleArray,0);
    });
})();

function cloneFields(sourceFieldInternalNameArray,j,targetListTitleArray,k){
    var promise=clone1FieldFor1List(sourceFieldInternalNameArray,j,targetListTitleArray,k);
    jQuery.when(promise).then(function(fieldIndex,listIndex){
        console.log("current listIndex "+listIndex);
        var nextlistIndex=listIndex+1;
        if(nextlistIndex<targetListTitleArray.length)
        {
            console.log("nextlist index "+nextlistIndex);
            var nextlistIndex=listIndex+1;
            cloneFields(sourceFieldInternalNameArray,j,targetListTitleArray,nextlistIndex);
        }
        else{
            console.log("column "+sourceFieldInternalNameArray[j]+" has been inserted to all lists, go next field");
            var nextfieldIndex=fieldIndex+1;
            console.log("current field index "+fieldIndex);
            if(nextfieldIndex<sourceFieldInternalNameArray.length)
            {
                console.log("nextfield index "+nextfieldIndex);
            cloneFields(sourceFieldInternalNameArray,nextfieldIndex,nextfieldIndex,targetListTitleArray,0);
            }
            else
            {
                console.log("all fields clone to all lists completed");
            }
        }
    });
}
function clone1FieldFor1List(sourceFieldInternalNameArray, j,targetListTitleArray,k){
    this.dfd = jQuery.Deferred();
    this.sourceField=oFields.getByInternalNameOrTitle(sourceFieldInternalNameArray[j]);
    this.targetListTitle=targetListTitleArray[k];
    this.j=j;
    this.k=k;
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
    console.log(sourceFieldXML);
    addListFieldBySchemaXML(this.targetListTitle,sourceFieldXML);

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
    this.dfd.resolve(this.j,this.k);
}





