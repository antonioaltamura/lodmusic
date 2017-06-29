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
	});

module.exports = router;
