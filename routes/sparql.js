"use strict";
let rp = require('request-promise'),
	prefixes = `
PREFIX umbelrc: <http://umbel.org/umbel/rc/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbp: <http://dbpedia.org/property/>
PREFIX schema: <http://schema.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
`;
let read = {endpoint: 'http://lodmusic.cloudapp.net:26109/lodmusic/sparql', param: "query"},
	write = {endpoint: 'http://lodmusic.cloudapp.net:26109/lodmusic/update', param: "update"};


//read.endpoint = 'http://localhost:3030/lodmusic/sparql';
//write.endpoint = 'http://localhost:3030/lodmusic/update';

//some ES6 powered forging
module.exports.query = function (q, next, opts) {
	let {endpoint, param} = (opts && opts.insert) ? write : read;
	rp({
		method: 'POST',
		uri: endpoint,
		form: {
			[param]: (prefixes + q)
		},
		headers: {
			Accept: 'application/sparql-results+json,*/*;q=0.9'
		}
	})
		.then(function (parsedBody) {
			next(parsedBody);
		})
		.catch(function (err) {
			next(err);
		});
};