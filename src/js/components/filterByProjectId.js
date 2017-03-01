/**
* @module fillForm before submit
* @version
*/

var fillForm = (function ($) {
  'use strict';

  function initFillForm(form) {

    var fields, empty;
    fields = $(form + "  :input:not(button)");
    empty = true;

    //check if fields are already filled.
    checkFieldsValue();
    submitProfileForm();

    // when typing check filled inputs.
    fields.on("blur paste input change", function() {
      resetAll();
      checkFieldsValue();
    });

    //when clicking on clear remove all input values.
     $(form + ' :reset').on('click', function(){
      resetAll();
     });

    function checkFieldsValue() {
      fields.each(function() {
        if ($(this).val() !== '') {
          $(this).after("<span class=\"check\"></span>").fadeIn();
          $(form + " :submit").prop("disabled", false);
        } else {
          empty = true;
        }
      });
    }

    function resetAll() {
      $(form).find("span.check").remove();
      $(form + " :submit").prop("disabled", true);
    }

    function submitProfileForm() {
      var button_edit;
      button_edit =$('button.edit-profile');
      $("button[type='submit']").on("click", function() {
        var fields_values = fields.serializeArray();

        $.each(fields, function(i) {
          $('label[for="'+$(this).attr('name')+'"]').text(fields_values[i].value);
        });

        //create a jason string to send back in the future
        var jsonString = JSON.stringify(fields_values);

        $('input[data-name="editText"]').fadeOut('slow').addClass('hide');
        $('.submit-profile').fadeOut('slow');

        $(form).find('label').fadeIn('slow');
        $(form).find('span.check').hide();

        button_edit.val('Edit Profile').html('Edit Profile');
        button_edit.fadeIn('slow');

        //write JSON into local storage
        localStorage.setItem('storeProfile', jsonString);
        //retrieve the object
        var obj = JSON.parse(localStorage.getItem('storeProfile'));
      });
    }
  }
  return {
    initFillForm:initFillForm
  };

})($);
