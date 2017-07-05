"use strict";
let router = require('express').Router();
let sparql = require('../sparql');

router.get('/band', function (req, res) {
	if (!req.query.uri)
		res.status(400).json({message: 'No query param'});
	sparql.query(`
	SELECT ?name ?website ?abstract ?genre ?image ?member
WHERE{
 <${req.query.uri}> a dbo:Band ;
       foaf:name ?name;
      dbo:abstract ?abstract ;
      dbp:currentMembers ?member .
  OPTIONAL{  <${req.query.uri}> dbo:genre ?genre } .
  OPTIONAL{  <${req.query.uri}> dbp:website ?website} .
  OPTIONAL{  <${req.query.uri}> dbo:image ?image} .
}`, function (r) {
		if(r.error) {
			res.json(r);
		}
		res.json(JSON.parse(r));
	})
});

router.get('/album', function (req, res) {
	if (!req.query.uri)
		res.status(400).json({message: 'No query param'});
	sparql.query(`
SELECT DISTINCT ?name ?abstract ?recordLabel ?releaseDate ?genre ?artist
	WHERE{
	 <${req.query.uri}> a schema:MusicAlbum;
foaf:name ?name;
dbo:abstract ?abstract;
dbo:recordLabel ?recordLabel;
dbo:releaseDate ?date;
dbo:artist ?band.
	OPTIONAL{?album dbo:genre ?genre}.
}`, function (r) {
		if(r.error) {
			res.json(r);
		}
		res.json(JSON.parse(r));
	})
});


router.get('/artist', function (req, res) {
	if (!req.query.uri)
		res.status(400).json({message: 'No query param'});
	sparql.query(`


SELECT DISTINCT ?name ?bDate ?abstract ?image ?band
WHERE
{
	<${req.query.uri}>  a umbelrc:MusicalPerformer;
  foaf:name ?name;
	dbo:abstract ?abstract;
	dbo:birthDate ?bDate.
  ?band dbp:currentMembers ?artist.
 OPTIONAL{<${req.query.uri}>  dbo:thumbnail ?image}.
}`, function (r) {
		if(r.error) {
			res.json(r);
		}
		res.json(JSON.parse(r));
	})
});

router.get('/track', function (req, res) {
	if (!req.query.uri)
		res.status(400).json({message: 'No query param'});
	sparql.query(`

SELECT DISTINCT ?name ?abstract ?releaseDate ?artist ?album ?recordLabel
     WHERE
{
  
  { <${req.query.uri}>  a umbelrc:MusicSingle} UNION {<${req.query.uri}> a dbo:MusicalWork}.

   <${req.query.uri}>   foaf:name ?name;
      dbo:abstract ?abstract;
      dbo:releaseDate ?date;
  {  <${req.query.uri}>  dbo:musicalArtist [ a umbelrc:MusicalPerformer;
                                foaf:name ?artist;]}
  UNION  {<${req.query.uri}> dbo:musicalArtist [ a dbo:Band;
  foaf:name ?artist;]}      
  FILTER(lang(?abstract) = "en").
      OPTIONAL{?track dbo:album ?album}.
      OPTIONAL{?track dbo:recordLabel ?recordLabel}.
}`, function (r) {
		if(r.error) {
			res.json(r);
		}
		res.json(JSON.parse(r));
	})
});

module.exports = router;