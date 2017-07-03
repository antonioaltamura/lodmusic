let router = require('express').Router();

router.get('/', function (req, res, next) {
	res.render('index');
})
	.get('/form', function (req, res, next) {
		res.render('form');
	})
	.get('/detailAlbum', function (req, res, next) {
		res.render('detailAlbum');
	})
	.get('/detailArtist', function (req, res, next) {
		res.render('detailArtist');
	})
	.get('/resource', function (req, res, next) {
		//EJS can't read its own GET params directly
		console.log(req.query.uri)
		res.render('resource', {uri: req.query.uri, resourceType: req.query.resourceType});
	})
	.get('/graph', function (req, res, next) {
		res.render('graph');
	});

module.exports = router;
