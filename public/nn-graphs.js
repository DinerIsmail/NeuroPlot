/*
  These are the functions that are called to draw the graphs which show
  how the neural network is performing
*/

function drawErrorGraph(trainingStats) {
  // If there's no training info to process, don't show anything
  if (trainingStats.length == 0 || trainingStats.data.length == 0) return;

  var errorsArray = trainingStats.data.map(function(singleStat) { return Math.round(singleStat.error * 1000)/1000 });

  $("#error-viz-container").highcharts({
    title: {
      text: "Global Error"
    },
    legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 270,
            y: 50,
            floating: true,
            borderWidth: 1,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
    },
    xAxis: {
      title: {
        text: "Epoch"
      },
      tickInterval: trainingStats.logPeriod
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
    series: [{
      name: 'Training Error',
      data: errorsArray
    }]
  })
}
