/**
* @module progress navigation with radio buttons.
* @version
*/
var progressNav = (function ($) {
  'use strict';

  function initProgressNav(form) {
    var radio_href_value = $(form + ' input[type=radio]').val(),
        current_li = $(form + ' li.current'),
        radio = $(form + ' input[type=radio]');

    //TODO make pagination like to click back to the previously filled form.
    if((radio_href_value !== window.location.pathname) || ($(form + ' li:not("current")'))) {
      radio.prop('disabled', true);
      current_li.prev().children('input').prop('disabled', false);
      current_li.prevAll().addClass('previous');
    }
    current_li.children(radio).prop('checked', true);
      radio.on('click', function(event) {
        event.preventDefault();
        var href = $(form + ' input[type=radio]:checked').val();
        window.location = href;
      });
    }
    return {
      initProgressNav:initProgressNav
  }

})($);