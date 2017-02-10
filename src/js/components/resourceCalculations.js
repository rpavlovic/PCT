
/**
* @module Draw Data Table for Active Projects.
* @version
*/
var resourceFormulas = (function ($) {
  'use strict';

  function initResourceFormulas(data, table) {
    var table1 = {
      total_hours : $(table + " tbody td.total-hours"),
      row : $(data).closest('tr'), //if data is entered
      total_fees : $(table + " tbody td.total-fees"),
      months_hours : $(table + " tbody .month"),
      bill_rate: $(data).text().replace('$', ''),
      bill_rate_override:  $(data.element).closest('tr').find('.rate-override').text().replace('$', ''),
//|| $(data).closest('tr').find('.td-billrate').text().replace('$', '')
      //modeling table
      fees_std: $("#modeling-table tbody #total-fee_standard-resource"),
      avarage_rate_std : $("#modeling-table tbody #avg-rate_standard-resource"),
      contrib_std: $("#modeling-table tbody #contribution-margin_standard-resource"),

      fees_adj: $("#modeling-table tbody #total-fee_adjusted-resource"),
      avarage_rate_adj : $("#modeling-table tbody #avg-rate_adjusted-resource"),
      contrib_adj: $("#modeling-table tbody #contribution-margin_adjusted-resource"),
    };

    console.log(table1.row);

    var REgex_num = /^[\$]?[0-9\.\,]+[\%]?/g;
    var REgex_dollar = /(\d)(?=(\d\d\d)+(?!\d))/g;

    var sum_rate = 0,
        total_rate_sum = 0,
        dollars = 0,
        sum_hours = 0,
        total_hours = 0;



    $(table1.row).find('.month').each(function(key, value) {
      if (!isNaN($(this).text()) && $(this).text().length !== 0) {
        sum_hours += Number($(this).text());
      }
    });

    // $(table1.row_1).each(function() {
    //     sum_hours += Number(table1.total_hours.text());
    // });

   // $(table1.row).each(function() {
      //calculate hours


      //calculate bill override.
     // $(table1.row).find('.rate-override').each(function(key, value) {

    //  });
    // });
    if(table1.bill_rate_override > 0) {
      dollars = table1.bill_rate_override.replace(/[^0-9\.]/g,"");
    } else {
       dollars = table1.bill_rate.replace(/[^0-9\.]/g,"");
    }

    //sum rate from either rates or overrides.
    sum_rate += Number(sum_hours * dollars);

    //sum of all hours given
    //if(sum_hours > 0 && !isNaN(sum_hours)) {
      $(table1.row).find(table1.total_hours).text(sum_hours.toFixed(2));
    //}

    //total fees cell
    // if(sum_rate > 0) {
      if(table1.row.length > 0) {
        $(table1.row).find(table1.total_fees).text('$' + sum_rate.toFixed(3).replace(REgex_dollar, "$1,"));
      } else {
        $(table1.row_1).find(table1.total_fees).text('$' + sum_rate.toFixed(3).replace(REgex_dollar, "$1,"));
      }


    //show total in the footer
    table1.total_hours.each(function() {
      total_hours += Number($(this).text().replace(/[^0-9\.]/g,""));
    });

    $('tfoot td.total-hours').text(total_hours.toFixed(2));

    table1.total_fees.each(function() {
      total_rate_sum += Number($(this).text().replace(/[^0-9\.]/g,""));
    });

    var total_fees = "$" + total_rate_sum.toFixed(3).replace(REgex_dollar, "$1,");
    table1.fees_std.text(total_fees);
    table1.fees_adj.text(total_fees);
    $('tfoot td.total-fees').text(total_fees);

  //modeling avarage fees table populate
    var av_rate =  total_rate_sum/total_hours;
    if(av_rate > 0) {
      table1.avarage_rate_adj.text("$" + av_rate.toFixed(3).replace(REgex_dollar, "$1,"));
    }

   // Contribution Margin (total_rate_sum - total cost) / total_rate_sum + '%';

  }
  return {
    initResourceFormulas:initResourceFormulas
  };

})($);
