//In Express, routes are wrapped in a function, which takes the Express 
//instance and a database as arguments

module.exports = function (app, db) {

	var ObjectID = require('mongodb').ObjectID;
	var bodyParser = require('body-parser');
	var jsonParser = bodyParser.json();
	var inspector = require('schema-inspector');

	// Sanitization Schema
	var userSelectionSanitization = {
		type: 'object',
		properties: {
			userId: { type: 'string', rules: ['trim'] },
			addrURL: { type: 'string'},
			title: {type: 'string'},
			highlight: { type: 'string'},
			label: {type: 'string', rules: ['trim', 'lower'], optional: 'true', def: 'general'}
		}
	};

	// Validation schema
	var userSelectionValidation = {
		type: 'object',
		properties: {
			userId: { type: 'string', minLength: 1 },
			addrURL: { type: 'string', minLength: 1, pattern: 'url'},
			title: {type: 'string', minLength: 1},
			highlight: { type: 'string', minLength: 1},
			label: {type: 'string', minLength: 1}
		}
	};

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
		var test = [];

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


		// var item1 = {
		// 	"addrURL": "https://www.theverge.com/2018/6/11/17448702/ford-self-driving-car-food-delivery-miami-postmates",
		// 	"title": "Ford\u2019s \u2018self-driving\u2019 vans are now delivering food in Miami - The Verge",
		// 	"highlight": "Ford has been using Miami as a test bed for its self-driving vehicles since earlier this year. And more recently, the auto giant joined with Postmates to see how people ordering takeout food would interact with an autonomous delivery van."
		// };

		// test.push(item1);

		// var item2 = {
		// 	"addrURL": "https://medium.com/@tommycm/terrifying-fish-from-hell-an-essay-about-lampreys-733226c8e14a",
		// 	"title": "Lamprey: The World\u2019s Most Terrifying Fish \u2013 Tom Mitchell \u2013 Medium",
		// 	"highlight": "A nice retort, sure, but less comprehensible if you\u2019ve ever seen a lamprey. There are few animals less deserving of an owner\u2019s tears. In fact, the only connection you\u2019re likely to make with one of these fish is if it sinks its many hundreds of teeth into your flesh."
		// }

		// test.push(item2);

		// var item3 = {
		// 	"addrURL": "http://www.nba.com/article/2018/06/12/report-toronto-raptors-hire-nick-nurse-new-coach",
		// 	"title": "Reports: Toronto Raptors hiring Nick Nurse as next coach | NBA.com",
		// 	"highlight": "The Toronto Raptors didn't have to look far to name their next coach. ESPN's Adrian Wojnarowski reports that the Raptors are hiring current Raptors assistant Nick Nurse as their new coach."
		// }

		// test.push(item3);
		// res.send(allDocs);
		/*
		var response = { 'urlList': ['http://www.nba.com', 'http://www.cnn.com', 'http://google.com', 'http://gmail.com', 'http://something.com', 'http://example.com'] };
		res.send(response);
		*/
	});

};