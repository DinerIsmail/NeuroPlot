var height = 600,
    width = 1000,
    nodeRadius = 30;
var outerPad = 0.1,
    pad = 0;

var nnData = nnDataTest;

var xPos = d3.scale.linear()
                .domain([0, nnData.layers.length])
                .range([50, width-50]);

var yPos = function(layerId) {
  return d3.scale.ordinal()
              .domain(d3.range(0, nnData.layers[layerId].size))
              .rangeBands([0, height]);
}

var svg = d3.select(".neuralnetwork")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#C9D7D6");

function draw() {
  clear();

  var layers = nnData.layers;
  layers.forEach(function(layer, layerId) {

    var layerNodes = [];
    for (var i = 0; i < layer.size; i++) {
      layerNodes.push(layer[i]);
    }

    svg.selectAll("circle.layer"+layerId).data(layerNodes)
            .enter()
            .append("circle").classed("layer"+layerId, true)
              .style("fill", "#268BD2")
              .attr("r", nodeRadius)
              .attr("cy", function(d, i) { return yPos(layerId)(i) + height/(layer.size)/2 })
              .attr("cx", function(d) { return xPos(layerId) })
              .attr("class", function(d, i) { return "node"+layerId+i; })
              .classed("node", true)
  });
}

function clear() {
  $(".neuralnetwork").empty();
}

draw();

// -------------- Socket.IO --------------------------------

$(document).ready(function() {
  var socket = io();
  var $refreshForm = $("#refresh-graph");

  $refreshForm.submit(function(e) {
    e.preventDefault();
    socket.emit('refresh-graph');
  });

  socket.on('refresh-graph', function(nnJSON) {
    nnData = nnJSON;
    draw();
  });
});




//-----------------------------------------------------------

var nodesCoordinates = [];

function getNodeCoordinates(node) {
  var nodeCoords = findNodeCircle(node[0], node[1]);
  return {
    x: nodeCoords[0],
    y: nodeCoords[1]
  }
}

function findNodeCircle(layerId, nodeId) {
  var nodeCircle = $(".node"+layerId+nodeId);
  return [nodeCircle.attr("cx"), nodeCircle.attr("cy")];
}

var lineFunction = d3.svg.line()
                        .x(function(d) { return d.x })
                        .y(function(d) { return d.y })
                        .interpolate("linear")

// var connections = nnData.connections;
// connections.forEach(function(connection, connectionId) {
//   var lineData = [getNodeCoordinates(connection.from),
//                   getNodeCoordinates(connection.to)];
//   d3.select(".neuralnetwork")
//           .append("path").classed("connection", true)
//           .attr("stroke", "white")
//           .attr("stroke-width", 2)
//           .attr("fill", "none")
//           .attr("d", lineFunction(lineData))
// });
