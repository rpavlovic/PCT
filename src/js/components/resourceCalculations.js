
/**
* @module Draw Data Table for Active Projects.
* @version
*/
var resourceFormulas = (function ($) {
  'use strict';

  function initResourceFormulas(data) {

    var sum = 0,
        total_sum = 0,
        hours_row = $(data.element).closest('tr'),
        hours = $(data.element);

    $(hours_row).each(function() {
      $(this).find('.month').each(function() {
        if (!isNaN($(this).text()) && $(this).text().length !== 0) {
          sum += Number($(this).text().replace(/[^0-9\.]/g,""));
        }
      });
    });

   $(hours_row).find('td.total-hours').text(sum);

  $('tbody td.total-hours').each(function() {
    total_sum += Number($(this).text().replace(/[^0-9\.]/g,""));
  });
    $('tfoot td.total-hours').text(total_sum);

  }
  return {
    initResourceFormulas:initResourceFormulas
  };

})($);
