#!/usr/bin/env php
<?php
# HTTP URL is constructed accordingly with JSON query results format in mind.

function sparqlQuery($query, $baseURL, $format="application/json")

  {
	$params=array(
		"default-graph" =>  "",
		"should-sponge" =>  "soft",
		"query" =>  $query,
		"debug" =>  "on",
		"timeout" =>  "",
		"format" =>  $format,
		"save" =>  "display",
		"fname" =>  ""
	);

	$querypart="?";	
	foreach($params as $name => $value) 
  {
		$querypart=$querypart . $name . '=' . urlencode($value) . "&";
	}
	
	$sparqlURL=$baseURL . $querypart;
	
	return json_decode(file_get_contents($sparqlURL));
};




$dsn="http://dbpedia.org/resource/DBpedia";

#Virtuoso pragmas for instructing SPARQL engine to perform an HTTP GET
#using the IRI in FROM clause as Data Source URL

$chunk = 0;
$stop = false;

//to modify
$nullPoint = "{\"head\":{\"link\":[],\"vars\":[\"band\"]},\"results\":{\"distinct\":false,\"ordered\":true,\"bindings\":[]}}";

while(!$stop){
	$chunk++;
	$value = 10000*$chunk;

	//to modify
$query="SELECT ?band
WHERE 
{
	?band a umbel-rc:Band_MusicGroup;
		  foaf:name ?name;
		  dbo:bandMember ?member;
          foaf:homepage ?website;
          dbo:abstract ?abstract.
FILTER(lang(?abstract) = \"en\").
OPTIONAL{?band dbo:genre ?genre} .
OPTIONAL{?band dbo:thumbnail ?image}.
}
LIMIT 10000.
OFFSET ".$value;

$data=sparqlQuery($query, "http://dbpedia.org/sparql");

if((strcmp(json_encode($data),$nullPoint))==0) $stop = true;

// add file save
print "Retrieved data:\n" . json_encode($data);

}

?>