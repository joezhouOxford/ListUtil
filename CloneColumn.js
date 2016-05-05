/**
 * Created by zhou on 05/05/2016.
 */

var sourceListTitle="Importtest5";
var targetListTitle="ImportTest1";
var sourceFieldInternalName="Datum";


var clientContext = new SP.ClientContext.get_current();
//get web
var oWebsite = clientContext.get_web();

//get list
this.oList = oWebsite.get_lists()
var sourceList=oList.getByTitle(sourceListTitle);


//read source list field XML
 // Getting All Fields From the List
var oFields=sourceList.get_fields()
this.sourceField=oFields.getByInternalNameOrTitle(sourceFieldInternalName);
clientContext.load(sourceField);
clientContext.executeQueryAsync(Function.createDelegate(this, this.onGetFieldSuccess));

function onGetFieldSuccess(){
    var sourceFieldXML=this.sourceField.get_schemaXml();

    console.log(sourceFieldXML);
    addListFieldBySchemaXML(sourceFieldXML);
};

function addListFieldBySchemaXML(schemaXML)
{
    var targetList=oList.getByTitle(targetListTitle);
    var fieldValue = targetList.get_fields().addFieldAsXml(schemaXML, false, SP.AddFieldOptions.addToNoContentType);
    fieldValue.update();
    clientContext.load(fieldValue );
    clientContext.executeQueryAsync(Function.createDelegate(this, this.OnaddListFieldSuccess));
}
function OnaddListFieldSuccess()
{
    console.log("add field success");
}



