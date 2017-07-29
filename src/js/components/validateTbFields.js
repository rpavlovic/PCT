/**
 * @functions Capture and validate and make calculations
 * on the table cells.
 * @version
 */

function error(table) {
  $(table).on('keyup focusout', function (e) {
     var REgex = /^[\$]?[0-9\.\,]+[\%]?/g;
     if( ($(e.target).parent().hasClass('num') || $(e.target).hasClass('month')) &&
       !$.isNumeric(e.target) && $(e.target).html().replace(REgex, '') &&
       $(e.target).text() !== '') {
       $(e.target).html('this field accepts numbers only.').addClass('error');
     }
  });

  $(table).on('keypress', 'td.contenteditable > div', function (e) {
    if (e.which === 13) {
      $(e.target).blur();
      $(this).parent().nextAll(".contenteditable div").first().children('div').focus(true);
      return false;
    }
  });

  $(table).on('focus blur','td.contenteditable > div', function (e) {
    if ($(e.target).hasClass('error')) {
      $(e.target).text('').removeClass('error');
    }
  });
}
