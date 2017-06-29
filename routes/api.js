/**
 * Created by Antonio Altamura on 28/06/2017.
 */
"use strict";
let router = require('express').Router();
let SparqlClient = require('sparql-client');
let util = require('util');
let endpoint = 'http://dbpedia.org/sparql';

router.get('/', function(req, res){

	console.log(req.query.q);

	let query = `
				SELECT *
				FROM <http://dbpedia.org>
				WHERE {
					?city <http://dbpedia.org/property/leaderName> ?leaderName
				} LIMIT 10
`;
	let client = new SparqlClient(endpoint);
	//console.log("Query to " + endpoint);
	//console.log("Query: " + query);
	client.query(query)
	//.bind('city', 'db:Chicago')
	//.bind('city', 'db:Tokyo')
	//.bind('city', 'db:Casablanca')
		.bind('city', '<http://dbpedia.org/resource/Vienna>')
		.execute(function(error, results) {
			return res.json(results);
		});
	});
module.exports = router;

