
/**
* @module working with dates in form fields.
* @version
*/
var projectDuration = (function ($) {
  'use strict';

  function initProjectDuration(form, inst) {

    var estimate_end_date = $(form + " input[name=\"enddate\"]"),
        plan_by = $(form + " select[name='planby'] option:selected").val(),
        estimated_start_date = inst.input.val(),
        duration = $(form + " input[name=\"duration\"]");
        //date to pick a week
        var curr = new Date($(form + " .datepicker").val()), // get current date
            first = curr.getDate(),
            days,
            last = first + 7,
            lastday = new Date(curr.setDate(last)),
            month = lastday.getMonth() + 1,

            weekly_month = month < 10 ? '0' + month : '' + month;

            //Month is 1 based
            function daysInMonth(month,year) {
                return new Date(year, month, 0).getDate();
            }
console.log(daysInMonth(1), lastday.getFullYear());
        // if(plan_by === "Weekly") {
        //   days = 7;
        // } else if (plan_by === "Monthly") {
        //   days = lastday.getMonth() + 1;
        // }


    //date to pick a month




    function choose_planBy() {
      console.log( $(form + " select[name='planby'] option:selected").val());
        $(form + " select[name='planby'] option:selected").each(function() {
          switch($(this).val()) {
          case 'Weekly':

            if(inst.input.val() != '') {
              estimate_end_date.val(weekly_month + '/' + lastday.getDate() + '/' + lastday.getFullYear());
              console.log(estimate_end_date.val());
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
          } //end of switch
    });
    }
    choose_planBy();
  }

  return {
    initProjectDuration:initProjectDuration
  }

})($);


