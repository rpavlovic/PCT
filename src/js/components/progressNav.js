/**
* @module progress navigation.
* @version
*/
var progressNav = (function ($) {
  'use strict';

  function initProgressNav(form) {
    $(form + ' li.current').children('input[type=radio]').prop('checked', true);
    $(form + ' input').click(function(event) {
     event.preventDefault();
     var href = $(form + ' input[type=radio]:checked').val();
     window.location = href;
    });
  }
  return {
    initProgressNav:initProgressNav
  }

})($);