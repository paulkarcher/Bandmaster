/*
  eventValidation.js

  This file contains the calendar event
  listeners for adding a new event to a
  calendar. This includes form validation
  and submission of the form.
*/

/*  
  eventValidate is called every time someone
  clicks on the add event button and attaches
  listeners to all the elements in the modal.
  
  It also links dates and times so that
  starting dates/times cannot occur after ending dates/times
  and ending dates/times cannot occur before starting dates/times.
*/
function eventValidate() {
  $('#dateForm .time').timepicker({
    'showDuration': true,
    'timeFormat': 'H:i'
            //'show2400': 'true'
  });
  $('#dateForm .date').datepicker({
    'startDate': '+0d',
    'format': 'yyyy-mm-dd',
    'autoclose': true
  });
  $('#dateForm').datepair();

  /*
    Taken from, used to validate the time value from the form
    http://stackoverflow.com/questions/12029111/jquery-validating-time-value-on-a-form-correct-way
   */
  $.validator.addMethod("time24", function (value, element) {
    return value === '' || value.match(/^([0-2][0-9]|2[0-3]):[0-5][0-9]$/);
  }, "Invalid time format.");
  
  /*
    Rules required for each input to be valid
   */
  $('#addEvent').validate({
    rules: {
      event_name: {
        required: true
      },
      event_location: {
        required: true
      },
      date_start: {
        required: true
      },
      time_start: {
        required: true,
        time24: true
      },
      date_end: {
        required: true
      },
      time_end: {
        required: true,
        time24: true
      }


      /* holding on to this method as a reference for how to use the equalTo method
       * confirm_password: {equalTo: '#password'},
       spam: "required"
       }, /* end rules */
      //},
    },
    /*
      Error messages displayed when input is entered incorrectly
     */
    messages: {
      event_name: {
        required: "Please supply the name of your event."
      },
      event_location: {
        required: "Please supply the location of your event."
      },
      time_start: {
        required: "Please supply the starting time of your event."
      },
      date_start: {
        required: 'Please supply the starting date of your event'
      },
      time_end: {
        required: "Please supply the ending time of your event"
      },
      date_end: {
        required: 'Please supply the ending date of your event'
      }
    },
    /*
      Place the error messages right next to the incorrect inputs
     */
    errorPlacement: function (error, element) {
      error.appendTo(element.nextAll('span:first'));
      //$(obj).closest('tr').next().find('.class');
      //alert(element.find("span"));
    },
    
    /*
      Triggered when all inputs are considered to be valid.
      Encode all the form input information to a string to make it
      easy to pass to php via ajax.
      
      If there is an error, close the modal and log the error.
      
      Also performs a bit more logging that was crucial to debugging.
     */
    submitHandler: function (form) {
      $(form).ajaxSubmit({
        type: "POST",
        data: $(form).serialize(),
        url: "submitEvent.php",
        success: function () {
          $("#eventDialog").dialog("close");
          console.log("Form submitted successfully.");
          console.log($(form).serialize());
          $("#calendar").fullCalendar('refetchEvents');
          console.log($("#calendar").fullCalendar('clientEvents'));
        },
        error: function () {
          $("#eventDialog").dialog("close");
          console.log("Form failed to submit.");
          var loc = window.location.pathname;
          var dir = loc.substring(0, loc.lastIndexOf('/'));
          console.log(dir);
        }
      });
    } //end submitHandler
  }); // end validate
}
/*
 function formSuccess() {
 alert("asd");
 $.ajax({
 type: "POST",
 url: "submitEvent.php",
 data: data1,
 cache: false,
 success: function (result) {
 alert(result);
 }
 });
 var $form = $("#addEvent");
 //var data1 = getFormData($form);
 var data1 = "asd = 1";
 console.log(data1);
 }
 
 function getFormData($form) {
 var unindexed_array = $form.serializeArray();
 var indexed_array = {};
 $.map(unindexed_array, function (n, i) {
 indexed_array[n['name']] = n['value'];
 });
 return indexed_array;
 }
 */
