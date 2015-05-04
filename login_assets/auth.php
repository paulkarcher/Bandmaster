<?php
  require 'checkuser.php';

  /* 
    authenticate will return true if the username/pw is valid
  */
  function authenticate($name, $pw) {
    $file = file_get_contents('../users.json', true);
    $users = json_decode($file, true);
    unset($file);

    $size = sizeof($users);
    
    // get the index of the user in the DB
    $index = searchUser($users, $name, 0, $size -1);
    
    // if user does not exist return false
    if ($index == -1) {
      return false;
    }
    // if passwords match, return true
    else if ($users[$index]['password'] == $pw) {
      return true;
    }

    // if no match, return false
    return false;
  }

?>