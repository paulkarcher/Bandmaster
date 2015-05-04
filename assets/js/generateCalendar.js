/*
      Bandmaster
      generateCalendar.js
      authors: David Lordan, Paul Karcher, Dean Marsinelli
      last updated: 5/1/2015

      This file sets up the calendar for the 
      administrator page and the public page by loading the
      user's event.json calendar data. It also provides
      the functionality of deleting events to the admin of
      that user account.
*/

$(document).ready(function () {
  /*
   
   old code that loaded the calendar on a delay
   
   function onCalLoad(isLoading, view) {
   if (isLoading) {
   setTimeout(onCalLoad, 300);
   } else {
   if ($('#calendar').fullCalendar('clientEvents').length === 0) {
   console.log("clientEvents loaded successfully.");
   console.log($('#calendar').fullCalendar('clientEvents').length);
   }
   var loc = window.location.pathname;
   var dir = loc.substring(0, loc.lastIndexOf('/'));
   console.log(dir);
   }
   }*/
  console.log('username is: ' + username);
  console.log(location.pathname);

  /* 
    which path to fetch the get-events.php file depending on whether it
    is being run inside the admin's directory or a user's
  */ 
  var getEventsURL;
  if (location.pathname.indexOf('admin') !== -1) {
    console.log('from Admin');
    getEventsURL = '../BandMaster_final/assets/php/fullcalendar/get-events.php';
  } else {
    console.log('from user');
    getEventsURL = '../../assets/php/fullcalendar/get-events.php';
  }

  /*
    Settings for how the calendar loads and functions with user clicking
    events on the calendar
   */
  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    //defaultDate: '2015-02-12',

    /* disables dragging and dropping */
    editable: false,
    eventLimit: true, // allow "more" link when too many events
    
    /*
      Loading the eventsURL depending on whether user is an admin or not.
      Error handling for a bad event file handled as with console logging
      for easier debugging
    */ 
    //type: POST,
    events: {
      data: {
        username: username
      },
      url: getEventsURL,
      error: function () {
        console.log("failed");
        $('#script-warning').show();
      }
    },
    /*eventSources: [
     'json/events.json'
     ],*/
     
     /*
       Use a boolean to be toggled on and off when the calendar is loading
       or not loading
     */
    loading: function (bool, isLoading) {
      $('#loading').toggle(bool);
      /*if (!isLoading)
       {
       console.log($('#calendar').fullCalendar('clientEvents').length);
       }*/
    },
    /*
      Handling a user clicking on a calendar event.
      Click will bring up a modal displaying the option to deleted the
      event that they clicked along with all related information about
      that event, also includes a close button.
    */
    eventClick: function (calEvent, jsEvent, view) {
      /*
        Store the unique event ID from the calendar to later be passed to
        the php for deleting the selected event
      */
      var $eventID = calEvent.uID;

      /*
        All relevant information related to the currently selected event which is stored
        in a table that will appear within the modal.
      */
      $('#eventDialog').html("<table class=\"formAlign\">" +
              "<tr><td><span><b>Name:</b></td><td>" + calEvent.title + "</span></td></tr>" +
              "<tr><td><span><b>Location:</b></td><td>" + calEvent.location + "</span></td></tr>" +
              "<tr><td><span><b>Start:</b></td><td>" + calEvent.start._d + "</span></td></tr>" +
              "<tr><td><span><b>End:</b></td><td>" + calEvent.end._d + "</span></td></tr></table>");
      console.log(calEvent);
      console.log("iddd" + $eventID);

      /*
        Debugging purposes, check if we are the admin
      */
      console.log("admin?" + (location.pathname.indexOf('admin') !== -1));
      
      /*
        If we are the admin then load the modal with these settings.
        Admin settings include an option to delete the currently selected event.
      */
      if (location.pathname.indexOf('admin') !== -1)
      {
        $("#eventDialog").dialog({
          resizable: false,
          height: 280,
          width: 500,
          modal: true,
          title: 'Event Information',
          buttons: {
            CLOSE: function () {
              $("#eventDialog").dialog("close");
              console.log("Closed, id =");
              console.log($eventID);
            },
            /*
              Function which allows deleting of the currently selected
              event. Pass the event ID and the username, this data will
              allow the deleteEvent.php file to find the unique event ID from
              the given username's calendar json data(users/username/JSON/events.json)
              and delete it from there.
             */
            "DELETE": function () {
              $.ajax({
                type: "POST",
                data: {
                  eventID: $eventID,
                  username: username
                },
                url: "deleteEvent.php",
                success: function () {
                  console.log("Event deleted successfully.");
                  console.log("success " + $eventID);
                  /* refetch events before close in order to reduce duration of
                   * user seeing the calendar flash while the calendar refreshes */
                  $("#calendar").fullCalendar('refetchEvents');
                  $("#eventDialog").dialog("close");
                },
                error: function () {
                  console.log("Event failed to delete.");
                  var loc = window.location.pathname;
                  var dir = loc.substring(0, loc.lastIndexOf('/'));
                  console.log(dir);
                }
              });
            }
          }
        });
      }
      /*
        If we are not the admin then do not include access to a delete
        button in the modal.
      */
      else
      {
        $("#eventDialog").dialog({
          resizable: false,
          height: 280,
          width: 500,
          modal: true,
          title: 'Event Information',
          buttons: {
            CLOSE: function () {
              $("#eventDialog").dialog("close");
              console.log("Closed, id =");
              console.log($eventID);
            }
          }
        });
      }
    }
  });
});
