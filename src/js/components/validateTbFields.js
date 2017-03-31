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
    if (e.which == 13) {
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

function limitChars() {
  // Excempt keys(arrows, del, backspace, home, end);
  var excempt = [37,38,39,40,46,8,36,35];
  // Loop through every editiable thing
  $("[contenteditable]").each(function(index, elem) {
    var $elem = $(elem);
    // Check for a property called data-input-length="value" (<div contenteditiable="true" data-input-length="100">)
    var length = $elem.data('input-length');
    // Validation of value
    if(!isNaN(length)) {
      // Register keydown handler
      $elem.on('keydown',function(evt) {
        // If the key isn't excempt AND the text is longer than length stop the action.
        if(excempt.indexOf(evt.which) === -1 && $elem.text().length > length) {
          evt.preventDefault();
          return false;
        }
      });
    }
  });
}