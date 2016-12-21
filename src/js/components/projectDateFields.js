
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
        selected_year = new Date(inst.selectedYear),
        dateFormat = "mm/dd/yyyy";

        if(plan_by === "Weekly") {
          daysToAdd = 7 * parseInt(duration);
        } else if (plan_by === "Monthly") {
          daysToAdd = daysInMonth(selected_month * parseInt(duration), inst.selectedYear);
        }


        var curr = new Date(estimated_start_date), // get current date
          first = curr.getDate(),
          daysToAdd,
          last = first + daysToAdd,
          lastday = new Date(curr.setDate(last)),
          month = (lastday.getMonth() + 1) * parseInt(duration),

          weekly_month = (month) < 10 ? '0' + month : '' + month;

        function daysInMonth(month,year) {
          return new Date(year, month, 0).getDate();
        }

    function choose_planBy() {
      console.log(weekly_month);
      $(form + " select[name='planby'] option:selected").each(function() {
        if(inst.input.val != '' && $.isNumeric(duration) || $.isNumeric(duration.length > 0)) {
          switch($(this).val()) {
            case 'Weekly':
              estimate_end_date.val(weekly_month + '/' + lastday.getDate() + '/' + lastday.getFullYear());
              $(form + " input[name=\"duration\"]").val(duration + (duration == 1 ? ' Week': ' Weeks'));
              break;
            case 'Monthly':

              estimate_end_date.val(weekly_month + '/' + lastday.getDate() + '/' + lastday.getFullYear());
              $(form + " input[name=\"duration\"]").val(duration + (duration == 1 ? ' Month': ' Months'));
              break;
            case 'Summary':
                duration.val(duration.val() + ' Sum');
              break;
          } //end of switch
        }
      });
    }
    choose_planBy();
  }

  return {
    initProjectDuration:initProjectDuration
  }

})($);
