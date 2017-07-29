/**
* @module Edit profile form.
* @version
*/
var editProfileForm = (function ($) {
  'use strict';

  function initEditProfileForm(form) {
     $('input[data-name="editText"]').hide();
     $(form + ' span').hide();

    $('.edit-profile').on('click',function() {
      $('form label').fadeToggle('slow');
      $('input[data-name="editText"]').fadeToggle('slow').removeClass('hide');
      $('button[type="submit"]').fadeToggle('slow');
      $('form span').toggle();
      $(this).html($(this)
        .html() === 'Edit Profile' ? 'Exit' : 'Edit Profile')
        .val($(this).val() === 'Edit Profile' ? 'Exit' : 'Edit Profile');
    });
  }
  return {
    initEditProfileForm:initEditProfileForm
  };

})($);
