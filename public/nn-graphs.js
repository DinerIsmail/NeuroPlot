/*
  These are the functions that are called to draw the graphs which show
  how the neural network is performing
*/

function drawErrorGraph(trainingStats) {
  // If there's no training info to process, don't show anything
  //if (trainingStats.length == 0 || trainingStats.data.length == 0) return;

  //var errorsArray = trainingStats.data.map(function(singleStat) { return Math.round(singleStat.error * 1000)/1000 });
  //var newErrorPoint = Math.round(trainingStats.error * 1000)/1000;

  $("#error-viz-container").highcharts({
    // chart: {
    //   events: {
    //     load: function() {
    //       var series = this.series[0];
    //
    //       setInterval(function () {
    //                     var x = (new Date()).getTime(), // current time
    //                         y = Math.round(Math.random() * 100);
    //                     series.addPoint([x, y], true, true);
    //                 }, 10);
    //     }
    //   }
    // },
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
    series: [{
      name: 'Training Error',
      data: [] //errorsArray
    }],
    exporting: {
      enabled: false
    }
  })
}

function addErrorPoints(newPointsArray) {
  var chart = $("#error-viz-container").highcharts();

  for (var i = 0; i < newPointsArray.length; i++) {
    chart.series[0].addPoint({
      x: newPointsArray[i].iterations,
      y: Math.round(newPointsArray[i].error * 1000)/1000
    }, false);
  }

  chart.isDirty = true;
  chart.redraw();
  chart.reflow();
}
