
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
          // TODO when ready we could send an ajax request to update the field
          // $.ajax({
          //   url: window.location.toString(),
          //   data: data,
          //   type: 'post'
          // });
          //log(JSON.stringify(data));
          log(data);
          el.blur();
          event.preventDefault();
        }
      }
    });

    function log(new_data) {
       if(table === "#csv-table") {
        $.each(new_data, function(key, value) {
          console.log(value);
          var ovd_rate = value;
          var st_rate = $('.contenteditable:eq(0)').html();
          var minus = st_rate - ovd_rate
          var percent = ( (st_rate - ovd_rate) / st_rate) * 100;
          console.log('KEY: ' + key.hasOwnProperty);
           $('.contenteditable:eq(2)').next('td').html(percent.toFixed(2)+ "%");
        });

       }
    }
  }


  return {
    initCaptureEditTd:initCaptureEditTd
  }

})($);



