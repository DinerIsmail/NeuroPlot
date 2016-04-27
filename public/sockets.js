function setupSockets(socket) {
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

  socket.on('testing-finished', function(testingResults) {
    testResultsCorrect.html(testingResults.correct);
    testResultsWrong.html(testingResults.wrong);
  });
}