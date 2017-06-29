#!/usr/bin/env php
<?php
# HTTP URL is constructed accordingly with JSON query results format in mind.

function sparqlQuery($query, $baseURL, $format="application/rdf")

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
	
	return file_get_contents($sparqlURL);
};

function saveFile($file, $output){

$fp = fopen($file, 'a');
fwrite($fp, $output);
fclose($fp);
};

function readQuery($fileQuery){
$fp = fopen($fileQuery, 'r');
$query = fread($fp,filesize($fileQuery));
return $query;
};


$dsn="http://dbpedia.org/resource/DBpedia";

#Virtuoso pragmas for instructing SPARQL engine to perform an HTTP GET
#using the IRI in FROM clause as Data Source URL

$chunk = 0;
$stop = false;

//to modify
$nullPoint = "# Empty TURTLE
";

$toExec = readQuery("query.txt");
while(!$stop){
	$chunk++;
	$value = 10000 * $chunk;
$query = $toExec.$value;
echo $query;
$data=sparqlQuery($query, "http://dbpedia.org/sparql");
if((strcmp($data,$nullPoint))==0){ 
	$stop = true; 
	break;
	}
	//insert name table
	$file = "album".$chunk.".ttl";
	echo "Nr iteration: ".$chunk."\n";
saveFile($file, $data);

}
print "Finish";

?>