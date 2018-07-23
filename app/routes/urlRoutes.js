//In Express, routes are wrapped in a function, which takes the Express 
//instance and a database as arguments

module.exports = function (app, db) {

	var ObjectID = require('mongodb').ObjectID;
	var bodyParser = require('body-parser');
	var jsonParser = bodyParser.json();
	var inspector = require('schema-inspector');
	var fetch = require('node-fetch');

	// Sanitization Schema
	var userSelectionSanitization = {
		type: 'object',
		properties: {
			userId: { type: 'string', rules: ['trim'] },
			addrURL: { type: 'string' },
			title: { type: 'string' },
			highlight: { type: 'string' },
			label: { type: 'string', rules: ['trim', 'lower'], optional: 'true', def: 'general' }
		}
	};

	// Validation schema
	var userSelectionValidation = {
		type: 'object',
		properties: {
			userId: { type: 'string', minLength: 1 },
			addrURL: { type: 'string', minLength: 1, pattern: 'url' },
			title: { type: 'string', minLength: 1 },
			highlight: { type: 'string', minLength: 1 },
			label: { type: 'string', minLength: 1 }
		}
	};

	var searchSanitization = {
		type: 'object',
		properties: {
			search: { type: 'string', rules: ['trim'] },
			token: { type: 'string' }
		}
	}

	var searchValidation = {
		type: 'object',
		properties: {
			search: { type: 'string', minLength: 1 },
			token: { type: 'string', minLength: 1 }
		}
	}

	//adds an entry to the database
	app.post('/urls', jsonParser, (req, res) => {
		//const url = {url: req.body.url};
		if (req.body) {
			inspector.sanitize(userSelectionSanitization, req.body);
			var result = inspector.validate(userSelectionValidation, req.body);
			if (result.valid) {
				db.collection('url').insert(req.body, (err, result) => {
					if (err) {
						res.statusCode = 500;
						res.send({ 'error': 'An error has occurred' });
					} else {
						// res.statusCode = 600;
						// res.setHeader('Content-Type', 'application/json');
						// res.setHeader('x-VarunHeader', 'silly');
						res.send(result.ops[0]);
					}
				});
			} else {
				res.statusCode = 400;
				res.send(result.error[0]);
			}
		} else {
			res.statusCode = 400;
			res.send({ 'error': 'Payload empty' });
		}

	});

	//Searches database for a search request
	app.get('/urls', (req, res) => {
		inspector.sanitize(searchSanitization, req.query);
		var result = inspector.validate(searchValidation, req.query);
		if (result.valid) {
			var query = req.query.search;
			var token = req.query.token;
			token = parseInt(token);

			const col = db.collection("users");
			var mongoQuery = {
				'token': {$eq: token}
			};

			col.findOne(mongoQuery).then((result) => {
				console.log(result);
				if (result == null) {
					res.statusCode = 401;
					res.send({ "error": "Unauthorized access to server (invalid token)" });
				} else {
					const col = db.collection("url");
					var mongoQuery = {
						$text: {
							$search: query
						}
					};
	
					var exclude = {
						_id: 0
					};
	
					col.find(mongoQuery, exclude).toArray(function (err, docs) {
						console.log(docs);
						res.send(docs);
					});
				}
			});
		} else {
			res.statusCode = 400;
			res.send(result.error[0]);
		}
	});

	//creates and returns a token to validate requests to server
	app.get('/create-token', (req, res) => {
		var oauthToken = req.query.oauthToken;

		let init = {
			method: 'GET',
			async: true,
			headers: {
				Authorization: 'Bearer ' + oauthToken,
				'Content-Type': 'application/json'
			},
			'contentType': 'json'
		};

		fetch(
			'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos&key=AIzaSyCjOXjhZ-46NNQIYE5R0TgG6XvBrWd5JMk',
			init)
			.then((response) => response.json())
			.then(function (data) {
				console.log(data);
				if (data.error) {
					throw new Error("Oauth token is not valid");
				}

				var userID = 'google:' + data.names[0].metadata.source.id;
				var data = {
					'user': userID,
					'token': Date.now()
				}

				db.collection('users').insert(data, (err, result) => {
					if (err) {
						res.statusCode = 500;
						res.send({ 'error': 'An error has occurred' });
					} else {
						res.send(result.ops[0]);
					}
				});
			}).catch((error) => {
				res.statusCode = 401;
				res.send({ 'error': error });
			});
	});

	//remove a token from the server when the user logs out
	app.delete('/delete-token', (req, res) => {
		var token = req.query.token;
		token = parseInt(token);

		const col = db.collection("users");
		var mongoQuery = {
			'token': { $eq: token }
		};

		col.findOneAndDelete(mongoQuery).then((result) => {
			if (result.value != null) {
				res.send(result);
			} else {
				//token doesn't exist
				res.statusCode = 400;
				res.send(result);
			}
		});

	});
};