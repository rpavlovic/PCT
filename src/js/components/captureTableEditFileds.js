/**
* @module Capture and Save edits on the tables.
* @version
*/
var captureEditTd = (function ($) {
  'use strict';

  function initCaptureEditTd(table) {
    $(table).on('mousedown mouseleave','td.contenteditable > div', function (event) {

      if ($(event.target).hasClass('error')) {
       $(event.target).text('').removeClass('error');
      }
    });
    $(table).on('blur keyup', 'td.contenteditable > div', function (event) {
            console.log($(event.target));
      var esc = event.which == 27,
          nl = event.which == 13,
          tab = event.which == 9,
          el = event.target,
          input = el.nodeName != 'INPUT' && el.nodeName != 'TEXTAREA' && el.nodeName != 'SELECT',
          data = {};
      if (input) {
        if(nl) {
          event.preventDefault();
          return false;
        }
        data = {
          element : el
        };
        returnData(el, table);
        el.blur();
        event.preventDefault();
      }
      return data;
    });
  }

  return {
    initCaptureEditTd:initCaptureEditTd
  };

})($);



