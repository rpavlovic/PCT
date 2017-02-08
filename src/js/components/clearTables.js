/**
* @module Clear entered data from all rows
* @version
*/
$.fn.clearAll = function() {

  $(this).each(function() {

    var clicked_element = $(this),
        table = $('table tbody'),
        table_row = table.find('tr');
    clicked_element.on('click', function() {
      confirm("All overrides will be removed?");
      table_row.each(function (key, value) {
        $('table tbody td.contenteditable div, table tbody .can-clear').text('');
        $('td.low-value, td.high-value').removeClass('low-value high-value');
      });
    });
  });
};
