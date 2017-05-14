var express = require('express');
var app = express();

var bodyparser = require('body-parser');
app.use(bodyparser.json());

app.get('/', function (request, response) {
	response.status(200).send('API is ready to receive requests');
});

var topics;
app.get('/api/topics', function (request, response) {
	topics = topics || require('./topics.json');
	response.status(200)
		.send(topics.map(function (topic) {
			return {
				id: topic.id,
				topic: topic.topic,
				url: request.protocol + '://' + request.get('host') + '/api/topic/' + topic.id
			}
		}));
});

app.get('/api/topic/:id', function (request, response) {
	var id = parseInt(request.params.id);
	if (!Number.isInteger(id)) {
		response.status(500)
			.send('Bad data received: expected a topic id but was not found');
		return;
	}
	topics = topics || require('./topics.json');
	var results = topics.filter(function (data) {
		return data.id === id;
	});
	if (results.length === 0) {
		response.status(404)
			.send('There was no topic found for id: ' + id);
		return;
	}
	var topic = results[0];
	response.send(topic);
});

app.get('/api/topic/:id/:name', function (request, response) {
	var id = parseInt(request.params.id);
	if (!Number.isInteger(id)) {
		response.status(500)
			.send('Bad data received: expected a topic id but was not found');
		return;
	}
	topics = topics || require('./topics.json');
	var results = topics.filter(function (data) {
		return data.id === id;
	});
	if (results.length === 0) {
		response.status(404)
			.send('There was no topic found for id: ' + id);
		return;
	}

	var topic = results[0];
	var name = request.params.name;

	results = topic.tutorials.filter(function (data) {
		return data.name === name;
	});

	if (results.length === 0) {
		response.status(404)
			.send('There was no tutorial found with the name: ' + name);
		return;
	}

	response.send({
		id: topic.id,
		topic: topic.topic,
		tutorials: results
	});
});

app.post('/api/topic', function (request, response) {
	topics = topics || require('./topics.json');
	var topic = request.body;
	var results = topics.filter(function (t) {
		return t.topic === topic.topic;
	});

	if (results.length > 0) {
		response.status(400)
			.send('Cannot add a topic that already exists');
		return;
	}

	topic.id = topics.length + 1;
	//Data must obviously be validated before being persisted	
	topics.push(topic);
	response.status(200).send({
		id: topic.id,
		url: request.protocol + '://' + request.get('host') + '/api/topic/' + topic.id
	});
});

app.get('*', function(request, response){
    response.status(400)
	.send('No suitable handler found for the request');
});

app.post('*', function(request, response){
    response.status(400)
	.send('No suitable handler found for the request');
});

app.delete('*', function(request, response){
    response.status(400)
	.send('No suitable handler found for the request');
});

var port = 8989;
app.listen(port, function () {
	console.log("SERVER IS LISTENING ON PORT: " + port);
});