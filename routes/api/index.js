"use strict";
let router = require('express').Router();
let sparql = require('../sparql');
let queryBuilder = require('../queryBuilder');


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
       foaf:name ?name .
  OPTIONAL{?s dbo:abstract ?abstract } .
  OPTIONAL{?s dbo:genre ?genre } .
  OPTIONAL{?s dbp:website ?website} .
  OPTIONAL{?s dbo:associatedBand ?bandRelated} .
  OPTIONAL{?s dbo:associatedMusicalArtist ?artistRelated} .
  OPTIONAL{?s dbp:caption ?caption} .
  OPTIONAL{?s dbp:origin ?origin} .
  OPTIONAL{?s dbo:image ?image} .
#                                    FILTER LANGMATCHES(LANG(?abstract ), "en")
} group by ?name  ?abstract ?image ?origin ?caption
`, function (r) {
		if (r.error) {
			res.json(r);
		}
		res.json(JSON.parse(r));
	})
});
router.get('/album', function (req, res) {
	if (!req.query.uri)
		res.status(400).json({message: 'No query param'});
	sparql.query(`	
	SELECT
	?name
	?abstract
	?releaseDate
(GROUP_CONCAT(DISTINCT ?genre; separator="(.)(.)") AS ?genres)
(GROUP_CONCAT(DISTINCT ?recordLabel; separator="(.)(.)") AS ?recordLabels)
(GROUP_CONCAT(DISTINCT ?artist; separator="(.)(.)") AS ?artists)
WHERE{
<${req.query.uri}> a schema:MusicAlbum;
			foaf:name ?name;
			dbo:abstract ?abstract;
			dbo:recordLabel ?recordLabel;
			dbo:releaseDate ?date;
  			dbo:artist ?band.
  OPTIONAL{<${req.query.uri}> dbo:genre ?genre}.	
} group by ?name  ?abstract ?releaseDate
`, function (r) {
		if (r.error) {
			res.json(r);
		}
		res.json(JSON.parse(r));
	})
});


router.get('/artist', function (req, res) {
	if (!req.query.uri)
		res.status(400).json({message: 'No query param'});
	sparql.query(`
SELECT 
?name
?bDate
?abstract
?image
?origin
?caption
(GROUP_CONCAT(DISTINCT ?artistRelated; separator="(.)(.)") AS ?artistRelateds)
(GROUP_CONCAT(DISTINCT ?bandRelated; separator="(.)(.)") AS ?bandRelateds)
WHERE
{
VALUES ?s { <${req.query.uri}> }
	?s a umbelrc:MusicalPerformer;
    	foaf:name ?name;
		dbo:abstract ?abstract;
		dbo:birthDate ?bDate.
 OPTIONAL{?s dbo:thumbnail ?image}.
 OPTIONAL{?s dbo:associatedBand ?bandRelated} .
 OPTIONAL{?s dbo:associatedMusicalArtist ?artistRelated} .
 OPTIONAL{?s dbp:caption ?caption} .
 OPTIONAL{?s dbp:origin ?origin} .
}  group by ?name
?bDate
?abstract
?image
?origin
?caption
`, function (r) {
		if (r.error) {
			res.json(r);
		}
		res.json(JSON.parse(r));
	})
});

router.get('/albumTrack', function (req, res) {
	if (!req.query.uri)
		res.status(400).json({message: 'No query param'});
	sparql.query(`
SELECT DISTINCT ?name ?abstract ?releaseDate 
(GROUP_CONCAT(DISTINCT ?recordLabel; separator="(.)(.)") AS ?recordLabels)
(GROUP_CONCAT(DISTINCT ?artist; separator="(.)(.)") AS ?artists)
(GROUP_CONCAT(DISTINCT ?album; separator="(.)(.)") AS ?albums)
     WHERE
{
  VALUES ?s { <${req.query.uri}> }
  {?s a umbelrc:MusicSingle} UNION {?s a dbo:MusicalWork}.
  ?s   foaf:name ?name;
      dbo:abstract ?abstract;
      dbo:releaseDate ?date;
  { ?s  dbo:musicalArtist [ a umbelrc:MusicalPerformer;
                                foaf:name ?artist;]}
  UNION  {?s dbo:musicalArtist [ a dbo:Band; 
  foaf:name ?artist;]} 
  FILTER(lang(?abstract) = "en").
      OPTIONAL{?s  dbo:album ?album}.
      OPTIONAL{?s  dbo:recordLabel ?recordLabel}.
} group by ?name ?abstract ?releaseDate 
`, function (r) {
		if (r.error) {
			res.json(r);
		}
		res.json(JSON.parse(r));
	})
});

router.get('/related', function (req, res) {
	if (!req.query.uri)
		res.status(400).json({message: 'No query param'});
	sparql.query(`
SELECT DISTINCT ?name ?image ?abstract ?type
(GROUP_CONCAT(DISTINCT ?artistRelated; separator="(.)(.)") AS ?artistRelateds)
(GROUP_CONCAT(DISTINCT ?bandRelated; separator="(.)(.)") AS ?bandRelateds)
WHERE {
  VALUES ?q {<${req.query.uri}>}
  { ?q a umbelrc:MusicalPerformer } UNION { ?q a dbo:Band }.
  ?q a ?type;
   		foaf:name ?name;
      	dbo:abstract ?abstract .
	OPTIONAL{?q dbo:associatedBand ?bandRelated} .
 	OPTIONAL{?q dbo:associatedMusicalArtist ?artistRelated} .
 	OPTIONAL{?q dbo:image ?image} .
} group by  ?name ?image ?abstract ?type
`, function (r) {
		if (r.error) {
			res.json(r);
		}
		let o = JSON.parse(r).results.bindings[0];
		//check if the resource exists
		if (Object.keys(o).length !== 0) {
			o.type = o.type.value === "http://dbpedia.org/ontology/Band" ? 'band' : "http://umbel.org/umbel/rc/MusicalPerformer" ? 'artist' : null;
			res.json(o);
			// maybe TODO artistRelateds & bandRelateds split serverside
		}
		else
			res.status(404).json({error: 'Not found'});
	})
});

router.post('/band', function (req, res) {

	let o = req.body;
	console.log(o);
	let r = `<http://dbpedia.org/resource/${o.name}>`;
	let query = `	
	INSERT DATA{
	${r} a dbo:Band .
	${r} foaf:name "${o.name}" .
	${o.abstract ? (r + ' dbo:abstract "' + o.abstract) + '" .' : ''}
	${o.website ? (r + ' dbp:website "' + o.website) + '" .' : ''}
	${o.caption ? (r + ' dbp:caption "' + o.caption) + '" .' : ''}
	${o.image ? (r + ' dbo:image "' + o.image) + '" .' : ''}
	${o.genre ? o.genre.map(i => `${r} dbo:genre  <${i.uri}> . `).join('\n      ') : ''}
	${o.associatedBand ? o.associatedBand.map(i => `${r} dbo:associatedBand  <${i.uri}> .`).join('\n      ') : ''}
	${o.associatedMusicalArtist ? o.associatedMusicalArtist.map(i => `${r} dbo:associatedMusicalArtist  <${i.uri}> . `).join('\n      ') : ''}
	${o.currentMembers ? o.currentMembers.map(i => `${r} dbp:currentMembers  <${i.uri}> . `).join('\n      ') : ''}
	}`;
	sparql.query(query,
		function (r) {
			res.json(r)
		}, {insert: true});

});

router.post('/artist', function (req, res) {

    let o = req.body;
    console.log(o);
    let r = `<http://dbpedia.org/resource/${o.name}>`;
    let query = `	
	INSERT DATA{
	${r} a umbelrc:MusicalPerformer.
	${r} foaf:name "${o.name}" .
	${r} dbo:birthdate"${o.birthDate}" .
	${o.abstract ? (r + ' dbo:abstract "' + o.abstract) + '" .' : ''}
	${o.image ? (r + ' dbo:thumbnail "' + o.image) + '" .' : ''}
	${o.origin ? (r + ' dbo:origin "' + o.origin) + '" .' : ''}
	${o.caption ? (r + ' dbp:caption "' + o.caption) + '" .' : ''}
	${o.image ? (r + ' dbo:image "' + o.image) + '" .' : ''}
	${o.associatedBand ? o.associatedBand.map(i => `${r} dbo:associatedBand  <${i.uri}> .`).join('\n      ') : ''}
	${o.associatedMusicalArtist ? o.associatedMusicalArtist.map(i => `${r} dbo:associatedMusicalArtist  <${i.uri}> . `).join('\n      ') : ''}
	}`;
    sparql.query(query,
        function (r) {
            res.json(r)
        }, {insert: true});

});

module.exports = router;