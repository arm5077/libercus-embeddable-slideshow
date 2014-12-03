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

function getURL($url)
{
	// create curl resource
	$ch = curl_init();
	
	// set url
	curl_setopt($ch, CURLOPT_URL, $url);
	
	//return the transfer as a string
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	
	//do redirects
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	
	// $output contains the output string
	$output = curl_exec($ch);
	
	// close curl resource to free up system resources
	curl_close($ch);  
	
	return $output;
}

function scrape($string, $startString, $endString) {
	$start = stripos($string, $startString) + strlen($startString);
	$end =  stripos($string, $endString, $start);
	return substr($string, $start, $end-$start); 
}

function slideshowToJSON($url){

	if( $url == "" ) {
		return json_encode( Array(
			"status" => Array(
				"code" => "404", 
				"description" => "No URL supplied."
			)
		));
	}
	else {
		// Grab HTML content from URL
		$content = getURL($url);
		
		// Validate that we're looking at a Libercus gallery page
		if( stripos($content, '<div class="slideshowImage">') == FALSE ) {
			return json_encode( Array(
				"status" => Array(
					"code" => "404",
					"description" => "That URL doesn't point to a Libercus gallery page."
				)
			));
		}
		
		// Grab title
		$title = scrape($content, '<div class="slideshowHeadline">', '</div>');
		
		// Split content into array, separating each slideshow image into own index
		$content = explode('<div class="slideshowImage">', $content);
		
		// Get rid of the first array item since it doesn't contain slideshow content
		$content = array_splice($content, 1);
		
		// Initialize the array we'll use to export image data through JSON
		$images = Array();
		
		// Build export array
		foreach( $content as $image ){
			$images[] = Array(
				"url" => scrape($image, '<img src="', '" credit='),
				"caption" => scrape($image, 'caption="', '" />'),
				"credit" => scrape($image, '<div class="credit">', '</div>')
				);
		}
		
		// Output JSON
		return json_encode( Array(
			"status" => Array(
				"code" => "200",
				"description" => "We're good. Yayyyyyy!"
			),
			"results" => $images,
			"title" => $title
		));
	}
}

?>