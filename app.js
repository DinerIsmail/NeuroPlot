var brain = require('./lib/brain/lib/brain');
var datamanager = require('./src/utils/datamanager');

var LOG_PERIOD = 20;

// --------------- Socket.IO --------------------------
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
require('./routes.js')(app);
// ----------------------------------------------------

//var network;
function runNN(parameters, callback) {
  var network = new brain.NeuralNetwork({
      hiddenLayers: parameters.layerSizes || []
  }, io);

  switch (parameters.dataset) {
    case "custom":
      if (parameters.customData) {
        trainNeuralNetwork(parameters.customData, parameters, network, callback);
      } else {
        console.log("parameters.customData is empty!");
      }
      break;
    case "xor":
      data = [{input: [0, 0], output: [0]},
              {input: [0, 1], output: [1]},
              {input: [1, 0], output: [1]},
              {input: [1, 1], output: [0]}];

      trainNeuralNetwork(data, parameters, network, callback);
      break;
    case "iris":
      datamanager.getIrisDataset(function(data) {
        trainNeuralNetwork(data, parameters, network, callback);

        datamanager.getIrisDataset(function(testingData) {

          console.log("\n\nResults\n===============================\n");

          var testingResults = {
            correct: 0,
            wrong: 0
          }

      		for(var i = 0; i < testingData.length; i++) {
            var input = testingData[i].input;
            var actualOutput = datamanager.getFlowerName(network.run(input));
            var idealOutput = datamanager.getFlowerName(testingData[i].output);
            if (actualOutput == idealOutput) {
              testingResults.correct++;
            } else {
              testingResults.wrong++;
            }
            console.log("Actual: " + actualOutput + ", Ideal: " + idealOutput);
            console.log(testingResults.correct + " out of " + (parseInt(testingResults.correct + testingResults.wrong)) + " total");
          }

          io.sockets.emit('testing-finished', testingResults);
        }, true);
      });
      break;
    default:
      console.log("Undefined dataset!");
      break;
  }
}

function trainNeuralNetwork(trainingData, parameters, network, callback) {
  var trainingInfo = network.train(trainingData, {
    errorThresh: parameters.errorThreshold || 0.005,
    iterations: parameters.iterations || 10000,
    log: true,
    logPeriod: LOG_PERIOD,
    refreshVisWhenLogging: true,
    learningRate: parameters.learningRate || 0.3
  });
  console.log("Training finished!");

  var trainingStats = {
    data: trainingInfo,
    logPeriod: LOG_PERIOD,
    totalIterationsCount: parameters.iterations || 10000
  }

  var jsonString = network.toJSON();
  if (callback) callback(jsonString, trainingStats);
}

function testNeuralNetworkWithCustomInput(testingData, parameters, network, callback) {
  var output = network.run(testingData);
  console.log(output);

  if (callback) callback(output);
}

// Start the server on port 3000
server.listen(process.env.PORT || 3000);

io.sockets.on('connection', function(socket) {


  socket.on('refresh-viz', function(nnParameters) {
    runNN(nnParameters, function(nnJSON, trainingInfo) {
      // Front-end visusalisations are updated during training, from neuralnetwork.js
    });
  });

  socket.on('test-data', function(dataAndParamsObj) {
    // testNeuralNetworkWithCustomInput(dataAndParamsObj.testData, dataAndParamsObj.nnParameters, function(results) {
    //
    // });
  });
});
