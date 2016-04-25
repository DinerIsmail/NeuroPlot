/*
  These are the functions that are called to draw the graphs which show
  how the neural network is performing
*/

var errorChart;
var clearSavedButton = $("[name='clear-saved']");
var saveEnabledCheckbox = $("[name='save-enabled']");
var currentSeries = 0;
var seriesOptions = [{
  name: "1",
  data: [],
  color: "#268BD2"
}];
var firstSeriesOptions = {};

saveEnabledCheckbox.change(function() {
  if ($(this).is(":checked")) {
    currentSeries = 1;

    clearSavedButton.removeAttr('disabled');
  } else {
    currentSeries = 0;
  }
});

clearSavedButton.click(function() {
  clearSavedButton.attr('disabled', 'disabled');
  errorChart.series[1].remove(true);
  saveEnabledCheckbox.prop('checked', false);
  currentSeries = 0;
});

function drawErrorGraph(trainingStats) {
  // If there's no training info to process, don't show anything
  //if (trainingStats.length == 0 || trainingStats.data.length == 0) return;

  var options = {
    chart: {
      renderTo: 'error-viz-container'
    },
    title: {
      text: 'RMS Error'
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: 0,
      y: 50,
      floating: true,
      borderWidth: 1,
      backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
    },
    xAxis: {
      title: {
        text: "Iteration"
      },
      tickInterval: 10
    },
    yAxis: {
      title: {
        text: "Error"
      },
      plotLines: [{
        color: 'black',
        width: 2,
        value: 0.005,
        dashStyle: 'longdash',
        label: {
          text: "Error Threshold"
        }
      }],
      min: 0
    },
    plotOptions: {
      areaspline: {
          fillOpacity: 0.5
      }
    },
    series: []
  };

  if (currentSeries == 0) seriesOptions[0].data = [];
  options.series.push(seriesOptions[0]);
  if (currentSeries > 0) {
    options.series.push({
      name: parseInt(options.series.length+1),
      data: [],
      color: "#3FBF7F"
    })
  }

  errorChart = new Highcharts.Chart(options);
}

function addErrorPoints(newPointsArray) {
  for (var i = 0; i < newPointsArray.length; i++) {
    errorChart.series[currentSeries].addPoint({
      x: newPointsArray[i].iterations,
      y: Math.round(newPointsArray[i].error * 1000)/1000
    }, false);
  }

  errorChart.redraw();
}
