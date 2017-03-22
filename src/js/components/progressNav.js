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
    // TODO make pagination like to click back to the previously filled form.
      if((radio_href_value !== window.location.pathname) || ($(form + ' li:not("current")'))) {
        //disable radio checkboxes to prevent going forward before filling the form.
        radio.prop('disabled', true);
        //enable radio boxes that are from the past pages.
        current_li.prev().children('input').prop('disabled', false);
        current_li.prevAll().addClass('previous');
      }
      //check the current box to true.
      current_li.children(radio).prop('checked', true);
      radio.on('click', function(event) {
        event.preventDefault();
        //go to the pages via radio checkboxes.
        var href = $(form + ' input[type=radio]:checked').val();
        window.location =  href +'?projID='+ getParameterByName('projID') + "&" + getTimestamp();
      });
    }
    return {
      initProgressNav:initProgressNav
  };

})($);