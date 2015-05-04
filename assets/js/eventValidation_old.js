$(document).ready(function () {

  $('#datepairExample .time').timepicker({
    'showDuration': true,
    'timeFormat': 'g:ia'
  });
  $('#datepairExample .date').datepicker({
    'format': 'm/d/yyyy',
    'autoclose': true
  });
  $('#datepairExample').datepair();
});