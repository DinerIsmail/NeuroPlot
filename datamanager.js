var fs = require('fs');
var $ = jQuery = require('jquery');
var csv = require('fast-csv');

var allInputVals = [];

function getIrisDataset(callback, forTesting) {
  var fileName = "iris.txt";
  if (forTesting && forTesting == true) {
    fileName = "iris_test.txt";
  }

  fs.readFile('./data/' + fileName,'utf8', function(err, data) {
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

      var parsedInputData = parseIrisDataForNN(trainingData);
      trainingData = parsedInputData;

      if (callback) callback(trainingData);
   });
}

function parseIrisDataForNN(dataRows) {
  var parsedData = [];
  dataRows.forEach(function(dataRow) {
    parsedData.push({
            input: dataRow.input.map(function(d) { return d/7.9 }),
            output: dataRow.output
        });
  });

  return parsedData;
}

// Helper functions - Iris Dataset
function getFlowerName(arr) {
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

module.exports = {
    getIrisDataset: getIrisDataset,
    getFlowerName: getFlowerName
}