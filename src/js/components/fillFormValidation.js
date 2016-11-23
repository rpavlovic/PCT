/**
* @module fillForm before submit
* @version
*/

var fillForm = (function ($) {
  'use strict';

  function initFillForm(form, callback) {

  var fields = $(form + "  :input:not(button)"),
      empty = true;

    //check if fields are already filled.
    checkFieldsValue();
    submitProfileForm();

    // when typing check filled inputs.
    fields.on('blur paste input', function(event) {
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

    function submitProfileForm() {
      $('button[type="submit"]').on('click', function(e) {
        var fields_values = fields.serializeArray(),
            labels = fields.siblings('label');

        $.each(labels, function(i, field) {
          $(this).text(fields_values[i].value);
        });

        //create a jason string to send back in the future
        var jsonString = JSON.stringify(fields_values);


        $('input[name=editText]').fadeOut('slow').addClass('hide');
        $('.submit-profile').fadeOut('slow');

        $(form).find('label').fadeIn('slow');
        $(form).find('span.check').hide();

        $('button.edit-profile').val('Edit Profile').html('Edit Profile');
        $('button.edit-profile').fadeIn('slow');
      });
    }
  }
  return {
    initFillForm:initFillForm
  }

})($);
