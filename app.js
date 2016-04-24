var brain = require('./lib/brain/lib/brain');
var datamanager = require('./src/utils/datamanager');

var LOG_PERIOD = 50;

// --------------- Socket.IO --------------------------
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
require('./routes.js')(app);

var network;
function runNN(parameters, callback) {
  network = new brain.NeuralNetwork({
      hiddenLayers: parameters.layerSizes || []
  }, io);

  switch (parameters.dataset) {
    case "custom":
      if (parameters.customData) {
        trainNeuralNetwork(parameters.customData, parameters, callback);
      } else {
        console.log("parameters.customData is empty!");
      }
      break;
    case "xor":
      data = [{input: [0, 0], output: [0]},
              {input: [0, 1], output: [1]},
              {input: [1, 0], output: [1]},
              {input: [1, 1], output: [0]}];

      trainNeuralNetwork(data, parameters, callback);
      break;
    case "iris":
      datamanager.getIrisDataset(function(data) {
        trainNeuralNetwork(data, parameters, callback);
      });
      break;
    default:
      console.log("Undefined dataset!");
      break;
  }
}

function trainNeuralNetwork(trainingData, parameters, callback) {
  var trainingInfo = network.train(trainingData, {
              errorThresh: parameters.errorThreshold || 0.005,
              iterations: parameters.iterations || 10000,
              log: true,
              logPeriod: LOG_PERIOD,
              refreshVisWhenLogging: true,
              learningRate: parameters.learningRate || 0.1
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

function testNeuralNetwork(testingData, parameters, callback) {
  var output = network.run(testingData);
  console.log(output);

  if (callback) callback(output);
}



server.listen(process.env.PORT || 3000);

io.sockets.on('connection', function(socket) {
  socket.on('refresh-viz', function(nnParameters) {
    runNN(nnParameters, function(nnJSON, trainingInfo) {
      //io.sockets.emit('refresh-viz', nnJSON);
      //io.sockets.emit('refresh-graphs', trainingInfo);
    });
  });

  socket.on('test-data', function(dataAndParamsObj) {
    testNeuralNetwork(dataAndParamsObj.testData, dataAndParamsObj.nnParameters, function(results) {

    });
  });
});
