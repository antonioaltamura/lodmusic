"use strict";
let router = require('express').Router();
let sparql = require('../sparql');

router.get('/band', function (req, res) {
	console.log(req.query.uri)
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

module.exports = router;