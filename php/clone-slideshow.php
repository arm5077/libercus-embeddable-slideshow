<?PHP

// This script pulls JSON file from requested
// slideshow URL, makes a new folder, clones
// slideshow template and spits back embed code.

include "api.php";

function recurse_copy($old, $new) { 
    $dir = opendir($old); 
    @mkdir($new); 
    while(false !== ( $file = readdir($dir)) ) { 
        if (( $file != '.' ) && ( $file != '..' )) { 
            if ( is_dir($old . '/' . $file) ) { 
                recurse_copy($old . '/' . $file,$new . '/' . $file); 
            } 
            else { 
                copy($old . '/' . $file,$new . '/' . $file); 
            } 
        } 
    } 
    closedir($dir); 
} 

$json = slideshowToJSON($_GET["url"]);

// Grab unique slideshow name
$name = substr($_GET["url"], strrpos($_GET["url"], "/") + 1);

// Copy template site over to new directory
recurse_copy("../template", "../slideshows/" . $name);

// Replace JSON in new directory
$json_handle = fopen("../slideshows/" . $name . "/data/images.json", "w+");
fwrite($json_handle, $json);
fclose($json_handle);

echo json_encode( Array( "url" => "http://" . $_SERVER[ 'HTTP_HOST' ] . substr( realpath("../slideshows/" . $name), strlen( $_SERVER[ 'DOCUMENT_ROOT' ] ) ) ) );

?>