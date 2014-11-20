<?PHP

// Pretty simple API -- all this does is 
// accept a URL, look up the libercus page,
// verify it's a gallery and copies all the 
// image URLs and captions.

// That all gets dumped into a JSON file. 

// It then creates a new slideshow instance,
// duplicating the base slideshow code and 
// using the JSON file to build a new
// slideshow. It then spits back embed code.
$url  = $_GET["url"];

if( $url == "" ) {
	echo json_encode(Array("status" => "404"));
}

?>
