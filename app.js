var brain = require('brain');
var datamanager = require('./src/utils/datamanager');

var net = new brain.NeuralNetwork({
    hiddenLayers: [3, 4]
});

function getNNJson(callback) {
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
