<?php

/*
      Bandmaster
      admin.php
      authors: David Lordan, Paul Karcher, Dean Marsinelli
      last updated: 5/1/2015

      Page that loads for an admin that is logged in.
*/

header("Expires: Tue, 01 Jan 2000 00:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

require 'login_assets/auth.php';
require 'assets/php/chromePHP.php';
ChromePhp::log('Chrome PHP is working.');

if (isset($_POST["username"]) == false) {
  header("Location: index.html");
  die();
};

$name = $_POST["username"];
date_default_timezone_set('America/New_York');
$log = fopen("user_log.txt", "a");
fwrite($log, "\n\n" . date("m/d/Y @ g:i:sA") . " - User " . $name . " attemping to log in\n");

fwrite($log, date("m/d/Y @ g:i:sA") . " - User " . $name . " logged in successfully");
fclose($log);
// open up the settings json file for this user
$file = file_get_contents('./users/' . $name . '/JSON/settings.json', true);
$settings = json_decode($file, true);
unset($file);

/*
  Successful login will show the admin page for the user
 */
$html = <<<HTML
<!DOCTYPE html>
<html ng-app="bandmaster">
  <head>
    <title>Bandmaster Hub</title>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="-1">
    <meta http-equiv="CACHE-CONTROL" content="NO-CACHE">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!--
      Bandmaster
      admin.php
      authors: David Lordan, Paul Karcher, Dean Marsinelli
      last updated: 5/1/2015

      This page serves as the admin page for bands where users
      can upload content, add tasks, and add calendar events for
      their band.
    -->
    <link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="assets/img/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/img/favicon-16x16.png">
    
    <script>
      var username = "users/$name";
      console.log(username);
    </script>
    <!-- Links to include bootstrap and jQuery -->
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
    <!-- Link to load the AngularJS framework.-->
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.27/angular.min.js"></script>
   
    <!-- jQuery File Upload Dependencies -->
    <script src="assets/js/jquery.ui.widget.js"></script>
    <script src="assets/js/jquery.fileupload.js"></script>
    <script src="assets/js/jquery.knob.js"></script>

     <!-- External Javascript file containing custom functions and the AngularJS 
         model and controller that allow the page to function -->   
    <script src="assets/js/Bandmaster.js"></script>
    <script src="assets/js/uploadScript.js"></script>
    <script src="assets/js/dialog.js"></script>

    <!-- START JQuery fullcalendar dependencies-->
    <!-- jqueryui library and styling -->
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/themes/smoothness/jquery-ui.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js"></script>

    <!-- jquery.form.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.form/3.51/jquery.form.min.js" type="text/javascript"></script>

    <!-- required libraries for fullcalendar -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.2/moment.min.js" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.3.1/fullcalendar.min.js" type="text/javascript"></script>

    <!-- calendar styling -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.3.1/fullcalendar.css" rel="stylesheet" type="text/css"/>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.3.1/fullcalendar.print.css" rel='stylesheet' type="text/css" media='print' />
    <link href="assets/css/calendarWidgetHub.css" rel="stylesheet" type="text/css"/>

    <!-- timepicker assets !-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-timepicker/1.6.10/jquery.timepicker.min.js" type="text/javascript"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/jquery-timepicker/1.6.10/jquery.timepicker.css" rel="stylesheet" type="text/css"/>

    <!-- datepicker bootstrap assets -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.0/js/bootstrap-datepicker.js" type="text/javascript"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.0/css/bootstrap-datepicker.standalone.css" rel="stylesheet" type="text/css"/>

    <!-- datepair library requirements -->
    <script src="assets/js/Datepair.js" type="text/javascript"></script>
    <script src="assets/js/jquery.datepair.js" type="text/javascript"></script>

    <!-- jquery-validate library -->
    <script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.min.js"></script>

    <!-- verification of input for adding an event -->
    <script src="assets/js/eventValidation.js" type="text/javascript"></script>
    <link href="assets/css/validation.css" rel="stylesheet" type="text/css"/>

    <!-- calendar rendering -->
    <script src="assets/js/generateCalendar.js" type="text/javascript"></script>
    <!-- END JQuery fullcalendar dependencies -->
        
    <!-- CSS styling links -->
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css">
    <link href="assets/css/style.css" rel="stylesheet">

    <script>
     $(document).ready(function() {
      // random number between 0 and 3
      var num = Math.floor((Math.random() * 4));
      $('body').css('background', '#000 url(backgrounds/' + num + '.jpg) no-repeat');
      $('body').css('background-size', '100%');

     });
    </script>
  </head>

  <!-- Directive which says this page will use the bandmasterCtrl ng-controller -->
  <body id="mainbody" ng-controller="bandmasterCtrl" ng-init='load("admin", "$name")'>
    <div id="top">
      <p id="beta">Bandmaster - $name - Administrator Dashboard Beta - <a href="users/$name" target="_blank">Click here to go to your public page</a><span id="logout"><a href="index.html">Logout</a></span></p>
    </div>
    <!-- Bootstrap wrapper for the entire body.-->
    <div class="container-fluid">

      <!-- band name will be based off of json data -->
      <div id="header">
        <h1 id="bandname">{{bandname}}</h1>
        <form id="changeNameBox" class="hidden">
          <input id="nameInput" type="text" name="nameInput" value="{{bandname}}"><br>
          <button ng-click="changeName()">Save</button>&nbsp;
          <button onclick="closeChangeName()">Cancel</button>
        </form>
      </div>
      <!-- panes are ordered "incorrect" in the html to make it work with bootstrap -->

      <!-- MIDDLE pane containing the audio player -->
      <div class="col-md-4 col-md-push-4 hubPane">
        <audio id="my-audio" ng-src="{{audioActive|audioFilter}}"></audio>
        <div id="controls">
          <!-- custom play and pause buttons -->
          <input type="image" ng-src="{{playbackIcon}}" alt="UP" ng-click="togglePlayback()">
          <p id="nowPlaying">&nbsp;{{nowPlaying}}&nbsp;</p>
          <div id="time">
            <span id="timeSpent">{{timeSpent| number:0|timeFilter}}</span>
            <span id="timeRemaining">-{{timeRemaining| number:0 |timeFilter}}</span>
          </div> <!-- end time div -->
          <div id="progress">
            <span id="circle2"></span>
            <span id="bar"></span>
            <span id="circle1"></span>
          </div><!-- end progress bar-->
        </div><!-- end controls div-->
        <div id="infoPanel">
          <!-- dynamic content goes here -->
        </div><!-- end infoPanel div -->
      </div> <!-- end of middle pane -->

      <!-- LEFT pane containing the song list -->
      <div class="col-md-4 col-md-pull-4" id="setlist">
        <form id="upload" method="post" action="users/$name/upload.php" enctype="multipart/form-data">
          <input name="songname" id="invisibleName">
          <input name="fileType" id="invisibleFileType">
          <!-- File Upload section -->
          <div id="uploadDiv">
            <p id="uploadType">
              Upload a File
            </p>
            <!-- drop zone div -->
            <div id="drop">
              <p id="uploadTitle">Drag and Drop a File or Press Browse</p>
              <div id="green_circle"></div>
              <div id="uploadLeft">
                <a>Browse</a>
              </div>
              <div id="uploadRight">
                <div id="mainProgBar" class="progress hidden">
                  <div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width:{{uploadProg}}%"></div>
                </div> <!-- end of mainProgBar div -->
              </div>
              <input type="file" name="upl" multiple>
            </div> <!-- end of drop div -->
          </div> <!-- end of file upload -->
        </form>
        <!-- jQuery tabs content -->
        <div id="my-tab-content" class="tab-content">
          <!-- songs -->
          <div class="tab-pane active" id="songs">
            <!-- table for song list -->
            <table class="leftTable">
              <tr>
                <th class="numHeader">#</th>
                <th>Songs</th>
                <th></th>
              </tr>
              <tr ng-class="{activeSongClass: i.name === audioActive}" ng-repeat="i in myList" >
                <td>{{\$index + 1}}</td>
                <td>
                  <button id="songname" ng-click="updateActive(i)">{{i.name}}</button>
                </td>
                <td>
                  <button type="button" data-toggle="modal" data-target="#delModal" ng-click="delModal(i, \$index)">X</button>
                </td>
              </tr>
            </table> <!-- end of song table -->
          </div> <!-- end of songs tab -->
        </div> <!-- end of jQuery tab content -->
      </div> <!-- end of left pane -->

      <!-- RIGHT pane containing task list and calendar-->
      <div class="col-md-4 hubPane">
        <div id="calendar"></div>
        <button type="button" class="eventButton" data-toggle="modal" data-target="#eventModal" ng-click="eventModal()">Add Event</button>
        <div id="eventDialog" title="" style="display:none;"></div>
          <!-- end of calendar -->
          <div id="toDoList">
            <!-- table for task list -->
            <table id="taskTable">
              <tr>
                <th><h2>To Do List</h2></th>
              </tr>
              <tr ng-class="{activeTaskClass: i.task === activeTask}" ng-repeat="i in taskList" >
                <td> <button ng-click="updateActiveTask(\$index, i)">{{i.task}}</button></td>
              </tr>
            </table> <!-- end of task list table -->
            <!-- add/remove task section -->
            <div id="newTaskButton">
              <button onclick="showNewTaskBox()">Add New Task</button>&nbsp;
              <button ng-click="removeActiveTask()">Remove Selected Task</button>
            </div> <!-- end of add/remove task div -->

            <div id="newTaskBox" class="hidden">
              New Task: <input id="taskInput" type="text" name="NewTask" value=""><br>
              <button ng-click="addTask()">Add Task</button>&nbsp;
              <button onclick="closeNewTaskBox()">Close</button>
            </div> 
          </div> <!-- end of toDoList div -->
        </div> <!-- end of right pane -->

      </div> <!-- end of bootstrap container -->
    </body>
  </html>

HTML;

echo $html;
?>
