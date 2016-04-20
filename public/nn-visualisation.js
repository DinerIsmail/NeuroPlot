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
    width = 1000,
    nodeRadius = 30;
var outerPad = 0.1,
    pad = 0;
var tempColor;

var nnSpec = nnDataTest;
var layerCount = 0;

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

var tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0)

function draw() {
  clear();
  var nnConnections = [];

  var drawingLayer1 = svg.append('g');
  var drawingLayer2 = svg.append('g');

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

    drawingLayer2.selectAll("circle.layer"+layerId).data(layerNodes)
            .enter()
            .append("circle")
              .style("fill", "#268BD2")
              .transition()
                .each("start", function() { d3.select(this).attr("r", 10) })
                .attr("r", nodeRadius)
                .duration(750)
                .ease('elastic')
              .attr("cy", function(d, i) { return yPos(layerId)(i) + height/(layer.size)/2 })
              .attr("cx", function(d) { return xPos(layerId) })
              .attr("class", function(d, i) { return "node"+layerId+i + " node"; })

  });

  if (nnConnections.length > 0) {
    var allWeights = nnConnections.map(function(conn) { return conn.weight; });
    var minWeight = allWeights.min();
    var maxWeight = allWeights.max();

    nnConnections.forEach(function(connection) {
      var lineData = [{x: connection.x1, y: connection.y1},
                      {x: connection.x2, y: connection.y2}];

      var path = drawingLayer1.append("path").classed("connection", true)
              .attr("stroke", function() { return connection.weight >= 0 ? "#3FBF7F" : "#D54848"; })
              .attr("stroke-width", function(d, i) {
                return strokeWidthFunction(Math.abs(connection.weight), minWeight, maxWeight)(Math.abs(connection.weight));
              })
              .attr("fill", "none")
              .attr("d", lineFunction(lineData));

      path.on('mouseover', function(d) {
        var connectionWeight = Math.round(connection.weight * 1000) / 1000;

        tooltip.transition().duration(100)
          .style('opacity', .9)
        tooltip.html(connectionWeight)
          .style('left', (d3.event.pageX - 35) + 'px')
          .style('top', (d3.event.pageY) + 'px')

        // tempColor = this.style.stroke;
        // d3.select(this)
        //   .transition().delay(100).duration(200)
        //   .style('stroke', '#C61C6F')
        //   .style('opacity', 1)

      }).on('mouseout', function(d) {
        tooltip.transition().duration(100)
          .style('opacity', 0)

        // d3.select(this)
        //   .transition().delay(100).duration(200)
        //   .style('stroke', tempColor)
        //   .style('opacity', 1)
      });
    });
  }
}

function clear() {
  $(".neuralnetwork").empty();
}

draw();



$(document).ready(function() {
  var socket = io();
  var refreshForm = $("#refresh-graph");
  var learningRateTextBox = $("[name='learning-rate']");
  var errorThresholdTextBox = $("[name='error-threshold']");
  var iterationsTextBox = $("[name='iterations']");
  var addLayerButton = $(".add-hidden-layer");
  var hiddenLayerSizesArea = $(".hidden-layers-sizes-area");
  var layerCountLabel = $(".layer-count");
  var feedCustomDataButton = $("[name='feed-custom-data']");
  var parameters = {};

  refreshForm.submit(function(e) {
    e.preventDefault();
    parameters.learningRate = learningRateTextBox.val();
    parameters.errorThreshold = errorThresholdTextBox.val();
    parameters.iterations = iterationsTextBox.val();
    parameters.layerSizes = getHiddenLayerSizes();
    socket.emit('refresh-graph', parameters);
  });

  socket.on('refresh-graph', function(nnJSON) {
    nnSpec = nnJSON;
    draw();
  });

  addLayerButton.click(function() {
    layerCount++;
    layerCountLabel.text(layerCount);

    var layerSizeDiv = $("<div>").addClass('layer'+layerCount);
    var removeLayerButton = $("<button>").addClass("remove-layer").attr("style", "display: inline").appendTo(layerSizeDiv);
    var removeLayerIcon = $("<i>").addClass("fa fa-minus").attr("aria-hidden", "true").appendTo(removeLayerButton);
    var input = $("<input>").addClass("layer-size-input").attr("type", "number").attr("value",'1').attr("min", "0").attr("step", "1").attr("style", "display: inline").appendTo(layerSizeDiv);
    hiddenLayerSizesArea.append(layerSizeDiv);

    removeLayerButton.click(function() {
      $("div."+this.parentNode.className).remove();
      layerCount--;
      layerCountLabel.text(layerCount);
    });
  });

  feedCustomDataButton.click(function() {
    parameters.customData = editableGrid.getFormattedData();
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
