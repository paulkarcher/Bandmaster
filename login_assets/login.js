/*
      Bandmaster
      login.js
      authors: David Lordan, Paul Karcher, Dean Marsinelli
      last updated: 5/1/2015

      This file contains various functions that are used to create and log in to accounts.
*/

// Function that takes a user name and password and allows a user to login. 
// Relies on login.php and auth.php to authenticate users. 
function login(userName, password) {
  $.ajax({
    url: "login_assets/login.php",
    data: {
      action: 'login',
      username: userName.value,
      password: password.value
    },
    type: "POST",
    dataType: "text",
    success: function(response) {
      console.log(response);
      //Checks if a username doest not exist or if the credentials are invalid. 
      switch (response) {
      case 'DNE':
        {
          console.log('DNE');
          var msg = "Cannot find a record of this account.";
          $("#windowMessage").html(msg);
          break;
        }
      case 'INVALID':
        {
          console.log('invalid');
          var msg = "Invalid username/password. Please try again.";
          $("#windowMessage").html(msg);
          break;
        }
        
        // The credentials are correct the user is logged in but sending the information
        // to a dummy form which is then submitted, navigating to admin.php with, which then
        // fetches the user's data. 
      case 'LOGIN':
        {
          console.log('login');
          $('body').append($('<form/>').attr({
            'action': "admin.php",
            'method': 'post',
            'id': 'dummyForm'
          }).append($('<input/>').attr({
            'type': 'hidden',
            'name': 'username',
            'value': userName.value
          }))).find('#dummyForm').submit();
        }
      }
    },
    error: function(srvrMsg) {
      console.log('error');
    }
  })
}


// Function to create a user account, relies on create.php and checkuser.php
// The function will display an appropriate message to the user if there is an
// error, or if the new account is created successfully. 
function makeAccount(userName, password, confirm) {
  if (password.value !== confirm.value) {
    console.log('Passwords do not match.');
    var msg = 'The passwords provided do not match, please try again.';
    $('#windowMessage').html(msg);
  } else {
    $.ajax({
      url: "login_assets/create.php",
      data: {
        action: 'startCreation',
        username: userName.value,
        password: password.value
      },
      type: "POST",
      dataType: "text",
      success: function(srvrMsg) {
        console.log(srvrMsg);
        switch (srvrMsg) {
        case 'SUCCESS':
          {
            // If an account is created successfully, links to both the new account and the 
            // public page are shown to the user. 
            console.log("Account Created");
            $.ajax({
              url: "login_assets/newAccountSuccess.html",
              success: function(result) {
                $("#loginContainer").html(result)
                var newURL = '<a href="users/' + userName.value + '">/bandmaster/users/' + userName.value + '</a>'
                $("#newPageLink").html(newURL);
                $('body').append($('<form/>').attr({
                  'action': "admin.php",
                  'method': 'post',
                  'id': 'dummyForm'
                }).append($('<input/>').attr({
                  'type': 'hidden',
                  'name': 'username',
                  'value': userName.value
                })));
              }
            });
            break;
          }
        case 'FAILURE':
          {
            console.log('Account exists');
            var msg = "'" + userName.value + "' is already taken, please try again."
            $("#windowMessage").html(msg);
            break;
          }
        case 'RESTRICTED':
          {
            console.log('Acount name restricted.');
            var msg = "'" + userName.value + "' is a restricted name, please try again."
            $("#windowMessage").html(msg);
            break;
          }
         case 'SPECIAL':
         {
           var msg = "The username you have selected contains special characters. Please try again using only letters or numbers."
           $("#windowMessage").html(msg);
           break;
         }
         case 'TOO_LONG':
         {
           var msg = "The username you have selected is too long, usernames must be less than 25 characters. Please try again."
           $("#windowMessage").html(msg);
           break;
         }
        }
      },
      error: function(srvrMsg) {
        console.log(srvrMsg);
      }
    })
  }
}

// Used to fetch and display the new account window to the user. 
function showAccountCreation() {
  $.ajax({
    url: "login_assets/accountCreation.html",
    success: function(result) {
      $("#loginContainer").html(result);
      $("#userName").trigger("focus");
    }
  })
}

// Fetches and displays the login window to the user. 
function showLogin() {
  $.ajax({
    url: "login_assets/loginWindow.html",
    success: function(result) {
      $("#loginContainer").html(result);
      $("#userName").trigger("focus");
    }
  })
}

// Fetches and displays the welcome message to the user. This is the first thing a user
// sees when the navigate to the login page. 
function showWelcome() {
  $.ajax({
    url: "login_assets/welcome.html",
    success: function(result) {
      $("#loginContainer").html(result);
    }
  })
}

// Function to start a loop through a series of images for the login background.
// The function is called once when the login page is first loaded. The loop itself is set within
// the function
function loopImages() {

  //Array of image names.
  var imageArray = ["drummer.jpg", "sheetMusic.jpg", "studio1.jpg", "piano.jpg", "fretboard.jpg", "microphone.jpg", "strat.jpg", "GBBlur.jpg", "drummer.jpg"];

  // Index of the starting image. This can be used to set the starting image as any point in the array.
  // If the starting index is out of bounds of the image array, it will be set to 0. 
  var imageIterator = 0;
  var imageTime = 1500;

  //console.log('outsideLoop');
  // Loop to travel through the images.
  setInterval(function() {

    // Increments the image index. If the index is out of bounds, it will be set to 0. 
    imageIterator = normalizeIt(++imageIterator, imageArray);

    // Grabs the next front and back image names.
    var nextFront = imageArray[imageIterator];
    var nextBack = imageArray[imageIterator + 1];

    // Grabs the next front and back images.
    var backImages = document.getElementById('backImages');
    var frontImages = document.getElementById('frontImages');

    // Begins a fade out of the front image, reveal the back image. 
    $("#frontImages").fadeOut(imageTime, function() {

      // When the front image has completely faded out, it is set to match the back image, 
      // though it is still hidden.
      frontImages.style.backgroundImage = "url('login_assets/images/" + nextFront + "')";

      // The front image is set to instantly fade in. Because the front image now matches the back
      // this change is not observable. 
      $("#frontImages").fadeIn(0, function() {

        // Changes the back image. 
        backImages.style.backgroundImage = "url('login_assets/images/" + nextBack + "')";
      });

    });

  }, imageTime * 5); //end set interval
} // end loopImages
// Function to set the image array index to 0 if it goes out of bounds. 
// This allows a continuously incremented index to force a circular array. 
function normalizeIt(_it, _array) {

  if (_it >= _array.length - 1) {
    return 0;
  } else {
    return _it;
  }
}

// Begins the image loop when the page is loaded.
$(document).ready(loopImages);
$(document).ready(showWelcome);
