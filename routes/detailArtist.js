let router = require('express').Router();

router.get('/', function(req, res, next) {
	res.render('detailArtist');
});

module.exports = router;
