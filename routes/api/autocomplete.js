"use strict";
let router = require('express').Router();
let sparql = require('../sparql');

router.get('/artist', function (req, res) {
	if (!req.query.name)
		res.status(400).json({message: 'No query param'});
	sparql.query(`SELECT DISTINCT ?name ?artist
WHERE
{
  ?artist a umbelrc:MusicalPerformer;
    foaf:name ?name;
 FILTER regex(?name, "^${req.query.name}","i").
}`, function (r) {
		let json = JSON.parse(r);
		let result = json.results.bindings.map(function (item) {
			return {name: item.name.value, uri: item.artist.value};
		});
		res.json(result);
	})
});

router.get('/track', function (req, res) {
    if (!req.query.name)
        res.status(400).json({message: 'No query param'});

    sparql.query(`SELECT ?name ?track
WHERE{
  ?track foaf:name ?name;
   {?track a umbelrc:MusicSingle} UNION {?track a dbo:MusicalWork}.
     FILTER regex(?name, "^${req.query.name}","i").
}`, function (r) {
        let json = JSON.parse(r);
        let result = json.results.bindings.map(function (item) {
            return {name: item.name.value, uri: item.track.value};
        });
        res.json(result);
    })
});

router.get('/band', function (req, res) {
    if (!req.query.name)
		res.status(400).json({message: 'No query param'});
    sparql.query(`SELECT ?name ?band
WHERE 
{
	?band foaf:name ?name.
    ?band a dbo:Band.
     FILTER regex(?name, "^${req.query.name}","i").
	}`, function (r) {
        let json = JSON.parse(r);
        let result = json.results.bindings.map(function (item) {
            return {name: item.name.value, uri: item.band.value};
        });
        res.json(result);
    })
});

router.get('/album', function (req, res) {
    if (!req.query.name)
		res.status(400).json({message: 'No query param'});
    sparql.query(`SELECT ?name ?album 
WHERE 
{
	?album foaf:name ?name.
	?album a schema:MusicAlbum.
    FILTER regex(?name, "^${req.query.name}","i").
}`, function (r) {
        console.log(r);
        let json = JSON.parse(r);
        let result = json.results.bindings.map(function (item) {
            return {name: item.name.value, uri: item.album.value};
        });
        res.json(result);
    })
});

module.exports = router;