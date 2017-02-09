/**
* @module Capture and Save edits on the tables.
* @version
*/
var captureEditTd = (function ($) {
  'use strict';

  function initCaptureEditTd(table) {
    $(table).on('mousedown','td.contenteditable > div', function (event) {
       if ('this field accepts numbers only.' === $(event.target).html().toLowerCase()) {
        $(event.target).html('');
      }
    });
    $(table).bind('blur keyup', 'td.contenteditable > div', function (event) {
      var esc = event.which == 27,
          nl = event.which == 13,
          tab = event.which == 9,
          el = event.target,
          input = el.nodeName != 'INPUT' && el.nodeName != 'TEXTAREA' && el.nodeName != 'SELECT',
          data = {};
          console.log(event.which);
      if (input) {
        if (nl) {
          event.preventDefault();
          document.execCommand('insertHTML', false, ' ');
          // prevent the default behaviour of return key pressed
          return false;
        }
         data = {
            element : el
          };
        if (esc) {
          // restore state
          document.execCommand('undo');
          el.blur();
        }
          returnData(data, table);
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



