<?php

header("Expires: Tue, 01 Jan 2000 00:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

require 'auth.php';

//Checks the post action and calls the appropriate function.
if(isset($_POST['action']) && !empty($_POST['action'])) {
    $action = $_POST['action'];
    switch($action) {
        case 'login' : login();break;
    }
}

function login(){

  $name = $_POST["username"];
  date_default_timezone_set('America/New_York');
  $log = fopen("./user_log.txt", "a");
  fwrite($log, "\n\n" . date("m/d/Y @ g:i:sA") . " - User " . $name . " attemping to log in\n");

  // make sure this user actually exists
  if (!checkUser($name)) {  
    fwrite($log, date("m/d/Y @ g:i:sA") . " - User " . $name . " does not exist");
    //Username does not exists. 
    echo DNE;
    return;
}

  $password = $_POST["password"];
  // salt the password
  $password = "dB9" . $password . "87Xa";
  // Convert the password from UTF8 to UTF16 (little endian)
  $password = iconv('UTF-8', 'UTF-16LE', $password);
  // Encrypt it with the MD4 hash
  $MD4Hash = hash('md4', $password);

  // authenticate user
  if (!authenticate($name, $MD4Hash)) {
    fwrite($log, date("m/d/Y @ g:i:sA") . " - User " . $name . " has an invalid password");
    //Invalid credentials.
    echo INVALID;
    return;
  }
  fwrite($log, date("m/d/Y @ g:i:sA") . " - User " . $name . " logged in successfully");
  fclose($log);
  // open up the settings json file for this user
  $file = file_get_contents('../users/'.$name . '/JSON/settings.json', true);
  $settings = json_decode($file, true);
  unset($file);

  echo LOGIN;

}
?>