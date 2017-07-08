/**
 * Created by Antonio Altamura on 08/07/2017.
 */
"use strict";

let map = {
	"name" : "foaf:name",
	"website": "dbp:website",
	"abstract":"dbo:abstract",
	"genre": "dbo:genre",
	"associatedBand": "dbo:associatedBand",
	"associatedMusicalArtist":"dbo:associatedMusicalArtist",
	"caption":"dbp:caption",
	"origin": "dbp:origin",
	"currentMembers" : "dbp:currentMembers"
};
let triple = function (s,key,value) {
	return `${d} ${map[key]} "${value}"`;
};
module.exports.build = function (o) {

	console.log("build")
	console.log(o)
	if (!o.name) throw new Error("Name field is required");

	/*
			var data = {
				abstract: "abstrac"
				associatedBand: [{
					name: "Azure Ray"
					uri: "http://dbpedia.org/resource/Azure_Ray"
				}]
				associatedMusicalArtist: ...
				caption	 "caption"
	}*/

	var r = `<http://dbpedia.org/resource/${o.name}>`;
	var data = `	
	INSERT DATA{
	${r} a dbo:Band .
	${r} foaf:name ${o.name} .
	${o.website ? (r + "dbp:website" + o.website) + ' .':''}
	}`;
	return data;
	};