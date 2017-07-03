/**
 * Created by Antonio Altamura on 03/07/2017.
 */
"use strict";
let rp = require('request-promise');
let endpoint = 'http://localhost:3030/lodmusic/sparql';

let prefixes = `PREFIX umbelrc: <http://umbel.org/umbel/rc/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbp: <http://dbpedia.org/property/>`;

let request = function (q, next) {

	rp({
		method: 'POST',
		uri: endpoint,
		form: {
			query: prefixes + q
		},
		headers : {
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

module.exports.query = request;