/**
* @module Load JSON
* @version
*/

var loadJSON = (function ($) {
  'use strict';

  var items = [],
      select = $("form.project-info select[name='billing']");


  //prepopulate Billing office select with JSON data.
  function prepopulate_Billing_Office_JSON(data1) {
    $.each(data1.d.results, function(key, val) {
      for (var key in val) {
        if(key === "OfficeName") {
          items.push('<option value="' + val[key] + '">' + val[key] + '</option>');
        }
      }
    });
    select.append(jQuery.unique(items));
  }

  //match the employee office with list of offices and select the matching one.
  function prepopulate_Employee_Office(data2) {
    $.each(data2.d.results, function(key, val) {
      for (var key in val) {
        if(key === "OfficeName") {
          $.each( select[0].options, function() {;
            if( $(this).val() === val[key]) {
              $(this).prop('selected', true);
            }
          });
        }
      }
    });
  }

  function initJSON(jsonFile1, jsonFile2) {

    $.getJSON(jsonFile1,  function(data1) {
      prepopulate_Billing_Office_JSON(data1);
    })
    .done(function() {
      $.getJSON(jsonFile2,  function(data2) {
         prepopulate_Employee_Office(data2);
      });
      floatLabel.initfloatLabel();
    })
    .fail(function(jqXHR, exception) {
      console.log(jqXHR, exception);
    })
    .always(function() {
      console.log( "complete JSON" );
    });
  }
  return {
    initJSON:initJSON
  }

})($);