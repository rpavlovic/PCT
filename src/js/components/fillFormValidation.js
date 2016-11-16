/**
* @module fillForm before submit
* @version
*/

var fillForm = (function ($) {
  'use strict';

  function initFillForm(form) {

    var fields = $(form + "  :input:not(button)"),
        empty = true;

    //check if the filed values are being entered.
    fields.bind('propertychange change click keyup input paste', function(e) {
      empty = false;

      //for each field create a var. to record that all fields are filled.
      fields.each(function(e) {
        if ($(this).val() == '') {
          empty = true;
        } else {
          $(this).after('<span class="check"></span>').fadeIn();
        }
      });

      //disable/enable submit on empty and on reset click.
      if (empty) {
        $(form + ' :reset').on('click', function() {
          $(form + ' :submit').prop('disabled', true);
          $('span.check').remove();
        })
      } else {
        $(form + ' :submit').prop('disabled', false);

      }
    });
  }

  return {
    initFillForm:initFillForm
  }

})($);
