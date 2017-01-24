/**
* @module Clear entered data from all rows
* @version
*/
$.fn.clearAll = function() {

  $(this).each(function() {

    var clicked_element = $(this),
        activate_element = $('form'),
        table_row = activate_element.find('table tbody');

    clicked_element.on('click', function() {
      confirm("All overrides will be removed?");
      table_row.each(function (key, value) {
        $(this).find('td.contenteditable').empty();
      });
    });
  });
};
