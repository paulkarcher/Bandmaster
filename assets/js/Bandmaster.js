/*
 Bandmaster.js
 
 This file contains the AngularJS controller for
 controlling the administrator page.
 */

//  Global variables
//  bandmaster is the angular module for the entire page.
var bandmaster = angular.module('bandmaster', []);
var path = "default_localpath";
var globalpath = "";


//AngularJS controller.
bandmaster.controller("bandmasterCtrl", function ($scope, $http, $window) {
  $scope.path = $window.thisPath;

  $scope.playing = false;
  //$scope.playbackIcon = globalpath + "assets/img/playIcon.png";


  //audioActive is used to store the currenly selected song and its associated information.
  $scope.audioActive = "";

  $scope.activeSong = "";
  //The song name currenly being played.
  $scope.nowPlaying = "";

  //Default song list.
  $scope.currentSongList = "songs";

  //Variable to control the width of the upload progress bar.
  $scope.uploadProg = 0;

  //Current time of a song and the time remaining.
  $scope.timeSpent = "";
  $scope.timeRemaining = "";

  /*
   updateActiveTask will mark the selected task
   as the the current task
   */
  $scope.updateActiveTask = function (i, taskObject) {
    //alert(i);
    if ($scope.activeTask != taskObject.task) {
      $scope.activeTask = taskObject.task;
      $scope.activeTaskIndex = i;
    } else {
      $scope.activeTask = "";
      $scope.activeTaskIndex = null;
    }
  };

  //Updates the uploadProg variable and applies the change to the data model.
  $scope.updateProgress = function (up_Prog) {

    if ($("#mainProgBar").hasClass("hidden")) {
      $("#mainProgBar").removeClass("hidden");
    }

    if (up_Prog === 100) {
      setTimeout(function () {
        $("#mainProgBar").addClass("hidden");
      }, 1000);
    }
    $scope.uploadProg = up_Prog;
    $scope.$apply();
  }

  /*
   updateActive will make the selected song as the
   active song
   */
  $scope.updateActive = function (i, apply) {
    //If the current list is a 'playable' list, the audio player is reset.
    if ($scope.currentSongList === "songs") {
      //Pauses whatever song is playing, resetting the audio player.
      $scope.nowPlaying = "";
      myAudio = document.getElementById('my-audio');
      $scope.playbackIcon = globalpath + "assets/img/playIcon.png";
      myAudio.pause();
      $scope.playing = false;

      //Resets the playhead to 0. There should be a reset() function in future versions.
      if (myAudio.currentTime !== 0) {
        console.log("calling reset");
        $scope.reset();
      }
      //Updates the 'activeSong' object to be the song clicked. Also gets the song name
      // and stores it in the audioActive object.
      if ($scope.activeSong !== i) {
        $scope.activeSong = i;
        $scope.audioActive = $scope.activeSong.name;
        $scope.nowPlaying = "Selected: \"" + $scope.activeSong.name + "\"";
        $scope.updateInfoPanel(i);
        if (apply == true) {
          $scope.$apply();
        }
      } else {
        $scope.nowPlaying = "";
        $scope.activeSong = "";
        $scope.audioActive = "";
        // remove the song information panel
        $("#infoPanel").html("");
      }
    }
  };

  //Rests the audio player, called when a new song is selected or a song end.
  $scope.reset = function (){
        console.log("reset called");
        myAudio.currentTime = 0;
        $scope.timeRemaining = 0;
        $scope.timeSpent = 0;
        var bar = document.getElementById('bar');
        bar.style.width = 0;
  }
  
  // Adds the currently selected song's information and list of associated files to the 
  // center pane.
  $scope.updateInfoPanel = function (i) {
    // activate the song information panel
    $("#infoPanel").html("");
    var documents = i.documents;

    $("#infoPanel").append("<div id='songInfo'>");
    $("#songInfo").append("<h1>" + i.name + "</h1>");
    $("#songInfo").append("<table id='infoTable'>");
    $("#infoTable").append("<tr><td style='text-align: left;'>Song File</td><td><a href='" + path + "uploads/" + i.name + "' target='_blank' download>Download</a></td></tr>");
    if (documents != undefined && documents != null) {
      for (var j = 0; j < documents.length; j++) {
        $("#infoTable").append("<tr><td style='text-align: left;'>" + documents[j] +"</td><td><a href='" + path + "uploads/" + documents[j] + "' target='_blank' download>Download</a></td></tr>");
      }
    }
    $("#infoTable").append("</table>");
  }


  // Toggles the playback. Pauses if playing, plays if paused.
  $scope.togglePlayback = function () {
    var myAudio = document.getElementById('my-audio');

    if ($scope.audioActive !== "") {
      if ($scope.playing) {
        $scope.playing = false;
        $scope.playbackIcon = globalpath + "assets/img/playIcon.png";
        myAudio.pause();
      } else {
        $scope.nowPlaying = "Playing: \"" + $scope.audioActive + "\"";
        $scope.playing = true;
        $scope.playbackIcon = globalpath + "assets/img/pauseIcon.png";
        myAudio.play();
      }
    }
  };

  // Loads the finished list of songs
  $scope.changeList = function (listName) {
    $scope.currentSongList = listName;

    //Fetches the song list, stored in a JSON file, via AJAX
    $http.get(path + '/JSON/' + listName + '.json').success(function (data) {
      $scope.myList = data;
    });
  };

  // Used to drage the playhead to a desired location.
  $scope.clickedPlayhead = function (e, doc) {

    var clickPosition = (e.pageX - doc.offsetLeft) / doc.offsetWidth;
    //console.log("clickedplayhead: " + e.pageX);
    var p = $("#circle1");
    var position = p.offset().left;
    // console.log(p.position().left);
    var touchPos = 0;

    if (typeof e.originalEvent.targetTouches !== 'undefined') {
      var endCoords = e.originalEvent.targetTouches[0];
      touchPos = Math.floor(endCoords.pageX);
      // console.log("d: "+Math.abs(position - touchPos));
      return (Math.abs(position - touchPos) < 15);
    } else {
      //  console.log(Math.abs(position - e.pageX));
      return Math.abs(position - e.pageX) < 15;
    }
  };


  /*
   load is called when the body of the page is loaded.
   It will initialize and maintain the progress bar
   */
  $scope.load = function (client, userName) {

    //  console.log(client);
    // console.log(userName);
    if (client === 'admin') {
      path = 'users/' + userName + '/';
      globalpath = "";
    } else if (client === 'public') {
      path = $scope.path;
      path = path.substring(17, path.length - 1);
      console.log("modified path:" + path);
      path = "";
      globalpath = "../../";
    }

    //console.log("path is:" + path);

    var progress = document.getElementById('progress');
    var myAudio = document.getElementById('my-audio');
    var bar = document.getElementById('bar');
    var playheadClicked = false;
    $scope.playbackIcon = globalpath + "assets/img/playIcon.png";
    console.log(globalpath + "assets/img/playIcon.png");

    //When the song ends, the playhead is reset. Again, there should be a reset function in here.
    myAudio.addEventListener("ended", function () {
      console.log("song ended");
      $scope.playbackIcon = globalpath + "assets/img/playIcon.png";
      $scope.nowPlaying = "";
      $scope.$apply();
      $scope.togglePlayback();
      $scope.reset();
      this.currentTime = 0;
    });

    //Continously updates the current time of the song and moves the playhead accordingly.
    myAudio.addEventListener('timeupdate', function () {

      //Sets the remaining time and current time in the song
      $scope.timeSpent = Math.floor(myAudio.currentTime);
      $scope.timeRemaining = Math.floor(myAudio.duration) - Math.floor(myAudio.currentTime);
      $scope.$apply();


      // This is used to make sure the play head does not get pushed out of the progress
      // bar. Checks the distance from the edge, if the distance is too small, the playhead
      // is fixed.
      if (!playheadClicked) {
      
        var rt = $('#bar').offset().left + $('#bar').outerWidth();
        var circleEdge = $('#circle1').offset().left + $('#circle1').outerWidth();
        var progEnd = $('#progress').offset().left + $('#progress').outerWidth();

        if(circleEdge >= progEnd){
          $("#circle1").offset({ top: $('#circle1').offset().top, left: rt-10})
        }
        else{
          bar.style.width = parseFloat(((myAudio.currentTime / myAudio.duration) * 100), 10) + "%";
        }
      }
    });

    $(progress).bind("mousedown", function (e) {
      playheadClicked = $scope.clickedPlayhead(e, this);
      // console.log("mousedown");
    });

    //If the user is on a mobile browser, touch events are used to handle playhead manipulation.
    if (mobileCheck()) {
      var startCoord = 0;

      $(progress).bind("touchstart", function (e) {
        startCoord = e.originalEvent.targetTouches[0].pageX;
        playheadClicked = $scope.clickedPlayhead(e, this);
      });

      $(document).bind('touchmove', function (e) {
        var endCoords = e.originalEvent.targetTouches[0];
        var mousePos = Math.floor(endCoords.pageX);
        var clickPosition = ((mousePos - $('#progress').offset().left) / progress.offsetWidth);
        var clickTime = (clickPosition * myAudio.duration);

        if (playheadClicked) {
          e.preventDefault();
          bar.style.width = Math.floor((((((mousePos - $('#progress').offset().left) / progress.offsetWidth) * myAudio.duration) / myAudio.duration) * 100)) + "%";
          myAudio.currentTime = clickTime;
        }
      });

      $(progress).bind('touchend', function (e) {
        if (!playheadClicked) {
          e.stopPropagation();
          e.preventDefault();
          var clickPosition = ((startCoord - $('#progress').offset().left) / progress.offsetWidth);
          var clickTime = (clickPosition * myAudio.duration);
          myAudio.currentTime = clickTime;
          bar.style.width = (((((startCoord - $('#progress').offset().left) / progress.offsetWidth) * myAudio.duration) / myAudio.duration) * 100) + "%";
        }
      });

      $(document.documentElement).bind('touchend', function (e) {
        playheadClicked = false;
      });
    }

    //If not on a mobile browser, mouse events are used for playhead manipulation.
    else {
      $(document.documentElement).bind('mousemove touchmove', function (e) {
        if (playheadClicked) {
          //console.log("playheadClickedMouseDown");
          var mousePos = Math.floor(e.pageX);
          e.stopPropagation();
          e.preventDefault();
          var clickPosition = ((e.pageX - $('#progress').offset().left) / progress.offsetWidth);
          var clickTime = (clickPosition * myAudio.duration);
          myAudio.currentTime = clickTime;
          bar.style.width = (((((mousePos - $('#progress').offset().left) / progress.offsetWidth) * myAudio.duration) / myAudio.duration) * 100) + "%";
        }
      });

      $(document.documentElement).bind("mouseup", function (e) {
        playheadClicked = false;
      });

      $(progress).bind("mouseup", function (e) {
        if (!playheadClicked) {
          var clickPosition = ((e.pageX - $('#progress').offset().left) / progress.offsetWidth);
          var clickTime = (clickPosition * myAudio.duration);
          myAudio.currentTime = clickTime;
          bar.style.width = parseInt(((myAudio.currentTime / myAudio.duration) * 100), 10) + "%";
        }
      });
    }
    // Fetch the song list, task list, and settings on page load
    $http.get(path + 'JSON/songs.json').success(function (data) {
      console.log("Fetching songs - first time");
      $scope.myList = data;
    });
    $http.get(path + 'JSON/taskList.json').success(function (data) {
      console.log("Fetching tasks - first time");
      $scope.taskList = data;
    });
    $http.get(path + 'JSON/settings.json').success(function (data) {
      console.log("Fetching settings");
      $scope.bandname = data.bandname;
    });

  }; // end load()

  //Allows for the toggling of playback using the space bar.
  var keyValid = true;

  //Checks if the user presses the enter key, allowing them to add a task. 
  $('#taskInput').keydown(function (e) {
    if (e.which === 13) {
      $scope.addTask();
    }
  });

  // Checks if the user presses the space bar, used to toggle playback. 
  $(document).keydown(function (e) {
    if (e.which === 32 && !($('input').is(':focus')) && keyValid) {
      e.preventDefault();
      $scope.togglePlayback();
      keyValid = false;
    }
  });

  $(document).on('keyup', function (e) {
    keyValid = true;
  });


  //Used to generate a green circle effect when the user is doing drag-and-drop. 
  var counter = 0;
  var droppingFile = false;

  // bind actions to the drop div, used for
  // drag and drop file upload
  $('#drop').bind({
    dragenter: function () {
      counter++;
      if (!droppingFile) {
        //console.log("this guy");
        droppingFile = true;
        
        $("#green_circle").css({
          "-webkit-transform": "scale( 2 )",
          "-moz-transform": "scale( 2 )",
          "-o-transform": "scale( 2 )",
          "-ms-transform": "scale( 2 )",
          "transform": "scale( 2 )",
          "background": "#00ff00",
          "opacity": "0.5"
        });
      }
    },
    dragleave: function () {
      counter--;
      if (counter === 0 && droppingFile) {
        console.log("that guy");
        droppingFile = false;

        $("#green_circle").css({
          "-webkit-transform": "scale( .1 )",
          "-moz-transform": "scale( .1 )",
          "-o-transform": "scale( .1 )",
          "-ms-transform": "scale( .1 )",
          "transform": "scale( .1 )",
          "background": "grey",
          "opacity": "0.0"
        });
      }
    },
    drop: function () {
      console.log("dropped");
      counter = 0;
      droppingFile = false;
      $("#green_circle").css({
        "-webkit-transform": "scale( 3 )",
        "-moz-transform": "scale( 3 )",
        "-o-transform": "scale( 3 )",
        "-ms-transform": "scale( 3 )",
        "transform": "scale( 3 )",
        "opacity": "0.0"
      });
    }
  });

  // updateJSON will update the songs and tasks from their respective json files
  $scope.updateJSON = function () {
    $http.get(path + 'JSON/songs.json').success(function (data) {
      $scope.myList = data;
      console.log($scope.myList.length);
      for (var j = 0; j < $scope.myList.length; j++) {
        if ($scope.myList[j].name == $scope.activeSong.name) {
          $scope.activeSong = $scope.myList[j];
        }
      }
      if ($scope.activeSong != "") {
        $scope.updateInfoPanel($scope.activeSong);
      }
    });
    $http.get(path + 'JSON/taskList.json').success(function (data) {
      $scope.taskList = data;
    });
  };

  /*
   changeName will change the bands name in the json file and update the UI
   */
  $scope.changeName = function () {
    $("#changeNameBox").addClass("hidden");
    $("#changeNameButton").removeClass("hidden");
    $("#bandname").removeClass("hidden");

    var str = $("#nameInput").val();

    $.ajax({
      type: 'POST',
      url: path + 'functions.php',
      data: {
        func: "changeName",
        name: str
      },
      success: function (res) {
        console.log(res);
        $scope.bandname = str;
        $scope.$apply();
      }
    });
  };

  /*
   addTask will add a new task. It will send the task to be added
   to function.php which will append a new task to the taskList.json
   array, and when it receives a response from the server it will
   update the UI
   */
  $scope.addTask = function () {
    $("#newTaskBox").addClass("hidden");
    $("#newTaskButton").removeClass("hidden");
    var str = $("#taskInput").val();
    if (str == '') {
      console.log("cannot add empty task");
      return;
    }
    $('#taskInput').val('');
    console.log("adding " + str + " as a new task.")
    $.ajax({
      type: 'POST',
      url: path + 'functions.php',
      data: {
        func: "addTask",
        newTask: str
      },
      success: function (res) {
        console.log(res);
        $scope.taskList.push({
          task: str
        });
        $scope.$apply();
      }
    });
  };

  /*
   removeActiveTask will remove the currently selected task
   and set the active task back to undefined.
   */
  $scope.removeActiveTask = function () {
    if ($scope.activeTaskIndex == null || $scope.activeTaskIndex == undefined) {
      console.log("cannot remove undefined task");
      return;
    }
    console.log("removing task #" + $scope.activeTaskIndex);
    $.ajax({
      type: 'POST',
      url: path + 'functions.php',
      data: {
        func: "deleteTask",
        index: $scope.activeTaskIndex
      },
      success: function (res) {
        console.log(res);
        $scope.taskList.splice($scope.activeTaskIndex, 1);
        $scope.$apply();
        $scope.activeTaskIndex = undefined;
      }
    });
  };

  /*
   delModal will delete the currently selected file
  */
  $scope.delModal = function(songObject, index){  
    $('#eventDialog').html("<span>Are you sure you want to delete " + songObject.name + "?<br> This cannot be undone.</span>");
    $("#eventDialog").dialog({
      height: 150,
      width: 500,
      modal: true,
      resizable: true,
      title: 'Confirm Deletion',
        buttons: {
          CLOSE: function () {
            $("#eventDialog").dialog("close");
          },
          "DELETE": function () {
            console.log("sending file delete request. file: " + index);
            if ($scope.audioActive == songObject.name) {
              $scope.playbackIcon = globalpath + "assets/img/playIcon.png";
              $scope.nowPlaying = ""
              $scope.playing = false;
              $scope.activeSong = "";
              $scope.audioActive = "";
              $("#songInfo").addClass("hidden");
            }
            $("#eventDialog").dialog("close");
            $.ajax({
              type: 'POST',
              url: path + 'functions.php',
              data: {
              func: "deleteFile",
              index: index,
              filename: songObject.name
            },
              success: function (res) {
              console.log(res);
              $scope.myList.splice(index, 1);
              $scope.$apply();
            }
          });
        }
      }
    });
  }
  
    //String used to create a modal for adding events. Used in $scope.eventModal()
    var eventFormStr = '<form class="cmxform" name="addEvent" id="addEvent" method="post" action="javascript:void(0);">'
        +'<table class="formAlign">'
          +'<tr>'
            +'<td>'
              +'<label for="event_name" class="label">Name:</label>'
            +'</td>'
            +'<td>'
              +'<input name="event_name" type="text" id="cevent_name" value="">'
              +'<span id="error_event_name"></span>'
            +'</td>'
          +'</tr>'
          +'<tr>'
            +'<td>'
              +'<label for="event_location" class="label">Location:</label>'
            +'</td>'
            +'<td>'
              +'<input name="event_location" type="text" id="cevent_location" value="">'
              +'<span id="error_event_location"></span>'
            +'</td>'
          +'</tr>'
          +'<tr id="dateForm">'
            +'<td>'
              +'<label class="label">When:</label>'
            +'</td>'
            +'<td>'
              +'<!-- div tag used here to group each label/input/error placement -->'
              +'<div>'
                +'<label for="date_start" class="label">Date:</label>'
                +'<input name="date_start" type="text" class="date start" id ="cdate_start"/>'
                +'<span id="error_date_start"></span>'
              +'</div>'
              +'<div>'
                +'<label for="time_start" class="label">Time:</label>'
                +'<input name="time_start" type="text" class="time start" id="ctime_start"/>'
                +'<span id="error_time_start"></span>'
              +'</div>'
              +'<label class="label">to</label><br>'
              +'<div>'
                +'<label for="time_end" class="label">Time:</label>'
                +'<input name="time_end" type="text" class="time end" id="ctime_end"/>'
                +'<span id="error_time_end"></span>'
              +'</div>'
              +'<div>'
                +'<label for="date_end" class="label">Date:</label>'
                +'<input name="date_end" type="text" class="date end" id="cdate_end"/>'
                +'<span id="error_date_end"></span>'
              +'</div>'
            +'</td>'
          +'</tr>'
      +'</table>'
      +'<input type="hidden" name="user_name" value=' + username + '>'
    +'</form>';

  //Shows modal to user to create calendar events. 
  $scope.eventModal = function(){  
    $('#eventDialog').html(eventFormStr);
    $("#eventDialog").dialog({
      height: 350,
      width: 500,
      modal: true,
      resizable: true,
      title: 'Add a Calendar Event:',
      buttons: {
        CLOSE: function () {
          $("#eventDialog").dialog("close");
        },
        "ADD EVENT": function () {
          $("#addEvent").submit();
        }
      }
    });
    eventValidate();
  }


}); //End bandmaster.controller

//Custom filter for the song lengths. As these are not stored as strings, the colon
// must be added manually. Its likely there is a built in angular filter to take care
// of this, but I thought it would be good practice to create a pair of custom filters.
bandmaster.filter("lengthFilter", function () {
  return function (int) {
    //Simple algorithm to separate the length and add a colon in the appropriate location.
    var str = int.toString();
    var front = str.substring(0, str.length - 2);
    str = str.substring(str.length - 2, str.length);
    return front + ":" + str;
  };
});

//Custom filter for the song names.
bandmaster.filter("audioFilter", function () {
  return function (i) {
    return path + "uploads/" + i;
  };
});
// Another custom filter that calulates the total time. As the total time is saved in
// seconds, a short algorithm is used to calculate the total hours, minutes and remaining
// seconds. Again, this soft of filter is likley to be bulit in to Angular, but it seemed
// like a good thing to practice.
bandmaster.filter("timeFilter", function () {
  return function (time) {
    var seconds = time % 60;
    var minutes = (time - seconds) / 60;
    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes >= 60) {
      var hours = Math.floor(minutes / 60);
      minutes = minutes - (hours * 60);
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      return hours + "h, " + minutes + "m, " + seconds + "s";
    } else {
      return minutes + ":" + seconds;
    }
  };
});

//Checks if the site is being used on mobile device. This is used to determine whether
// touch events or click events are to be used.
//This was found on the following Stack Overflow thread :
// http://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
window.mobileCheck = function () {
  var check = false;
  (function (a, b) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
      check = true;
      console.log("on mobile");
    } else {
      console.log("not mobile");
    }
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};