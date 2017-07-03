/**
 * Created by Antonio Altamura on 28/06/2017.
 */
"use strict";
let router = require('express').Router();
let SparqlClient = require('sparql-client');
let sparql = require('./sparql');
let util = require('util');
let endpoint = 'http://dbpedia.org/sparql';



var escape = function (str){ return String(str).replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');}
var startsWith = function(str) {
	if(str)
		return  new RegExp('^'+escape(str), "i");
	else
		return new RegExp('.*', "i");
};

router.get('/query/', function(req,res) {
	sparql(`SELECT DISTINCT ?artist ?bDate ?abstract ?image
WHERE
{
  ?artist a umbelrc:MusicalPerformer;
    foaf:name "Bono"@en;
  dbo:abstract ?abstract;
  dbo:birthDate ?bDate.
 OPTIONAL{?artist dbo:thumbnail ?image}.
}`, function(r){
		res.json(r);
	})

});

router.get('/fuseki/', function(req,res){

	let endpoint = 'http://localhost:3030/lodmusic/sparql';
	let query = `${prefixes} 
	SELECT DISTINCT ?artist ?name ?bDate ?abstract ?image
WHERE
{
	?artist a umbelrc:MusicalPerformer;
    foaf:name ?name;
	dbo:abstract ?abstract;
	dbo:birthDate ?bDate.
 OPTIONAL{?artist dbo:thumbnail ?image}.
}`;
	let client = new SparqlClient(endpoint);


	client.query(query)
		.bind(req.query.name, 'foaf:name')
		.execute(function(error, results) {
			return res.json(results);
		});

});
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

router.get('/memberState', function(req,res) {
	var memberState=["Austria",
		"Belgium",
		"Bulgaria",
		"Cyprus",
		"Croatia",
		"Czech Republic",
		"Denmark",
		"Estonia",
		"Finland",
		"France",
		"Germany",
		"Greece",
		"Hungary",
		"Ireland",
		"Italy",
		"Latvia",
		"Lithuania",
		"Luxembourg",
		"Malta",
		"Netherlands",
		"Poland",
		"Portugal",
		"Romania",
		"Slovakia",
		"Slovenia",
		"Spain",
		"Sweden",
		"United Kingdom"];
	var query = startsWith(req.query.term);
	res.json(memberState.filter( (el) => query.test(el)));
});

module.exports = router;

