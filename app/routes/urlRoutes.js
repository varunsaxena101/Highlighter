//In Express, routes are wrapped in a function, which takes the Express 
//instance and a database as arguments

//As of right now, this group of routes are just for URLs

module.exports = function(app, db) {

	var ObjectID = require('mongodb').ObjectID;

	app.post('/urls', (req, res) => {
		const url = {url: req.body.url};
		db.collection('url').insert(url, (err, result) => {
			if (err) {
				res.send({'error': 'An error has occurred'});
			} else {
				console.log(typeof(res));
				// res.statusCode = 600;
				// res.setHeader('Content-Type', 'application/json');
				// res.setHeader('x-VarunHeader', 'silly');
				res.send(result.ops[0]);
			}
		});
	});

	app.get('/urls/:id', (req, res) => {
		const id = req.params.id;
		const details = {'_id': new ObjectID(id)};
		db.collection('url').findOne(details, (err, item) => {
			if (err) {
				res.send({'error': 'An error has occurred'});
			} else {
				res.send(item);
			}
		});
	});

};