<?php

require 'checkuser.php';

if (isset($_POST['action']) && !empty($_POST['action'])) {
  $action = $_POST['action'];
  switch ($action) {
    case 'startCreation' : startCreation();
      break;
  }
}

/*
  createUser will create a new user account in the server
 */

function createUser($username, $password) {

  // salt the password
  $password = "dB9" . $password . "87Xa";
  // Convert the password from UTF8 to UTF16 (little endian)
  $password = iconv('UTF-8', 'UTF-16LE', $password);
  // Encrypt it with the MD4 hash
  $MD4Hash = hash('md4', $password);

  // add entry into the DB
  $file = file_get_contents('../users.json', true);
  $data = json_decode($file, true);
  unset($file);
  $data[] = array('username' => $username, 'password' => $MD4Hash);

  // sort the DB by usernames
  $sortArray = array();
  foreach ($data as $user) {
    foreach ($user as $key => $value) {
      if (!isset($sortArray[$key])) {
        $sortArray[$key] = array();
      }
      $sortArray[$key][] = $value;
    }
  }
  $orderby = "username";
  array_multisort($sortArray[$orderby], SORT_ASC, $data);

  // put the data back into the DB
  $result = json_encode($data);
  file_put_contents('../users.json', $result);
  unset($result);
  $log = fopen("create_log.txt", "a");
  date_default_timezone_set('America/New_York');
  fwrite($log, "\n\n" . date("m/d/Y @ g:i:sA") . " - Creating account: " . $username . "\n");

  // create new directories for the new user
  // and log everything
  // ROOT
  $path = "../users/" . $username;
  mkdir($path);
  fwrite($log, date("m/d/Y @ g:i:sA") . " - creating directory: " . $path . "\n");
  copy("../templates/index.html", $path . "/index.html");
  fwrite($log, date("m/d/Y @ g:i:sA") . " - copying ./templates/index.html to: " . $path . "/index.html\n");
  copy("../templates/functions.php", $path . "/functions.php");
  fwrite($log, date("m/d/Y @ g:i:sA") . " - copying ./templates/functions.php to: " . $path . "/functions.php\n");
  copy("../templates/upload.php", $path . "/upload.php");
  fwrite($log, date("m/d/Y @ g:i:sA") . " - copying ./templates/upload.php to: " . $path . "/upload.php\n");
  //copy("../templates/submitEvent.php", $path . "/submitEvent.php");
  //fwrite($log, date("m/d/Y @ g:i:sA") . " - copying ./templates/submitEvent.php to: " . $path . "/submitEvent.php\n");
  //copy("../templates/deleteEvent.php", $path . "/deleteEvent.php");
  //fwrite($log, date("m/d/Y @ g:i:sA") . " - copying ./templates/deleteEvent.php to: " . $path . "/deleteEvent.php\n");
  // UPLOADS
  $newdir = $path . "/uploads";
  mkdir($newdir);
  fwrite($log, date("m/d/Y @ g:i:sA") . " - creating directory: " . $newdir . "\n");
  // JSON
  $newdir = $path . "/JSON";
  mkdir($newdir);
  fwrite($log, date("m/d/Y @ g:i:sA") . " - creating directory: " . $newdir . "\n");
  copy("../templates/JSON/settings.json", $path . "/JSON/settings.json");
  fwrite($log, date("m/d/Y @ g:i:sA") . " - copying ./templates/JSON/settings.json to: " . $path . "/JSON/settings.json\n");
  copy("../templates/JSON/songs.json", $path . "/JSON/songs.json");
  fwrite($log, date("m/d/Y @ g:i:sA") . " - copying ./templates/JSON/songs.json to: " . $path . "/JSON/songs.json\n");
  copy("../templates/JSON/taskList.json", $path . "/JSON/taskList.json");
  fwrite($log, date("m/d/Y @ g:i:sA") . " - copying ./templates/JSON/taskList.json to: " . $path . "/JSON/taskList.json\n");
  copy("../templates/JSON/calendarBuildParameters.json", $path . "/JSON/calendarBuildParameters.json");
  fwrite($log, date("m/d/Y @ g:i:sA") . " - copying ./templates/JSON/calendarBuildParameters.json to: " . $path . "/JSON/calendarBuildParameters.json\n");

  fclose($log);

  echo SUCCESS;
}

function startCreation() {

  // get the username
  $name = $_POST["username"];

  // check if the user exists or not. if not, create the account
  // Also includes username validation.
  if (checkUser($name)) {
    echo FAILURE;
  } else if ($name == "assets" 
         || $name == "admin" 
         || $name == "templates" 
         || $name == "" 
         || !$name )
 { 
    echo RESTRICTED;
    //Checks if the username exceeds 25 characters.
  } else if(strlen($name) > 25){
    echo TOO_LONG;
    //Checks for special characters in a username.
  } else if (preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $name)){
    echo SPECIAL;
  } else {
    $pw = $_POST["password"];
    createUser($name, $pw);
  }
}

?>
