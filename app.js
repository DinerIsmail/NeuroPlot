var brain = require('./lib/brain/lib/brain');
var datamanager = require('./src/utils/datamanager');

// Constants
var logPeriod = 10;

function runNN(callback, parameters) {
  var net = new brain.NeuralNetwork({
      hiddenLayers: parameters.layerSizes || []
  });

  if (parameters.customData) {
    runNeuralNetworkWithData(paramers.customData);
  } else {
    datamanager.getIrisDataset(function(data) {
      //console.log(data);
      // data = [{input: [0, 0], output: [0]},
      //         {input: [0, 1], output: [1]},
      //         {input: [1, 0], output: [1]},
      //         {input: [1, 1], output: [0]}];

      runNeuralNetworkWithData(data);
    });
  }

  function runNeuralNetworkWithData(trainingData) {
    console.log("Starting training...")
    var trainingInfo = net.train(trainingData, {
                errorThresh: parameters.errorThreshold || 0.005,
                iterations: parameters.iterations || 10000,
                log: true,
                logPeriod: logPeriod,
                refreshVisWhenLogging: true,
                learningRate: parameters.learningRate || 0.1
        });
    console.log("Training finished!");

    var trainingStats = {
      data: trainingInfo,
      logPeriod: logPeriod,
      totalIterationsCount: parameters.iterations || 10000
    }

    //var output = net.run([1, 0]);
    //console.log(output);

    var jsonString = net.toJSON();
    if (callback) callback(jsonString, trainingStats);
  }
}

// --------------- Socket.IO --------------------------
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
require('./routes.js')(app);

server.listen(process.env.PORT || 3000);



io.sockets.on('connection', function(socket) {
  socket.on('refresh-viz', function(nnParameters) {
    //console.log(nnParameters);
    runNN(function(nnJSON, trainingInfo) {
      io.sockets.emit('refresh-viz', nnJSON);
      io.sockets.emit('refresh-graphs', trainingInfo);
    }, nnParameters);
  });
});
