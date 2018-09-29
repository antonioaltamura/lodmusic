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

/* decomment those lines in case you use a local instance of Apache Jena/Fuseki
read.endpoint = 'http://localhost:3030/lodmusic/sparql';
write.endpoint = 'http://localhost:3030/lodmusic/update';
*/


//some ES6 powered forging
module.exports.query = function (q, next, opts={}) {
	let {endpoint, param} = (opts.insert) ? write : read;

	console.error("------SPARQL DEBUG-------",
	console.error((prefixes + q));
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
		.then((parsedBody)=>next(parsedBody))
		.catch((err)=>next(err));
};