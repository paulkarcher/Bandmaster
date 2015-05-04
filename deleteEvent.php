<?php

/*
      Bandmaster
      deleteEvent.php
      authors: David Lordan, Paul Karcher, Dean Marsinelli, the fullcalendar team
      last updated: 5/1/2015

      Handles a userame to determine which json data to be editing as
      well as a unique event ID to determine which json entry to delete
      from that json data.
*/


/*
  Set all the post data given from the form to local variables
 */
$eventID = $_POST['eventID'];
$username = $_POST['username'];

/*
  Load in the contents of the current username's events.json data and
  decode/store it in a local variable.
 */
$file = file_get_contents($username . '/JSON/events.json', true);
$data = json_decode($file, true);
unset($file);

//need to add new data as next index of data.
/* $data[] = array(
  'x' => $eventID); */

/*
  Locate the json entry based on its event ID,
  once found then delete it form the local decoded json data
 */
foreach ($data as $key => $value) {
  /* if ($value['uID'] == $eventID))
    {
    unset($data[$key]);
    } */
  /*$data[] = array(
    'key' => $key,
      'value' => $value);*/
  if ($value['uID'] == $eventID)
  {
    unset($data[$key]);
  }
}

/*
  Encode the new data we have made into a json format then push the 
  changes onto the original events.json file. After that perform variable cleanup
  as well as do some logging.
 */ 
//$data = array_values($data);
$result = json_encode($data);
file_put_contents($username . '/JSON/events.json', $result);
error_log(json_last_error_msg());
unset($result);

$log = fopen("delete_events_log.txt", "a");
  
  fwrite($log, 'user is: ' . $username . "\n");
?>
