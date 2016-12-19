
/**
* @module working with dates in form fields.
* @version
*/
var projectDuration = (function ($) {
  'use strict';

  function initProjectDuration(form) {

    var estimate_end_date = $(form + " input[name=\"enddate\"]"),
        duration = $(form + " input[name=\"duration\"]");

    //date to pick a week
    var curr = new Date($(form + " .datepicker").val()); // get current date
    var first = curr.getDate();
    var last = first + 7;
    var lastday = new Date(curr.setDate(last));
    var month = lastday.getMonth() + 1;
    var weekly_month = month < 10 ? '0' + month : '' + month;

    function choose_planBy(inst) {
      $(form + " select[name='planby'] option:selected").each(function() {
        console.log($(this).val());
        switch(inst.input.val()) {
          case 'Weekly':

            if(inst.input.val() != '' && inst.input != 'indefined') {
              estimate_end_date.val(weekly_month + '/' + lastday.getDate() + '/' + lastday.getFullYear());
              if($.isNumeric(duration.val()) || $.isNumeric(duration.val()).length > 0) {
                duration.val(duration.val() + (duration.val() == 1 ? ' Week': ' Weeks'));
              } else {
                duration.val();
              }
            }
            break;
          case 'Monthly':
          if($.isNumeric(duration.val()) || $.isNumeric(duration.val()).length > 0) {
            duration.val(duration.val() + (duration.val() == 1 ? ' Month': ' Months'));
          } else {
            duration.val();
          }
            break;
          case 'Summary':
              duration.val(duration.val() + ' Sum');
            break;
          }
        });
      }

$( ".datepicker" ).datepicker({
  onSelect: function(dateText, instance) {
    choose_planBy(instance);
    // projectDuration.initProjectDuration('.project-info', instance, dateText);
    // floatLabel.initfloatLabel();
  }
});
    }


  return {
    initProjectDuration:initProjectDuration
  }

})($);


