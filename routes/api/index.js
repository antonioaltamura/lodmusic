"use strict";
let router = require('express').Router();
let sparql = require('../sparql');


		router.get('/band', function (req, res) {
			if (!req.query.uri)
				res.status(400).json({message: 'No query param'});
			sparql.query(`
SELECT ?name
?image
?abstract
(GROUP_CONCAT(DISTINCT ?website; separator="(.)(.)") AS ?websites)
(GROUP_CONCAT(DISTINCT ?genre; separator="(.)(.)") AS ?genres)
(GROUP_CONCAT(DISTINCT ?member; separator="(.)(.)") AS ?members)
(GROUP_CONCAT(DISTINCT ?artistRelated; separator="(.)(.)") AS ?artistRelateds)
(GROUP_CONCAT(DISTINCT ?bandRelated; separator="(.)(.)") AS ?bandRelateds)
?origin
?caption
WHERE{
VALUES ?s { <${req.query.uri}> }
  ?s a dbo:Band ;
       foaf:name ?name;
      dbo:abstract ?abstract .
  OPTIONAL{?s dbo:genre ?genre } .
  OPTIONAL{?s dbp:website ?website} .
  OPTIONAL{?s dbo:associatedBand ?bandRelated} .
  OPTIONAL{?s dbo:associatedMusicalArtist ?artistRelated} .
  OPTIONAL{?s dbp:caption ?caption} .
  OPTIONAL{?s dbp:origin ?origin} .
  OPTIONAL{?s dbo:image ?image} .
FILTER LANGMATCHES(LANG(?abstract ), "en")
} group by ?name  ?abstract ?image ?origin ?caption
`, function (r) {
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