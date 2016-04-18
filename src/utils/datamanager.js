var fs = require('fs');
var $ = jQuery = require('jquery');
require('../../lib/jquery.csv.js');

var csv = require('fast-csv');

function getTrainingData(callback) {
    var dataRows = [];

    csv.fromPath("./data/data.csv")
     .on("data", function(data){
        dataRows.push(data);
     })
     .on("end", function(){
        //console.log("Done reading csv file!");
        if (callback) callback(dataRows);
     });
}

function parseDataForNN(dataRows) {
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
    getTrainingData: getTrainingData,
    parseDataForNN: parseDataForNN
}
