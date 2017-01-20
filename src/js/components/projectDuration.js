/**
* @module working with dates in form fields in Project Info page.
* @version
*/
var projectDuration = (function ($) {
  'use strict';

  function initProjectDuration(form, inst, dataText) {

    var estimate_end_date = $(form + " input[name=\"enddate\"]"),
        plan_by = $(form + " select[name='planby'] option:selected").val(),
        estimated_start_date = new Date(dataText),
        duration = $(form + " input[name=\"duration\"]").val().replace(/\D/g, ''),
        selected_month = estimated_start_date.getMonth(),
        selected_day = estimated_start_date.getDate(),
        selected_year = estimated_start_date.getFullYear(),

        monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

    function weekStarting() {
      var first_day_week = new Date(dataText),
          index = first_day_week.getDay();

      if(index == 0) {
       first_day_week.setDate(first_day_week.getDate() - 6);
      }

      else if(index == 1) {
       first_day_week.setDate(first_day_week.getDate());
      }

      else if(index != 1 && index > 0) {
        first_day_week.setDate(first_day_week.getDate() - (index - 1));
      }
      return monthNames[first_day_week.getMonth()] + ' ' + first_day_week.getDate() + ', '+ first_day_week.getFullYear();
    }

    function estimateEndDate() {
      //get the value from duration field, if nothing there make a number 1.
      if(duration <= 0) {
        duration = 1;
      }

      var daysToAdd = 0;
      if(plan_by === "Weekly") {
        daysToAdd = 7;
      } else if (plan_by === "Monthly") {
        daysToAdd = daysInMonth(selected_month, selected_year);
      }
      var curr = new Date(dataText), // get selected date
        first = curr.getDate(),
        last = first + (daysToAdd * parseInt(duration)),
        lastday = new Date(curr.setDate(last));

      return monthNames[lastday.getMonth()] + ' ' + lastday.getDate() + ', ' + lastday.getFullYear();
    }
    function daysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    }

    function choose_planBy() {
      $(form + " input[name='weekstart']").val(weekStarting());
      var duration_input = estimate_end_date.val(estimateEndDate());
      $(form + " select[name='planby'] option:selected").each(function() {
        $(form + " input[name=\"duration\"]").val(' ');
        switch($(this).val()) {
          case 'Weekly':
            $(form + " input[name=\"duration\"]").val(duration == 1 ? duration + ' Week': duration + ' Weeks');
            //update the estimate end date  field.
            duration_input;
            break;
          case 'Monthly':
            $(form + " input[name=\"duration\"]").val(duration == 1 ? duration + ' Month': duration + ' Months');
            //update the estimate end date  field.
            duration_input;
            break;
          case 'Summary':
            $(form + " input[name=\"duration\"]").val(duration + ' Summary');
            duration_input;
            break;
          default:
            $(form + " input[name=\"duration\"]").val(duration == 1 ? duration + ' Week': duration + ' Weeks');
            //update the estimate end date  field.
            duration_input;
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
