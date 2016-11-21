
/**
* @module Edit profile form.
* @version
*/
var editProfileForm = (function ($) {
  'use strict';

  function initEditProfileForm(form) {
     $('input[name=editText]').hide();
     $(form + ' span').hide();

    $('.edit-profile').click(function() {
      $('form label').fadeOut('slow');
      $(this).fadeOut('slow');
      $('input[name=editText]').fadeIn('slow').removeClass('hide');
      $('button[type="submit"]').fadeIn('slow');
      $('form span').show();
    });
  }


  return {
    initEditProfileForm:initEditProfileForm
  }

})($);