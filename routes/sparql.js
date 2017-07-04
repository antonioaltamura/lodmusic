"use strict";
let rp = require('request-promise'),
	endpoint = 'http://lodmusic.cloudapp.net:26109/lodmusic/sparql',
	prefixes = `PREFIX umbelrc: <http://umbel.org/umbel/rc/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbp: <http://dbpedia.org/property/>
PREFIX schema: <http://schema.org/>`;

module.exports.query = function (q, next) {
	rp({
		method: 'POST',
		uri: endpoint,
		form: {
			query: prefixes + q
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