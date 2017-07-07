let router = require('express').Router();

router.get('/', function (req, res, next) {
	res.render('index');
})
	.get('/addBand', function (req, res, next) {
		res.render('addBand');
	})
	.get('/addArtist', function (req, res, next) {
		res.render('addArtist');
	})
	.get('/resource', function (req, res, next) {
		//EJS can't read its own GET params directly
		console.log(req.query.uri)
		res.render('resource', {uri: req.query.uri, resourceType: req.query.resourceType});
	})
	.get('/graph', function (req, res, next) {
		res.render('graph' , {uri: req.query.uri, resourceType: req.query.resourceType});
	});

module.exports = router;
