var metadata = [];
var data = [];

function setupMetadata(inputCount) {
  metadata = [];

  for (var i = 0; i < inputCount; i++) {
    metadata.push({ name: "input"+i, label: " ", length: 40, datatype: "integer", editable: true});
  }

  metadata.push({ name: "output", label: "OUTPUT", datatype: "integer", editable: true});
}

function initializeWithDefaultData(columnCount, rowCount) {
  data = [];

  var defaultDataArray = [];
  for (var i = 0; i < columnCount; i++) { defaultDataArray.push(0) }

  var numberOfRows = rowCount || 3;
  for (var i = 1; i <= numberOfRows; i++) { data.push({id: i, values: defaultDataArray}); }
}

// Default
setupMetadata(2);
initializeWithDefaultData(3, 4);

editableGrid = new EditableGrid("CustomDataGrid", {
  //editmode: "static"
});

function displayMessage(text, style) {
	_$("message").innerHTML = "<p class='" + (style || "ok") + "'>" + text + "</p>";
}

EditableGrid.prototype.initializeGrid = function()
{
	with (this) {
    //getColumn("input1").cellEditor.minWidth = 120;

    modelChanged = function(rowIndex, columnIndex, oldValue, newValue, row) {
			//displayMessage("Value for '" + this.getColumnName(columnIndex) + "' in row " + this.getRowId(rowIndex) + " has changed from '" + oldValue + "' to '" + newValue + "'");
			//if (this.getColumnName(columnIndex) == "continent") this.setValueAt(rowIndex, this.getColumnIndex("country"), ""); // if we changed the continent, reset the country

    };
  }
};

EditableGrid.prototype.addRow = function() {
  values = [];
  var values = this.getRowValues(this.getRowCount()-1);
	values['name'] = values['name'] + ' (copy)';

	// Get id for new row (max id + 1)
	var newRowId = 0;
	for (var r = 0; r < this.getRowCount(); r++) newRowId = Math.max(newRowId, parseInt(this.getRowId(r)) + 1);

	// Add new row
	this.insertAfter(this.getRowCount()-1, newRowId, values);
};

EditableGrid.prototype.getFormattedData = function() {
  // This is assuming that the last column is the desired output of the neural network
  var unformattedData = this.data;
  var formattedData = [];
  var columnsCount = unformattedData[0].columns.length;

  unformattedData.forEach(function(datumObj) {
    formattedData.push({
      input: datumObj.columns.slice(0, columnsCount-1),
      output: datumObj.columns.slice(columnsCount-1, columnsCount)
    });
  });

  return formattedData;
};

editableGrid.load({"metadata": metadata, "data": data});
editableGrid.initializeGrid();

editableGrid.renderGrid("inputdatatable", "inputdatagrid");

$('.inputvaluescount').change(function() {
  var inputValuesCount = parseInt($(this).val());
  setupMetadata(inputValuesCount);
  initializeWithDefaultData(inputValuesCount+1);
  editableGrid.load({"metadata": metadata, "data": data});
  editableGrid.renderGrid("inputdatatable", "inputdatagrid");

  if ($('.inputdatagrid').width() > 188) {
    $('#inputdatatable').addClass("showscrollbar");
    $('#inputdatatable').removeClass("hidescrollbar");
  } else {
    $('#inputdatatable').addClass("hidescrollbar");
    $('#inputdatatable').removeClass("showscrollbar");
  }
});

$('.add-input-data-row').click(function() {
  editableGrid.addRow();
});
