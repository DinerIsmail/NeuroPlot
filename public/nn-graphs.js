/*
  These are the functions that are called to draw the graphs which show
  how the neural network is performing
*/

function drawGraphs(trainingStats) {
  // If there's no training info to process, don't show anything
  if (trainingStats.length == 0 || trainingStats.data.length == 0) return;

  var errorsArray = trainingStats.data.map(function(singleStat) { return singleStat.error });

  $("#error-viz-container").highcharts({
    // chart: {
    //   type: 'areaspline'
    // },
    title: {
      text: "Global Error"
    },
    legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 150,
            y: 100,
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
      }
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
