//In Express, routes are wrapped in a function, which takes the Express 
//instance and a database as arguments

module.exports = function (app, db) {

	var ObjectID = require('mongodb').ObjectID;
	var bodyParser = require('body-parser');
	var jsonParser = bodyParser.json();

	app.post('/urls', jsonParser, (req, res) => {
		//const url = {url: req.body.url};
		if (req.body && req.body.addrURL) {
			db.collection('url').insert(req.body, (err, result) => {
				if (err) {
					res.send({ 'error': 'An error has occurred' });
				} else {
					// res.statusCode = 600;
					// res.setHeader('Content-Type', 'application/json');
					// res.setHeader('x-VarunHeader', 'silly');
					res.send(result.ops[0]);
				}
			});
		} else {
			res.send({ 'error': 'Payload empty' });
		}

	});

	app.get('/urls', (req, res) => {
		/*
		const id = req.params.id;
		const details = { '_id': new ObjectID(id) };
		db.collection('url').findOne(details, (err, item) => {
			if (err) {
				res.send({ 'error': 'An error has occurred' });
			} else {
				res.send(item);
			}
		});
		*/

		var query = req.query.search;

		var responseList = {'response': ['www.nba.com', 'www.cnn.com']};
		res.send(responseList);
	});

};