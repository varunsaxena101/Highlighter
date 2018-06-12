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
		var test = [];

		var cursor = db.collection('url').find();
		cursor.each(function (err, item) {
			if (err) {
				console.log(err);
			} else {
				test.push(item);
			}
		});

		var item1 = {
			"addrURL": "https://en.wikipedia.org/wiki/Apache_Solr",
			"title": "Apache Solr",
			"highlight": "written in Java, from the Apache Lucene project. Its major features include full-text search, hit highlighting, faceted search, real-time indexing, dynamic clustering, database integration, NoSQL features[2] and rich document (e.g., Word, PDF) handling"
		};

		test.push(item1);

		var item2 = {
			"addrURL": "https://stackoverflow.com/questions/1057059/how-to-get-the-title-of-html-page-with-javascript",
			"title": "How to get the title of a page",
			"highlight": "How can I get the title of an"
		}

		test.push(item2);

		var item3 = {
			"addrURL": "http://www.nba.com/article/2018/06/12/report-toronto-raptors-hire-nick-nurse-new-coach",
			"title": "Reports: Toronto Raptors hiring Nick Nurse as next coach | NBA.com",
			"highlight": "Toronto Raptors didn't have to look far to name their next coach"
		}

		test.push(item3);
		res.send(test);
		/*
		var response = { 'urlList': ['http://www.nba.com', 'http://www.cnn.com', 'http://google.com', 'http://gmail.com', 'http://something.com', 'http://example.com'] };
		res.send(response);
		*/
	});

};