/**
 * Created by Antonio Altamura on 28/06/2017.
 */
"use strict";
let router = require('express').Router();
let sparql = require('./sparql');

router.get('/autocomplete/', function (req, res) {
    if (!req.query.term)
        res.status(400).send('No query param');
    sparql.query(`SELECT DISTINCT ?name ?artist ?bDate ?abstract ?image
WHERE
{
  ?artist a umbelrc:MusicalPerformer;
    foaf:name ?name;
  dbo:abstract ?abstract;
  dbo:birthDate ?bDate.
 OPTIONAL{?artist dbo:thumbnail ?image}.
 FILTER regex(?name, "^${req.query.term}","i").
}`, function (r) {
        let json = JSON.parse(r);
        let result = json.results.bindings.map(function (item) {
            return {name: item.name.value, uri: item.artist.value};
        });
        res.json(result);
    })
});

module.exports = router;