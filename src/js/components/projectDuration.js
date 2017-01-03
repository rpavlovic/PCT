
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
        duration = $(form + " input[name=\"duration\"]").val(),
        selected_month = new Date(inst.selectedMonth + 1),
        selected_day = new Date(inst.selectedDay),
        selected_year = new Date(inst.selectedYear);

    if(plan_by === "Weekly") {
      daysToAdd = 7;
    } else if (plan_by === "Monthly") {
      daysToAdd = daysInMonth(selected_month, selected_year);
    }


    var curr = new Date(estimated_start_date), // get current date
      first = curr.getDate(),
      daysToAdd,
      last = first + (daysToAdd * parseInt(duration)),
      lastday = new Date(curr.setDate(last)),
      month = (lastday.getMonth()+1),
      weekly_month = (month) < 10 ? '0' + month : '' + month;

    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];


    function daysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    }

    function choose_planBy() {
      if($.isNumeric(duration) && duration.length > 0) {
        var duration_input = estimate_end_date.val(monthNames[lastday.getMonth()] + ' ' + lastday.getDate() + ', ' + lastday.getFullYear());
        $(form + " select[name='planby'] option:selected").each(function() {
          switch($(this).val()) {
            case 'Weekly':
              duration_input;
              $(form + " input[name=\"duration\"]").val(duration + (duration == 1 ? ' Week': ' Weeks'));
              break;
            case 'Monthly':
              duration_input;
              $(form + " input[name=\"duration\"]").val(duration + (duration == 1 ? ' Month': ' Months'));
              break;
            case 'Summary':
                duration.val(duration.val() + ' Sum');
              break;
          } //end of switch
        });
      }
    }
    choose_planBy();
  }

  return {
    initProjectDuration:initProjectDuration
  }

})($);
