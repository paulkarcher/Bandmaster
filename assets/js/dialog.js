/*
  dialog.js

  This file contains functions for hiding/revealing forms
  for changing the band name or adding new tasks
*/

// reveals the new task box
var showNewTaskBox = function () {
  $("#newTaskBox").removeClass("hidden");
  $("#newTaskButton").addClass("hidden");
  $("#taskInput").focus();
};

// closes the new task box
var closeNewTaskBox = function () {
  $("#newTaskBox").addClass("hidden");
  $("#newTaskButton").removeClass("hidden");
};

// reveals the change name input field
var showChangeName = function() {
  $("#changeNameBox").removeClass("hidden");
  $("#bandname").addClass("hidden");
};

// closes the change name input field
var closeChangeName = function() {
  $("#changeNameBox").addClass("hidden");
  $("#bandname").removeClass("hidden");
};

// click handler for band name
$(document).ready(function() {
  $("#bandname").click(function() {
    showChangeName();
  });
});
