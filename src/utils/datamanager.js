var fs = require('fs');
var $ = jQuery = require('jquery');
require('../../lib/jquery.csv.js');
var csv = require('fast-csv');

var allInputVals = [];

function getIrisDataset(callback) {
  fs.readFile('./data/iris.txt','utf8', function(err, data) {
	   if(err) throw err;

     var lines = data.split("\n");
	   var trainingData = [];

     for (var i = 0; i < lines.length; i++) {
    		var line = lines[i].trim();
    		var splitLine = line.split(",");
    		var input = splitLine.slice(0, 4);

        allInputVals.push.apply(allInputVals, input.map(function(val) { return parseFloat(val); }) );

    		var output = splitLine[4] == 'Iris-virginica' ? [0,0,1]
    					     : splitLine[4] == 'Iris-versicolor' ? [0,1,0]
    					                                         : [1,0,0];

    		trainingData.push({
    			input: input,
    			output: output
    		});
    	}

      //var maxVal = getMaxVal(allInputVals);
      var parsedInputData = parseIrisDataForNN(trainingData);
      trainingData = parsedInputData;

      if (callback) callback(trainingData);
   });
}

// Helper functions - Iris Dataset
function getFlowerName(arr){
	var index = getLargestIndex(arr);
	if(index == 0)
		return "Iris-setosa";
	if(index == 1)
		return "Iris-versicolor";
	return "Iris-virginica"
}

function getLargestIndex(arr){
	var result = 0;
	for(var i = 1; i < arr.length; i++)
		if(arr[i] > arr[result])
			result = i;
	return result;
}

function getMaxVal(allVals) {
  var maxVal = 1;
  allVals.forEach(function(val) {
     if (val > maxVal) maxVal = val;
  });

  return maxVal;
}

function getData(type, callback) {
    var dataRows = [];
    var fileName = "train.csv";
    if (type == "train") {
      fileName = "train2.csv";
    } else {
      fileName = "test.csv";
    }

    csv.fromPath("./data/" + fileName)
     .on("data", function(data){
        dataRows.push(data);
     })
     .on("end", function(){
        if (callback) callback(dataRows);
     });
}

function parseIrisDataForNN(dataRows) {
  var parsedData = [];
  dataRows.forEach(function(dataRow) {
    //var parsedDataRow = parseDataRow(dataRow);
    parsedData.push({
            input: dataRow.input.map(function(d) { return d/7.9 }),
            output: dataRow.output
        });
  });

//   function parseDataRow(data) {
//     var parsedDataObject = {
//         input: [],
//         output: data.output
//     };
//     data = data.slice(1);

//     data.forEach(function(datum) {
//        parsedDataObject.input.push(datum/7.9)
//     });

//     return parsedDataObject;
//   }

  return parsedData;
}

function parseMnistDataForNN(dataRows) {
    var parsedData = [];
    dataRows.forEach(function(dataRow) {
        var parsedDataRow = parseDataRow(dataRow);
        parsedData.push(parsedDataRow);
    });

    function parseDataRow(data) {
        var parsedDataObject = {
            input: [],
            output: [data[0]/10]
        };
        data = data.slice(1);

        data.forEach(function(datum) {
            parsedDataObject.input.push(datum/255);
        });

        return parsedDataObject;
    }

    return parsedData;
}

module.exports = {
    getData: getData,
    getIrisDataset: getIrisDataset,
    parseMnistDataForNN: parseMnistDataForNN
}
