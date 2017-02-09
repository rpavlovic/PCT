
/**
* @module Draw Data Table for Active Projects.
* @version
*/
var resourceFormulas = (function ($) {
  'use strict';

  function initResourceFormulas(data, table) {
    var table1 = {};
    var REgex_num = /^[\$]?[0-9\.\,]+[\%]?/g;
    var REgex_dollar = /(\d)(?=(\d\d\d)+(?!\d))/g;
    table1.total_fees = $(table + " tbody td.total-fees");
    table1.total_hours = $(table + " tbody td.total-hours");
    table1.row = $(data.element).closest('tr');
    table1.total_fees = $(table + " tbody td.total-fees");
    table1.months_hours = $(table + " tbody .month");
    table1.bill_rate = $(table + "tbody td-billrate");
    var sum_hours = 0,
        sum_rate = 0,
        total_rate_sum = 0,
        total_sum = 0;

    $(table1.row).each(function() {

      $(this).find('.month').each(function(key, value) {
        if (!isNaN($(this).text()) && $(this).text().length !== 0) {
          sum_hours += Number($(this).text());
        }
      });
      $(this).find('.rate-override').each(function(key, value) {
        if ($(this).text().length !== 0) {
          var dollars = $(this).text().replace(/[^0-9\.]/g,"");
          sum_rate += Number(sum_hours * dollars);
        }
      });
      $(this).find('.td-billrate').each(function(key, value) {
        console.log($(this).text().replace(/[^0-9\.]/g,""));
      });
    });
    if(sum_hours > 0 && !isNaN(sum_hours)) {
      $(table1.row).find(table1.total_hours).text(sum_hours.toFixed(2));
    }
    if(sum_rate > 0) {
      $(table1.row).find(table1.total_fees).text('$' + sum_rate.toFixed(3));
    }

    //show total in the footer
    table1.total_hours.each(function() {
      total_sum += Number($(this).text().replace(/[^0-9\.]/g,""));
    });
    if(sum_hours > 0) {
      $('tfoot td.total-hours').text(total_sum.toFixed(2));
    }

    table1.total_fees.each(function() {
      total_rate_sum += Number($(this).text().replace(/[^0-9\.]/g,""));
    });
    if(sum_rate > 0) {
      $('tfoot td.total-fees').text("$" + total_rate_sum.toFixed(2).replace(REgex_dollar, "$1,"));
    }
  }
  return {
    initResourceFormulas:initResourceFormulas
  };

})($);
