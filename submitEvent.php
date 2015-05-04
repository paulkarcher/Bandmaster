<?php

/*
      Bandmaster
      submitEvent.php
      authors: David Lordan, Paul Karcher, Dean Marsinelli, the fullcalendar team
      last updated: 5/1/2015

      Handles input passed to it from the "Add Event" form after it is validated by
      eventValidation.js. Based on the username it is given, the code adds an event
      which is created from all the other information passed to it, which includes
      the event's name, location, start date, start time, end time and end date.
      
*/

/*
 Old code which was used as an initial testing method for adding data to
 a json file.
 */
 
// Loading existing data:
//$file = file_get_contents("jsoon.json");
//$data = json_decode($file, true);
//When TRUE, returned objects will be converted into associative arrays.
//unset($file);
// Adding new data:
//$data = array();
//$data{"event_name"} = $_POST['name'];
//$data{"event_location"} = $_POST['location'];
// Writing modified data:
//file_put_contents('jsoon.json', json_encode($data, JSON_FORCE_OBJECT));


/*
  Set the username post data given from the form to a local variable.
 */
$path = $_POST['user_name'];

echo $path;

/*
  Load in the contents of the current username's events.json data and
  decode/store it in a local variable.
 */
$file = file_get_contents($path . '/JSON/calendarBuildParameters.json', true);
//$file = file_get_contents('test_write.json', true);
$build = json_decode($file, true);
unset($file);

//uID = unique ID
$uID = $build['nextAvailableIndex'];

//$build['nextAvailableIndex'] = $path;
$build['nextAvailableIndex'] += 1;
$updated = json_encode($build);
file_put_contents($path . '/JSON/calendarBuildParameters.json', $updated);
//file_put_contents('test_write.json', $updated);


$file = file_get_contents($path . '/JSON/events.json', true);
$data = json_decode($file, true);
unset($file);

//$index = $data[0];


/*
  Set all the post data given from the form to local variables
 */
$event_name = $_POST['event_name'];
$event_location = $_POST['event_location'];
$time_start = $_POST['time_start'];
$date_start = $_POST['date_start'];
$time_end = $_POST['time_end'];
$date_end = $_POST['date_end'];



//need to add new data as next index of data.


/*
  Format the now local data taken from the form into a way that is valid
  for the fullcalendar library to function. Starting dates and times
  are combined into a single specific string so that the library may recognize
  it and load it into the calendar, the same is done for ending dates and times.
 */
$data[] = array(
    'title' => $event_name, 'location' => $event_location,
    'start' => $date_start  . 'T' . $time_start,
    'end'   => $date_end    . 'T' . $time_end,
    'uID' => $uID);

//$data = array_values($data);



/*
  Encode the new data we have made into a json format then push the 
  changes onto the original events.json file. After that perform variable cleanup
  as well as do some logging.
 */ 
$result = json_encode($data);
file_put_contents($path . '/JSON/events.json', $result);
error_log(json_last_error_msg());
unset($result);

file_put_contents($path . 'error_log.txt', print_r($variable, true));
?>
