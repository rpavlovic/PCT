
/**
* @module Draw Data Table for Active Projects.
* @version
*/
var resourceFormulas = (function ($) {
  'use strict';

  function initResourceFormulas(data, table) {
    console.log(data);
    var table1 = {};
    table1.total_fees = $(table + " tbody td.total-fees");
    table1.total_hours = $(table + " tbody td.total-hours");
    table1.row = $(data.element).closest('tr');
    table1.bill_override = $(table + " tbody td.rate-override");

    console.info(table1);
    var sum = 0,
        total_sum = 0;

    $(table1.row).each(function() {
      $(this).find('.month').each(function(key, value) {
        if (!isNaN($(this).text()) && $(this).text().length !== 0) {
          sum += Number($(this).text().replace(/[^0-9\.]/g,""));
        }
      });
    });
    if(sum > 0) {
      $(table1.row).find(table1.total_hours).text(sum);
    }

    //show total in the footer
    table1.total_hours.each(function() {
      total_sum += Number($(this).text().replace(/[^0-9\.]/g,""));
    });
    if(sum > 0) {
      $('tfoot td.total-hours').text(total_sum);
    }
  }
  return {
    initResourceFormulas:initResourceFormulas
  };

})($);
