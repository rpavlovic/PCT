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

  //check if fields are already filled.
   checkFieldsValue();

    // when typing check filled inputs.
    fields.bind('blur paste input', function(event) {
      resetAll();
      checkFieldsValue();
    });

    //when clicking on clear remove all input values.
     $(form + ' :reset').on('click', function(){
      resetAll();
     });

    function checkFieldsValue() {
      fields.each(function() {
        if ($(this).val() === '') {
          empty = true;
        } else {
          $(this).after('<span class="check"></span>').fadeIn();
          $(form + ' :submit').prop('disabled', false);
        }
      });
    }

    function resetAll() {
      $(form).find('span.check').remove();
      $(form + ' :submit').prop('disabled', true);
    }
  }

  return {
    initFillForm:initFillForm
  }

})($);
