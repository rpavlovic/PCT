
/**
* @module Draw Data Table for Active Projects.
* @version
*/
var resourceFormulas = (function ($) {
  'use strict';

  function initResourceFormulas(data, table) {
    var table1 = {
      total_hours : $(table + " tbody td.total-hours"),
      row : $(data.element).closest('tr'),
      total_fees : $(table + " tbody td.total-fees"),
      months_hours : $(table + " tbody .month"),
      bill_rate : $(table + "tbody td-billrate"),
      avarage_rate : $("#modeling-table tbody #avg-rate_standard-resource"),
      modeling_fees: $("#modeling-table tbody #total-fee_standard-resource"),
      adjusted_rate_fees: $("#modeling-table tbody #total-fee_standard-resource")
    };
    var REgex_num = /^[\$]?[0-9\.\,]+[\%]?/g;
    var REgex_dollar = /(\d)(?=(\d\d\d)+(?!\d))/g;

    var sum_hours = 0,
        sum_rate = 0,
        total_rate_sum = 0,
        total_hours = 0;

    $(table1.row).each(function() {

      //calculate hours
      $(this).find('.month').each(function(key, value) {
        if (!isNaN($(this).text()) && $(this).text().length !== 0) {
          sum_hours += Number($(this).text());
        }
      });
      //calculate bill override.
      $(this).find('.rate-override').each(function(key, value) {
        if ($(this).text().length !== 0) {
          var dollars = $(this).text().replace(/[^0-9\.]/g,"");
          sum_rate += Number(sum_hours * dollars);
        }
      });

     //TODO if there is Bill Rate for Title calculate
       $(this).find('.td-billrate').each(function(key, value) {
         console.log($(this).text().replace(/[^0-9\.]/g,""));
       });
    });


    if(sum_hours > 0 && !isNaN(sum_hours)) {
      $(table1.row).find(table1.total_hours).text(sum_hours.toFixed(2));
    } else {
      $(table1.row).find(table1.total_hours).text('');
    }
    if(sum_rate > 0) {
      $(table1.row).find(table1.total_fees).text('$' + sum_rate.toFixed(3).replace(REgex_dollar, "$1,"));
    }
    else {
      $(table1.row).find(table1.total_fees).text('');
    }

    //show total in the footer
    table1.total_hours.each(function() {
      total_hours += Number($(this).text().replace(/[^0-9\.]/g,""));
    });
    if(sum_hours > 0) {
      $('tfoot td.total-hours').text(total_hours.toFixed(2));
    }
    else {
      $('tfoot td.total-hours').text();
    }

    table1.total_fees.each(function() {
      total_rate_sum += Number($(this).text().replace(/[^0-9\.]/g,""));
    });

    if(sum_rate > 0) {
      var total_fees = "$" + total_rate_sum.toFixed(3).replace(REgex_dollar, "$1,");
      table1.modeling_fees.text(total_fees);
      table1.adjusted_rate_fees.text(total_fees);
      $('tfoot td.total-fees').text(total_fees);
    }
    // else {
    //   table1.modeling_fees.text('');
    //   table1.adjusted_rate_fees.text('');
    //   $('tfoot td.total-fees').text('');
    // }

    //modeling avarage fees table populate
    if(total_rate_sum > 0 && total_hours > 0) {
      var av_rate =  total_rate_sum/total_hours;
      table1.avarage_rate.text("$" + av_rate.toFixed(3).replace(REgex_dollar, "$1,"));
    }
    // else {
    //    table1.avarage_rate.text('');
    // }



   // Contribution Margin (total_rate_sum - total cost) / total_rate_sum + '%';

  }
  return {
    initResourceFormulas:initResourceFormulas
  };

})($);
