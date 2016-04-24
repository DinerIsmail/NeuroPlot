// Augmenting the Array prototype with max, min and insert functions
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};
Array.prototype.min = function() {
  return Math.min.apply(null, this);
};
Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item);
  return this;
};

var height = 600,
    width = 1300,
    nodeRadius = 30;
var outerPad = 0.1,
    pad = 0;
var tempColor;

var nnSpec = nnDataTest;
var nnConnections = [];
var layerCount = $('.hidden-layers-sizes-area div').length;

var xPos = d3.scale.linear()
                .domain([0, nnSpec.layers.length])
                .range([50, width-50]);

var yPos = function(layerId) {
  return d3.scale.ordinal()
              .domain(d3.range(0, nnSpec.layers[layerId].size))
              .rangeBands([0, height]);
}

var lineFunction = d3.svg.line()
                        .x(function(d) { return d.x })
                        .y(function(d) { return d.y })
                        .interpolate("linear")

var strokeWidthFunction = function(weight, minWeight, maxWeight) {
  return d3.scale.linear()
              .domain([minWeight, maxWeight])
              .range([2, 8]);
}

var svg = d3.select(".neuralnetwork")
    .attr("width", width)
    .attr("height", height);
var connectionsLayer = svg.append('g');
var nodesLayer = svg.append('g');

var tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0)

function drawNodes() {
  var layers = nnSpec.layers;
  layers.forEach(function(layer, layerId) {

    var layerNodes = [];
    for (var i = 0; i < layer.size; i++) {
      layerNodes.push(layer[i]);
      if (layerId > 0) {
        // For second layer and forth, start building nnConnections array
        for (var j = 0; j < Object.keys(layer[i].weights).length; j++) {
          var connection = {
            "x1": xPos(layerId-1),
            "y1": yPos(layerId-1)(j) + height/(nnSpec.layers[layerId-1].size)/2,
            "x2": xPos(layerId),
            "y2": yPos(layerId)(i) + height/layer.size/2,
            "weight": layer[i].weights[j]
          }

          nnConnections.push(connection);
        }
      }
    }

    var nodes = nodesLayer.selectAll("circle.layer"+layerId).data(layerNodes);

    var nodeEnter = nodes.enter()
      .append("g")
      .attr("transform", function(d, i) { return "translate("+ xPos(layerId) +","+ parseInt(yPos(layerId)(i) + height/(layer.size)/2) + ")" });

    var circle = nodeEnter.append("circle")
      .style("fill", "#268BD2")
      .attr("class", function(d, i) { return "node"+layerId+i + " node"; })
      .attr("r", 10)
        .transition()
        .attr("r", nodeRadius)
        .duration(750)
        .ease('elastic');

    nodeEnter.append("text")
      .attr("dx", function(d) { return -13; })
      .attr("fill", "#fff")
      .text(function(d, i) { return layer[i].output ? Math.round(layer[i].output * 100)/100 : "" });
  });

  drawConnections();
}

function drawConnections() {
  if (nnConnections.length > 0) {
    var allWeights = nnConnections.map(function(conn) { return conn.weight; });
    var minWeight = allWeights.min();
    var maxWeight = allWeights.max();

    nnConnections.forEach(function(connection) {
      var lineData = [{x: connection.x1, y: connection.y1},
                      {x: connection.x2, y: connection.y2}];

      connectionsLayer.append("path").classed("connection", true)
              .attr("stroke", function() { return connection.weight >= 0 ? "#3FBF7F" : "#D54848"; })
              .attr("stroke-width", 2)
              .transition()
              .duration(100)
              .attr("stroke-width", function(d, i) {
                return strokeWidthFunction(Math.abs(connection.weight), minWeight, maxWeight)(Math.abs(connection.weight));
              })
              .attr("fill", "none")
              .attr("d", lineFunction(lineData));

      // path.on('mouseover', function(d) {
      //   var connectionWeight = Math.round(connection.weight * 1000) / 1000;
      //
      //   tooltip.transition().duration(100)
      //     .style('opacity', .9)
      //   tooltip.html(connectionWeight)
      //     .style('left', (d3.event.pageX - 35) + 'px')
      //     .style('top', (d3.event.pageY) + 'px')
      //
      // }).on('mouseout', function(d) {
      //   tooltip.transition().duration(100)
      //     .style('opacity', 0)
      // });
    });
  }
}

function updateConnections() {
  $(".neuralnetwork g").first().empty();
  nnConnections = [];

  var layers = nnSpec.layers;
  layers.forEach(function(layer, layerId) {

    for (var i = 0; i < layer.size; i++) {

      if (layerId > 0) {
        // For second layer and forth, start building nnConnections array
        for (var j = 0; j < Object.keys(layer[i].weights).length; j++) {
          var connection = {
            "x1": xPos(layerId-1),
            "y1": yPos(layerId-1)(j) + height/(nnSpec.layers[layerId-1].size)/2,
            "x2": xPos(layerId),
            "y2": yPos(layerId)(i) + height/layer.size/2,
            "weight": layer[i].weights[j]
          }

          nnConnections.push(connection);
        }
      }
    }
  });

  drawConnections();
}

function clearVis() {
  $(".neuralnetwork g").empty();
}

$(document).ready(function() {
  var socket = io();

  var refreshForm = $("#refresh-viz");
  var learningRateTextBox = $("[name='learning-rate']");
  var errorThresholdTextBox = $("[name='error-threshold']");
  var iterationsTextBox = $("[name='iterations']");
  var addLayerButton = $(".add-hidden-layer");
  var hiddenLayerSizesArea = $(".hidden-layers-sizes-area");
  var layerCountLabel = $(".layer-count");
  var feedCustomDataButton = $("[name='feed-custom-data']");
  var datasetSelect = $("[name='dataset-select']");
  var loadingSpinner = $(".loading-spinner");

  var testDataInput = $(".test-data");
  var testDataButton = $(".test-data-button");

  var parameters = {};

  refreshForm.submit(function(e) {
    e.preventDefault();

    refreshParameters();

    loadingSpinner.addClass("visible").removeClass("hidden");
    socket.emit('refresh-viz', parameters);
    clearVis();
    if ($("#error-viz-container").highcharts()) {
      $("#error-viz-container").highcharts().series[0].setData([]);
    }
  });

  function refreshParameters() {
    parameters.learningRate = learningRateTextBox.val();
    parameters.errorThreshold = errorThresholdTextBox.val();
    parameters.iterations = iterationsTextBox.val();
    parameters.layerSizes = getHiddenLayerSizes();
    parameters.dataset = datasetSelect.val();

    if (datasetSelect.val() == "custom") {
      parameters.customData = editableGrid.getFormattedData();
    }
  }

  // Refresh the nn viz on refresh
  $("#refresh-viz").submit();
  drawErrorGraph();

  socket.on('refresh-viz', function(nnJSON) {
    //nnSpec = nnJSON;
    //draw();
  });

  socket.on('draw-vis-initial', function(trainingData) {
    nnSpec = trainingData.nnSpec;
    loadingSpinner.addClass("hidden").removeClass("visible");
    drawNodes();
  });

  socket.on('refresh-graph-live', function(trainingDataLive) {
    addErrorPoints(trainingDataLive.errorData);
    nnSpec = trainingDataLive.nnSpec;
    updateConnections();
  });

  addLayerButton.click(function() {
    layerCount++;
    layerCountLabel.text(layerCount);

    var layerSizeDiv = $("<div>").addClass('layer'+layerCount);
    var removeLayerButton = $("<button>").addClass("remove-layer").attr("style", "display: inline").appendTo(layerSizeDiv);
    var removeLayerIcon = $("<i>").addClass("fa fa-minus").attr("aria-hidden", "true").appendTo(removeLayerButton);
    var input = $("<input>").addClass("layer-size-input").attr("type", "number").attr("value",'1').attr("min", "1").attr("step", "1").attr("style", "display: inline").appendTo(layerSizeDiv);
    hiddenLayerSizesArea.append(layerSizeDiv);

    removeLayerButton.click(function() {
      removeLayerDiv(this);
    });
  });

  $('.remove-layer').click(function() {
    removeLayerDiv(this);
  });

  function removeLayerDiv(theLayerObj) {
    $("div."+theLayerObj.parentNode.className).remove();
    layerCount--;
    layerCountLabel.text(layerCount);
  }

  testDataButton.click(function() {
    // This only expects the format to be like: 1,2,3 which it turns into an array and sends it as an input to the ANN
    if (testDataInput.val() == "") {
      console.log("The test data field is empty");
    }

    var inputDataArray = testDataInput.val().split(",");

    refreshParameters();

    socket.emit("test-data", {
      "testData": inputDataArray,
      "nnParameters": parameters
    });
  });

  datasetSelect.change(function() {
    switch($(this).val()) {
      case "xor":
        testDataInput.val("1,0");
        break;
      default:
        testDataInput.val("");
        console.log("Dataset type unrecognized!");
        break;
    }
  });
});

function getHiddenLayerSizes() {
  var layerSizeInputs = $(".layer-size-input").toArray();
  var layerSizes = [];
  layerSizeInputs.forEach(function(layerSizeInput) {
    layerSizes.push(parseInt(layerSizeInput.value));
  });

  return layerSizes.length > 0 ? layerSizes : null;
}
