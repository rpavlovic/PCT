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
        duration = $(form + " input[name=\"Duration\"]").val().replace(/\D/g, ''),
        selected_month = estimated_start_date.getMonth(),
        selected_day = estimated_start_date.getDate(),
        selected_year = estimated_start_date.getFullYear(),

        monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

    function weekStarting() {
      var first_day_week = new Date(dataText),
          index = first_day_week.getDay();

      if(index === 0) {
       first_day_week.setDate(first_day_week.getDate() - 6);
      }

      else if(index === 1) {
       first_day_week.setDate(first_day_week.getDate());
      }

      else if(index !== 1 && index > 0) {
        first_day_week.setDate(first_day_week.getDate() - (index - 1));
      }
      return monthNames[first_day_week.getMonth()] + ' ' + first_day_week.getDate() + ', '+ first_day_week.getFullYear();
    }

    function estimateEndDate() {
      var daysToAdd = 0;
      var curr = new Date(dataText); // get selected date
      var first = curr.getDate();
      var last;
      var lastday;

      if (plan_by === "WK") {
        daysToAdd = 7;
        // if duration is 1 week, then just add days til the end of the week or Friday
        // add x days
        // if duration is 2 weeks, then add days til the end of the week + 7 days per week.
        // add x days + 7 * duration -1

        last = first + 5 - curr.getDay() + (daysToAdd * (parseInt(duration) - 1));
        lastday = new Date(curr.setDate(last));

        return monthNames[lastday.getMonth()] + ' ' + lastday.getDate() + ', ' + lastday.getFullYear();

      } else if (plan_by === "MN") {
        daysToAdd = daysInMonth(selected_month, selected_year);
        last = first + (daysToAdd * parseInt(duration));
        lastday = new Date(curr.setDate(last));

        return monthNames[lastday.getMonth()] + ' ' + lastday.getDate() + ', ' + lastday.getFullYear();
      }
    }

    function daysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    }

    function choose_planBy() {
      $(form + " input[name='weekstart']").val(weekStarting());

      var estimate_end_date_val = function() {
        return estimate_end_date.val(estimateEndDate());
      };

      $(form + " select[name='planby'] option:selected").each(function() {
        //get the value from duration field, if nothing there make a number 1.
        if(duration <= 0) {
          duration = 1;
        }
        //remove error if data is selected from validateDuration.js
        $(form + " input[name=\"Duration\"]").removeClass('error');
        switch($(this).val()) {
          case 'WK':
            $(form + " input[name=\"Duration\"]").val(duration === 1 ? duration + ' Week': duration + ' Weeks');
            //update the estimate end date  field.
            estimate_end_date_val();
            break;
          case 'MN':
            $(form + " input[name=\"Duration\"]").val(duration === 1 ? duration + ' Month': duration + ' Months');
            //update the estimate end date  field.
            estimate_end_date_val();
            break;
          case 'SM':
            $(form + " input[name=\"Duration\"]").val('').prop('disabled', true);
            $(form + " input[name='weekstart']").val('');
            estimate_end_date.val('');
            break;
          default:
            $(form + " input[name=\"Duration\"]").val(duration === 1 ? duration + ' Week': duration + ' Weeks');
            //update the estimate end date  field.
            estimate_end_date_val();

            break;
        } //end of switch

      });
    }
    choose_planBy();
  }

  return {
    initProjectDuration:initProjectDuration
  };

})($);
