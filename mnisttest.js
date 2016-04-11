var brain = require('brain');
var fs = require('fs');

var getMnistData = function(content) {
	var lines = content.toString().split('\n');

	var data = [];
	for (var i = 0; i < lines.length; i++) {
		var input = lines[i].split(',').map(Number);

		var output = Array.apply(null, Array(10)).map(Number.prototype.valueOf, 0);
		output[input.shift()] = 1;

		data.push({
			input: input,
			output: output
		});
	}

	return data;
};

fs.readFile(__dirname + '/training.csv', function (err1, trainContent) {
	fs.readFile(__dirname + '/test.csv', function (err2, testContent) {
		var trainData = getMnistData(trainContent);

		console.log('Got ' + trainData.length + ' samples');

		var net = new brain.NeuralNetwork({hiddenLayers: [784, 392, 196]});

		net.train(trainData, {
			errorThresh: 0.045,
			log: true,
			logPeriod: 1,
			learningRate: 0.1
		});

		// Test it out
		var testData = getMnistData(testContent);

		var numRight = 0;

		console.log('Neural Network tests:');
		for (i = 0; i < testData.length; i++) {
			var resultArr = net.run(testData[i].input);
			var result = resultArr.indexOf(Math.max.apply(Math, resultArr));
			var actual = testData[i].output.indexOf(Math.max.apply(Math, testData[i].output));

			var str = '(' + i + ') GOT: ' + result + ', ACTUAL: ' + actual;
			str += result === actual ? '' : ' -- WRONG!';

			numRight += result === actual ? 1 : 0;

			console.log(str);
		}

		console.log('Got', numRight, 'out of 350, or ' + String(100*(numRight/350)) + '%');

		// Save the network weights
		var json = net.toJSON();

		fs.writeFile(__dirname + '/weights.json', JSON.stringify(json), function(err) {
			if (err) {
				return console.log(err);
			}

			console.log('DONE - Saved results to file.');
		}); 
	});
});