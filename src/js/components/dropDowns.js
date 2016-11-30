/**
* @module DropDown selects.
* @version
*/
var dropDown = (function ($) {
  'use strict';

  function initDropDown(element) {
    $(element).on('click', function() {
      var tab_id = "#" + $(this).attr('data-toggle');
      if (!$(tab_id).hasClass('is-open')) {
        $(tab_id).addClass('is-open').attr({ 'aria-hidden': false });
      } else {
        $(tab_id).removeClass('is-open').attr({ 'aria-hidden': true });
      }
    })
  }
  return {
    initDropDown:initDropDown
  }

})($);
