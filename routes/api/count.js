/**
 * Created by Antonio Altamura on 10/07/2017.
 */
"use strict";
let router = require('express').Router();
let sparql = require('../sparql');

router.get('/artist', function (req, res) {
	sparql.query(`select (count (?a) as ?count)
WHERE { ?a a umbelrc:MusicalPerformer . }`, function (r) {
		if (r.error) {
			res.json(r);
		}
		res.json(JSON.parse(r).results.bindings[0]);
	})
}).get('/band', function (req, res) {
	sparql.query(`select (count (?a) as ?count)
WHERE { ?a a dbo:Band . }`, function (r) {
		if (r.error) {
			res.json(r);
		}
		res.json(JSON.parse(r).results.bindings[0]);
	})
}).get('/albumTrack', function (req, res) {
	sparql.query(`select (count (?a) as ?count)
WHERE { {?a a umbelrc:MusicSingle} UNION {?a a dbo:MusicalWork}. }`, function (r) {
		if (r.error) {
			res.json(r);
		}
		res.json(JSON.parse(r).results.bindings[0]);
	})
}).get('/album', function (req, res) {
	sparql.query(`select (count (?a) as ?count)
WHERE {?a a schema:MusicAlbum. }`, function (r) {
		if (r.error) {
			res.json(r);
		}
		res.json(JSON.parse(r).results.bindings[0]);
	})
});


module.exports = router;
