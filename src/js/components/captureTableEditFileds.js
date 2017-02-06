/**
* @module Capture and Save edits on the tables.
* @version
*/
var captureEditTd = (function ($) {
  'use strict';

  function initCaptureEditTd(table) {
    //on enter remove value of the cell if error.
    $(table).on('mousedown','td.contenteditable > div', function (event) {
       if ('this field accepts numbers only.' === $(event.target).html().toLowerCase()) {
        $(event.target).html('');
      }
    });

    $(table).on('blur', 'td.contenteditable > div', function (event) {
      var esc = event.which == 27,
          nl = event.which == 13,
          tab = event.which == 9,
          el = event.target,
          input = el.nodeName != 'INPUT' && el.nodeName != 'TEXTAREA' && el.nodeName != 'SELECT',
          data = {};
      if (input) {
         data = {
            element : el
          };
        if (esc) {
          // restore state
          document.execCommand('undo');
          el.blur();
        }
          // TODO when ready we could send an ajax request to update the field
          // $.ajax({
          //   url: window.location.toString(),
          //   data: data,
          //   type: 'post'
          // });
          //log(JSON.stringify(data));
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



