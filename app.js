var brain = require('brain');
var datamanager = require('./src/utils/datamanager');

var net = new brain.NeuralNetwork({
    hiddenLayers: [3, 4]
});

function runNN(callback) {
  datamanager.getTrainingData(function(unParsedData) {
      var data = datamanager.parseDataForNN(unParsedData);
      data = [{input: [0, 0], output: [0]},
          {input: [0, 1], output: [1]},
          {input: [1, 0], output: [1]},
          {input: [1, 1], output: [0]}];

      net.train(data, {
                  errorThresh: 0.005,
                  iterations: 10000,
                  log: false,
                  logPeriod: 10,
                  learningRate: 0.3
          });

      var output = net.run([1, 0]);
      console.log(output);

      var jsonString = net.toJSON();
      if (callback) callback(jsonString);
  });
}

// --------------- Socket.IO --------------------------
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(3000);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/lib/d3.min.js', function(req, res) {
  res.sendFile(__dirname + '/lib/d3.min.js');
});
app.get('/script.js', function(req, res) {
  res.sendFile(__dirname + '/script.js');
});
app.get('/data/neuralnetwork.json', function(req, res) {
  res.sendFile(__dirname + '/data/neuralnetwork.json');
});

io.sockets.on('connection', function(socket) {
  socket.on('refresh-graph', function() {
    runNN(function(nnJSON) {
      io.sockets.emit('refresh-graph', nnJSON);
    });
  });
});
