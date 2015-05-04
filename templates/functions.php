<?php

  date_default_timezone_set('America/New_York');
  
  // Removes a selected file from the songs.json file from the server.
  // The index of the file to be removed is passed to the server. 
  if ($_POST['func'] == "deleteFile") {

    $file = file_get_contents('JSON/songs.json', true);
    $data = json_decode($file, true);
    unset($file);

    $log = fopen("file_log.txt", "a");

    // get the associated files and delete them first
    $removal = array_splice($data, $_POST['index'], 1);

    if (isset($removal[0]['documents'])) {
      $size = sizeof($removal[0]['documents']);
      for ($i = 0; $i < $size; $i++) {
        $fileToRemove = 'uploads/' . $removal[0]['documents'][$i];
        unlink($fileToRemove);
        fwrite($log, "\n" . date("m/d/Y @ g:i:sA") . " - File Deleted: uploads/" . $removal[0]['documents'][$i]);
      }
    }
      
    // remove the entry from json
    $result = json_encode($data);
    file_put_contents('JSON/songs.json', $result);
    unset($result);

    // remove the actual file
    $fileToRemove = 'uploads/' . (string) $_POST['filename'];
    unlink($fileToRemove);

    fwrite($log, "\n" . date("m/d/Y @ g:i:sA") . " - File Deleted: uploads/" . (string) $_POST['filename']);
    fclose($log);   

    echo "server - file " . $fileToRemove . " removed successfully";
    exit;
  } 
  // Adds a new task to taskList.json
  else if ($_POST['func'] == "addTask") {

    //Grabs the current taskList
    $file = file_get_contents('JSON/taskList.json', true);
    $data = json_decode($file, true);
    unset($file);

    //Adds the new task to the task list array. Also checks for slashes and removes them. 
    $newTask = stripslashes($_POST['newTask']);
    $data[] = array('task' => $newTask);

    $result = json_encode($data);
    file_put_contents('JSON/taskList.json', $result);
    unset($result);

    $log = fopen("task_log.txt", "a");
    fwrite($log, "\n" . date("m/d/Y @ g:i:sA") . " - Task Added: " . $newTask);
    fclose($log);   

    echo "server - task " . $newTask . " added successfully";
    exit;
  }
  
  //Removeds the selected task from taskList.json. Index of task to remove is sent via POST.
  else if ($_POST['func'] == "deleteTask") {

    $file = file_get_contents('JSON/taskList.json', true);
    $data = json_decode($file, true);
    unset($file);

    array_splice($data, $_POST['index'], 1);

    $result = json_encode($data);
    file_put_contents('JSON/taskList.json', $result);
    unset($result);

    $log = fopen("task_log.txt", "a");
    fwrite($log, "\n" . date("m/d/Y @ g:i:sA") . " - Task Deleted");
    fclose($log); 

    echo "server - task removed successfully";
    exit;
  }
  
  //Changes the current band name and stores the new name in settings.json
  else if ($_POST['func'] == "changeName") {

    $file = file_get_contents('JSON/settings.json', true);
    $data = json_decode($file, true);
    unset($file);

    $name = stripslashes($_POST['name']);
    $data['bandname'] = $name;
    $result = json_encode($data);
    file_put_contents('JSON/settings.json', $result);
    unset($result);

    $log = fopen("settings_log.txt", "a");
    fwrite($log, "\n" . date("m/d/Y @ g:i:sA") . " - Band Name Changed to: " . $name);
    fclose($log); 

    echo "server - band name changed to " . $name;
    exit;
  }
?>