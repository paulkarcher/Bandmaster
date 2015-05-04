<?php

/*
      Bandmaster
      get-events.php
      authors: David Lordan, Paul Karcher, Dean Marsinelli, the fullcalendar team
      last updated: 5/1/2015

      This file fetches the calendar data for the 
      administrator page and the public page by loading the
      user's event.json calendar data. We modified this
      file to get it pointing at the correct user's data
      by passing it a username.
*/

//--------------------------------------------------------------------------------------------------
// This script reads event data from a JSON file and outputs those events which are within the range
// supplied by the "start" and "end" GET parameters.
//
// An optional "timezone" GET parameter will force all ISO8601 date stings to a given timezone.
//
// Requires PHP 5.2.0 or higher.
//--------------------------------------------------------------------------------------------------

// Require our Event class and datetime utilities
require dirname(__FILE__) . '/utils.php';
include '../chromePHP.php';
//ChromePhp::log('I am get-events.php');

// Short-circuit if the client did not give us a date range.
if (!isset($_GET['start']) || !isset($_GET['end'])) {
	die("Please provide a date range.");
}

// Parse the start/end parameters.
// These are assumed to be ISO8601 strings with no time nor timezone, like "2013-12-29".
// Since no timezone will be present, they will parsed as UTC.
$range_start = parseDateTime($_GET['start']);
$range_end = parseDateTime($_GET['end']);

// Parse the timezone parameter if it is present.
$timezone = null;
if (isset($_GET['timezone'])) {
	$timezone = new DateTimeZone($_GET['timezone']);
}

$username = $_GET["username"];
ChromePhp::log("the user name is: " . $username);

$log = fopen("cal_log.txt", "a");
  
  fwrite($log, 'user is: ' . $username . "\n");
  

/*
  This was the modified code to allow it to load a specific
  user's calendar data based on which current user is logged on and 
  trying to access it.
 */
//$json_path =  $username . 'JSON/events.json';
$jsonpath = '../../../' . $username . '/JSON/events.json';


// Read and parse our events JSON file into an array of event data arrays.
$json = file_get_contents($jsonpath);
$input_arrays = json_decode($json, true);
fwrite($log, "data is: " . $input_arrays . "\n");
// Accumulate an output array of event data arrays.
$output_arrays = array();
foreach ($input_arrays as $array) {

	// Convert the input array into a useful Event object
	$event = new Event($array, $timezone);

	// If the event is in-bounds, add it to the output
	if ($event->isWithinDayRange($range_start, $range_end)) {
		$output_arrays[] = $event->toArray();
	}
}

fclose($log);
// Send JSON to the client.
echo json_encode($output_arrays);
