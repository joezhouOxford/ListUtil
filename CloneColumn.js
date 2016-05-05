/**
 * Created by zhou on 05/05/2016.
 */

var sourceListTitle="Importtest5";
var targetListTitleList="ImportTest1";
var sourceFieldInternalName="Datum";


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
this.sourceField=oFields.getByInternalNameOrTitle(sourceFieldInternalName);
clientContext.load(sourceField);
clientContext.executeQueryAsync(Function.createDelegate(this, this.onGetFieldSuccess));

function onGetFieldSuccess(){
    var sourceFieldXML=this.sourceField.get_schemaXml();
    var targetListTitleArray=targetListTitleList.split(',');
    console.log(sourceFieldXML);
    for (var i = 0; i < targetListTitleArray.length; i++) {
        addListFieldBySchemaXML(targetListTitleArray[i],sourceFieldXML);
    }

}

function addListFieldBySchemaXML(targetListTitle,schemaXML)
{
    var targetList=oList.getByTitle(targetListTitle);
    console.log("for list" +targetListTitle);
    var fieldValue = targetList.get_fields().addFieldAsXml(schemaXML, false, SP.AddFieldOptions.addToNoContentType);
    fieldValue.update();
    clientContext.load(fieldValue );
    clientContext.executeQueryAsync(Function.createDelegate(this, this.OnaddListFieldSuccess));
}
function OnaddListFieldSuccess()
{
    console.log("add field success");
}



