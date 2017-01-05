
/**
* @module Capture and Save edits on the tables.
* @version
*/
var captureEditTd = (function ($) {
  'use strict';

  function initCaptureEditTd(table) {
    $(table).on('keydown', function (event) {
      var esc = event.which == 27,
          nl = event.which == 13,
          el = event.target,
          input = el.nodeName != 'INPUT' && el.nodeName != 'TEXTAREA' && el.nodeName != 'SELECT' && el.children.length == 0,
          data = {};
      if (input) {
        if (esc) {
          // restore state
          document.execCommand('undo');
          el.blur();
        } else if (nl) {
          // save
          data[el] = el.innerHTML;
          // if($(el).hasClass("contenteditable")) {
          //    data[el] = el.innerHTML;
          // }
          // we could send an ajax request to update the field
          /*
          $.ajax({
            url: window.location.toString(),
            data: data,
            type: 'post'
          });
          */
          log(JSON.stringify(data));

          el.blur();
          event.preventDefault();
        }
      }
    });

    function log(s) {
      console.log(s);
    }
  }


  return {
    initCaptureEditTd:initCaptureEditTd
  }

})($);



