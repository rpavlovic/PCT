/**
* @module progress navigation with radio buttons.
* @version
*/
var progressNav = (function ($) {
  'use strict';

  function initProgressNav(form) {
    var radio_href_value = $(form + ' input[type=radio]').val(),
        radio = $(form + ' input[type=radio]');

    //TODO make pagination like to click back to the previously filled form.
    if((radio_href_value !== window.location.pathname) || ($(form + ' li:not("current")'))) {
      $(form + ' input[type=radio]').prop('disabled', true);
      $(form + ' li.current').prev().children('input').prop('disabled', false);
      $(form + ' li.current').prevAll().addClass('previous');
    }

    $(form + ' li.current').children('input[type=radio]').prop('checked', true);
    console.log($(form + ' li.current').prev().children('input'));
    for(var i = 0; i < radio.length; i++) {
      $(form + ' input[type=radio]').on('click', function(event) {
        event.preventDefault();
        var href = $(form + ' input[type=radio]:checked').val();
        window.location = href;
      });
    }

  }
  return {
    initProgressNav:initProgressNav
  }

})($);