
/**
* @module Draw Data Table for Active Projects.
* @version
*/
var resourceCalculation = (function ($) {
  'use strict';

  function initResourceFormulas(data, table, curr) {
    var table1 = {
      total_hours : $("#project-resource-table tbody td.total-hours"),
      row : $(data).closest('tr'), //if data is entered
      total_fees : $("#project-resource-table tbody td.total-fees"),
      months_hours : $("#project-resource-table tbody .month"),
      bill_rate: $(data).hasClass('td-billrate') ? $(data).text().replace('$', '') : '',
      bill_rate_override:  $(data).closest('tr').find('td.rate-override').text().replace('$', ''),

      //modeling table
      fees_std: $("#modeling-table tbody #total-fee_standard-resource"),
      avarage_rate_std : $("#modeling-table tbody #avg-rate_standard-resource"),
      contrib_std: $("#modeling-table tbody #contribution-margin_standard-resource"),

      fees_adj: $("#modeling-table tbody #total-fee_adjusted-resource"),
      avarage_rate_adj : $("#modeling-table tbody #avg-rate_adjusted-resource"),
      contrib_adj: $("#modeling-table tbody #contribution-margin_adjusted-resource"),
    };

    var sum_rate = 0,
        total_rate_sum = 0,
        dollars = 0,
        sum_hours = 0,
        override = [],
        total_hours = 0;

    $(table1.row).find('div.month').each(function(key, value) {
      if (!isNaN($(this).text()) && $(this).text().length !== 0) {
        sum_hours += Number($(this).text());
      }
    });
    if(table1.bill_rate_override > 0) {
      dollars = table1.bill_rate_override.replace(/[^0-9\.]/g,"");
    }
     else if (table1.bill_rate > 0) {
       dollars = table1.bill_rate.replace(/[^0-9\.]/g,"");
    } else {
        dollars = table1.row.find('.td-billrate').text().replace(/[^0-9\.]/g,"");
    }

    //sum rate from either rates or overrides.
    sum_rate += Number(sum_hours * dollars);

    //sum of all hours given
      $(table1.row).find(table1.total_hours).text(convertDecimalToFixed(sum_hours));

    //total fees cell
      if(table1.row.length > 0) {
        $(table1.row).find(table1.total_fees).text(convertToDollar(curr, sum_rate));
      }


    //show total in the footer
    table1.total_hours.each(function() {
      total_hours += Number($(this).text().replace(/[^0-9\.]/g,""));
    });

    $('tfoot th.total-hours').text(convertDecimalToFixed(total_hours));

    table1.total_fees.each(function() {
      total_rate_sum += Number($(this).text().replace(/[^0-9\.]/g,""));
    });

    var total_fees = convertToDollar(curr, total_rate_sum);

    if($('td.rate-override').text().replace(/[^0-9\.]/g,"")> 0) {
      table1.fees_adj.text(total_fees);
    }else {
      table1.fees_adj.text('');
      table1.fees_std.text(total_fees);
    }
    $('tfoot th.total-fees').text(total_fees);

  //modeling avarage fees table populate
    var av_rate =  total_rate_sum/total_hours;
    if(av_rate > 0) {
      if(table1.bill_rate_override > 0 || $('td.rate-override').text().replace(/[^0-9\.]/g,"")> 0) {
        table1.avarage_rate_adj.text(convertToDollar(curr, av_rate));
      } else {
         table1.avarage_rate_adj.text('');
      }
      if(table1.bill_rate > 0) {
        table1.avarage_rate_std.text(convertToDollar(curr, av_rate));
      }
    }

   // Contribution Margin (total_rate_sum - total cost) / total_rate_sum + '%';
   //TODO get the COST RATE.
   var standard_fees = $('#total-fee_standard-resource').text().replace(/[^0-9\.]/g,"");
   var adjusted_fees = $('#total-fee_adjusted-resource').text().replace(/[^0-9\.]/g,"");
   var contrib_margin = (standard_fees-40)/standard_fees * 100;
   if(contrib_margin > 0) {
     table1.contrib_std.text(convertToPercent(contrib_margin));
     if( adjusted_fees > 0) {
      contrib_margin = (adjusted_fees-40)/adjusted_fees * 100;
       table1.contrib_adj.text(convertToPercent(contrib_margin));
       console.log(adjusted_fees);
     } else {
       table1.contrib_adj.text('');
     }
   }
  }
  return {
    initResourceFormulas:initResourceFormulas
  };

})($);
