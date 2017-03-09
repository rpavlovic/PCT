/**
* @module Capture and Save edits on the tables.
* @version
*/
var captureEditTd = (function ($) {
  'use strict';

  function initCaptureEditTd(table) {
    $(table).on('focus','td.contenteditable > div', function (event) {
      if ($(event.target).hasClass('error')) {
       $(event.target).text('').removeClass('error');
      }
    });

     $(table).on('keydown blur', 'td.contenteditable > div', function (event) {
      var esc = event.which == 27,
          nl = event.which == 13,
          tab = event.which == 9,
          el = event.target,
          input = el.nodeName != 'INPUT' && el.nodeName != 'TEXTAREA' && el.nodeName != 'SELECT',
          data = {};
      if (input) {
        if(tab) {
          el.blur();
        }
        if(nl || tab) {
          data = {
            element : el
          };
          returnData(el, table);
          el.blur();
          event.preventDefault();
        }
      }
      return data;
    });

  }

  return {
    initCaptureEditTd:initCaptureEditTd
  };

})($);
