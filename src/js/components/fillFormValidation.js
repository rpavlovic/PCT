/**
* @module fillForm before submit
* @version
*/

var fillForm = (function ($) {
  'use strict';

  function initFillForm(form) {
    //TODO for validation might need an object with data
    // var data = {};
    var fields = $(form + "  :input:not(button)"),
        empty = true;

    fields.bind('blur paste', function(event) {
      resetAll();
      empty = false;

      //for each field create a var. to record that all fields are filled.
      fields.each(function(i) {
        if ($(this).val() === '') {
          empty = true;
          $(form + ' :reset').on('click', function() {
            resetAll();
          })
        } else {
          $(this).after('<span class="check"></span>').fadeIn();
          $(form + ' :submit').prop('disabled', false);
        }
      });
    });

    function resetAll() {
      $('span.check').remove();
      $(form + ' :submit').prop('disabled', true);
    }

  }

  return {
    initFillForm:initFillForm
  }

})($);
