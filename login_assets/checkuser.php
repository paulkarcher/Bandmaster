<?php

  /*
    searchUser is a binary search implementation that will 
    return the position in the array of an existing user. 
    if a user doesnt exist, it will return -1
  */
  function searchUser($users, $name, $min, $max) {
    if ($max < $min) {
      return -1;
    }
    else {
      $mid = (int)($min + ($max - $min) / 2);

      if ($users[$mid]['username'] > $name) {
        return searchUser($users, $name, $min, $mid - 1);
      }
      else if ($users[$mid]['username'] < $name) {
        return searchUser($users, $name, $mid + 1, $max);
      }
      else {
        return $mid;
      }
    }
  }

  /* 
    checkUser will check to see if a username already exists
    it will return true if the user exists and false
    if the user does not exist
  */
  function checkUser($name) {
    $file = file_get_contents('../users.json', true);
    $users = json_decode($file, true);
    unset($file);

    $size = sizeof($users);
  
    if (searchUser($users, $name, 0, $size - 1) != -1) {
      return true;
    }
    return false;
  }

?>