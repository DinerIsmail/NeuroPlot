var brain = require('./lib/brain/lib/brain');
var datamanager = require('./src/utils/datamanager');

function runNN(callback, parameters) {
  var net = new brain.NeuralNetwork({
      hiddenLayers: parameters.layerSizes || []
  });

  if (parameters.customData) {
    runNeuralNetworkWithData(paramers.customData);
  } else {
    datamanager.getTrainingData(function(unParsedData) {
        var data = datamanager.parseDataForNN(unParsedData);
        data = [{input: [0, 0], output: [0]},
                {input: [0, 1], output: [1]},
                {input: [1, 0], output: [1]},
                {input: [1, 1], output: [0]}];

        runNeuralNetworkWithData(data);
    });
  }

  function runNeuralNetworkWithData(trainingData) {
    var trainingInfo = net.train(trainingData, {
                errorThresh: parameters.errorThreshold || 0.005,
                iterations: parameters.iterations || 10000,
                log: false,
                logPeriod: 10,
                learningRate: parameters.learningRate || 0.03
        });

    var output = net.run([1, 0]);
    console.log(output);
    console.log(trainingInfo);

    var jsonString = net.toJSON();
    if (callback) callback(jsonString);
  }
}

// --------------- Socket.IO --------------------------
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(process.env.PORT || 3000);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/lib/d3.min.js', function(req, res) {
  res.sendFile(__dirname + '/lib/d3.min.js');
});
app.get('/nn-visualisation.js', function(req, res) {
  res.sendFile(__dirname + '/public/nn-visualisation.js');
});

// EditableGrid
app.get('/inputdata-editablegrid.js', function(req, res) {
  res.sendFile(__dirname + '/public/inputdata-editablegrid.js');
});
app.get('/lib/editablegrid/editablegrid.js', function(req, res) {
  res.sendFile(__dirname + '/lib/editablegrid/editablegrid.js');
});
app.get('/lib/editablegrid/editablegrid_renderers.js', function(req, res) {
  res.sendFile(__dirname + '/lib/editablegrid/editablegrid_renderers.js');
});
app.get('/lib/editablegrid/editablegrid_editors.js', function(req, res) {
  res.sendFile(__dirname + '/lib/editablegrid/editablegrid_editors.js');
});
app.get('/lib/editablegrid/editablegrid_validators.js', function(req, res) {
  res.sendFile(__dirname + '/lib/editablegrid/editablegrid_validators.js');
});
app.get('/lib/editablegrid/editablegrid_utils.js', function(req, res) {
  res.sendFile(__dirname + '/lib/editablegrid/editablegrid_utils.js');
});
app.get('/lib/editablegrid/images/bullet_arrow_down.png', function(req, res) {
  res.sendFile(__dirname + '/lib/editablegrid/images/bullet_arrow_down.png');
});
app.get('/lib/editablegrid/images/bullet_arrow_up.png', function(req, res) {
  res.sendFile(__dirname + '/lib/editablegrid/images/bullet_arrow_up.png');
});
app.get('/assets/css/editablegrid.css', function(req, res) {
  res.sendFile(__dirname + '/public/assets/css/editablegrid.css');
});

app.get('/data/neuralnetwork.json', function(req, res) {
  res.sendFile(__dirname + '/data/neuralnetwork.json');
});
app.get('/assets/css/bootstrap.css', function(req, res) {
  res.sendFile(__dirname + '/public/assets/css/bootstrap.css');
});
app.get('/assets/js/bootstrap.min.js', function(req, res) {
  res.sendFile(__dirname + '/public/assets/js/bootstrap.min.js');
});
app.get('/assets/css/style.css', function(req, res) {
  res.sendFile(__dirname + '/public/assets/css/style.css');
});
app.get('/assets/css/style-responsive.css', function(req, res) {
  res.sendFile(__dirname + '/public/assets/css/style-responsive.css');
});
app.get('/assets/font-awesome/css/font-awesome.css', function(req, res) {
  res.sendFile(__dirname + '/public/assets/font-awesome/css/font-awesome.css');
});
app.get('/assets/js/common-scripts.js', function(req, res) {
  res.sendFile(__dirname + '/public/assets/js/common-scripts.js');
});
app.get('/assets/js/jquery.dcjqaccordion.2.7.js', function(req, res) {
  res.sendFile(__dirname + '/public/assets/js/jquery.dcjqaccordion.2.7.js');
});
app.get('/assets/lineicons/style.css', function(req, res) {
  res.sendFile(__dirname + '/public/assets/lineicons/style.css');
});
// Extra
app.get('/assets/js/chart-master/Chart.js', function(req, res) {
  res.sendFile(__dirname + '/public/assets/js/chart-master/Chart.js');
});
app.get('/assets/font-awesome/fonts/fontawesome-webfont.ttf', function(req, res) {
  res.sendFile(__dirname + '/public/assets/font-awesome/fonts/fontawesome-webfont.ttf');
});
app.get('/assets/font-awesome/fonts/fontawesome-webfont.woff', function(req, res) {
  res.sendFile(__dirname + '/public/assets/font-awesome/fonts/fontawesome-webfont.woff');
});

io.sockets.on('connection', function(socket) {
  socket.on('refresh-graph', function(nnParameters) {
    console.log(nnParameters);
    runNN(function(nnJSON) {
      io.sockets.emit('refresh-graph', nnJSON);
    }, nnParameters);
  });
});
