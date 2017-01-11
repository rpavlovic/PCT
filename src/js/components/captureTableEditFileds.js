
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
          tab = event.which == 9,
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
          data = {
            element : el
          }
          // TODO when ready we could send an ajax request to update the field
          // $.ajax({
          //   url: window.location.toString(),
          //   data: data,
          //   type: 'post'
          // });
          //log(JSON.stringify(data));
          returnData(data);
          el.blur();
          event.preventDefault();
        }
      }
    });

    function returnData(new_data) {
      if(table === "#csv-table") {
        if($(new_data.element).html() != NaN && $.isNumeric($(new_data.element).html()) && $(new_data.element).html()) {
             var ovd_rate = $(new_data.element).html();
             var st_rate = $(new_data.element).prevAll().eq(1).html();
             var minus = st_rate - ovd_rate
             var percent = ( (st_rate - ovd_rate) / st_rate) * 100;
             $(new_data.element).next('td').html(percent.toFixed(2)+ "%");
          }
        }
    }
  }

  return {
    initCaptureEditTd:initCaptureEditTd
  }

})($);



