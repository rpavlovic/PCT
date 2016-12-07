
/**
* @module working with dates in form fields.
* @version
*/
var projectDuration = (function ($) {
  'use strict';
  function initProjectDuration(form, inst, dateText) {

    var estimate_end_date = $(form + " input[name=\"enddate\"]"),
        duration = $(form + " input[name=\"duration\"]");

    // var ttt = duration.val(duration.val() + string );

    //date to pick a week
    var curr = new Date($(form + " .datepicker").val()); // get current date
    var first = curr.getDate();
    var last = first + 7;
    var lastday = new Date(curr.setDate(last));
    var month = lastday.getMonth() + 1;
    var weekly_month = month < 10 ? '0' + month : '' + month;

  $(form + " select[name=planby] option:selected").each(function() {

    switch($(this).val()) {
      case 'Weekly':
        if(inst.input.val() != '' && inst.input != 'indefined') {
          estimate_end_date.val(weekly_month + '/' + lastday.getDate() + '/' + lastday.getFullYear());
          if($.isNumeric(duration.val()) || $.isNumeric(duration.val()).length > 0) {
            duration.val(duration.val() + ' Weeks');
          } else {
            duration.val();
          }
        }
        break;
      case 'Monthly':
      if($.isNumeric(duration.val()).length > 0  && $.isNumeric(duration.val())) {
          duration.val(duration.val() + ' Months');
      } else {
        duration.val();
      }


        break;
      case 'Summary':
          duration.val(duration.val() + ' Sum');
        break;
      }
  })
      var options = $(form + " select[name=planby] option:selected");


  }
  return {
      initProjectDuration:initProjectDuration
  }

})($);


