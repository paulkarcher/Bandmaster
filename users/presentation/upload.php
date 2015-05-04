<?php

  if (isset($_FILES['upl'])) {
    
    /* If the file size limit specified in php.ini is exceeded.  */
    if ($_FILES['upl']['error'] == 1) {
      echo "fileTooLarge";
      date_default_timezone_set('America/New_York');
      $log = fopen("file_log.txt", "a");
      fwrite($log, "\n" . date("m/d/Y @ g:i:sA") . " - Failed to Upload File: " . 'uploads/' . $_FILES['upl']['name']);
      fclose($log);
      exit;
    }

    /* If the file is not null and there is no error, the file uploaded with success. */
    if ($_FILES['upl']['error'] == 0) {
      
      $extension = pathinfo($_FILES['upl']['name'], PATHINFO_EXTENSION);

      // if the file is a song
      if ($_POST['fileType'] == "song") {
        if (move_uploaded_file($_FILES['upl']['tmp_name'], 'uploads/' . stripslashes($_FILES['upl']['name']))) {
          $file = file_get_contents('JSON/songs.json', true);
          $data = json_decode($file, true);
          unset($file);
          date_default_timezone_set('America/New_York');
          $log = fopen("file_log.txt", "a");
          fwrite($log, "\n" . date("m/d/Y @ g:i:sA") . " - Song Uploaded: " . 'uploads/' . $_FILES['upl']['name']);
          fclose($log);

          $basename = pathinfo(stripslashes($_FILES['upl']['name']), PATHINFO_BASENAME);
          //$data[0]["name"] = $basename;

          $data[] = array('name' => $basename);

          $result = json_encode($data);
          file_put_contents('JSON/songs.json', $result);
          unset($result);
          
          echo "songSuccess";
          exit;
        }
      }
      // if the file is not a song
      else {
        if (move_uploaded_file($_FILES['upl']['tmp_name'], 'uploads/' . $_FILES['upl']['name'])) {

          $file = file_get_contents('JSON/songs.json', true);
          $data = json_decode($file, true);
          unset($file);

          // song to append the file to
          $songname = $_POST['songname'];
          $filename = pathinfo($_FILES['upl']['name'], PATHINFO_BASENAME);
          $found = false;
          $max = sizeof($data);
          // find the song to attach this file to
          for ($i = 0; $i < $max; $i++) {
            if ($data[$i]['name'] == $songname) {
              // add the file to the song
              for ($j = 0; $j < sizeof($data[$i]['documents']); $j++) {
                // remove old copies if this is a reupload
                if ($data[$i]['documents'][$j] == $filename) {
                  $found = true;
                  break;
                }
              }
              if ($found != true) {
                $data[$i]['documents'][] = $filename;
              }
              break;
            }
          }

          $result = json_encode($data);
          file_put_contents('JSON/songs.json', $result);
          unset($result);
          
          date_default_timezone_set('America/New_York');
          $log = fopen("file_log.txt", "a");
          fwrite($log, "\n" . date("m/d/Y @ g:i:sA") . " - File Uploaded: " . 'uploads/' . $_FILES['upl']['name']);
          fclose($log);

          echo "fileSuccess";
          exit;
        }
      }
    }
  }

  echo "error";
  exit;
?>
