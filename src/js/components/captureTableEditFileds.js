
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
      return data;
    });


    function returnData(new_data) {

      var error = function() {
        if($(new_data.element).hasClass('rate') || $(new_data.element).hasClass('rate-override')) {
          if($(new_data.element).html()) {
              $(new_data.element).html('this field accepts numbers only.').addClass('error');
          }
        }
        return true;
      }

      var isNum = false;
      if($(new_data.element).html() != isNaN && $.isNumeric($(new_data.element).html())) {
        $(new_data.element).removeClass('error');
        isNum = true;
      }

      if(table === "#csv-table") {
        if($(new_data.element).html() && isNum) {
          var ovd_rate = $(new_data.element).html(),
              st_rate = $(new_data.element).prevAll().eq(1).html().replace(/\D/g, ''),
              minus = st_rate - ovd_rate,
              percent = ( (st_rate - ovd_rate) / st_rate) * 100;
          if(st_rate.length > 0) {
            $(new_data.element).next('td.discount').html(percent.toFixed(2)+ "%");
          }
        }
        else {
          error();
        }
      }
      if(table === '#project-resource-table') {
        //for now only rate-override with values into an array from the #project-resource-table.
        var data = $('td.rate-override').map(function(index, value) {
          if($(this).text() !== '') {
            return $(this).text();
          }
        }).get();

        var ovd_rate = $(new_data.element).html(),
            active_modeling_tabs = $('.modeling-table tr td');
        active_modeling_tabs.removeClass('active');
        //activate Adjusted Resource Hdr when override is entered.
        if(data.length > 0 && isNum) {
          $(active_modeling_tabs[2]).addClass('active');
          $(active_modeling_tabs[2]).children('input').prop('checked', true);
        }
        else {
          $(active_modeling_tabs[1]).addClass('active');
          $(active_modeling_tabs[1]).children('input').prop('checked', true);
          error();
        }
      }
    }
  }

  return {
    initCaptureEditTd:initCaptureEditTd
  }

})($);



