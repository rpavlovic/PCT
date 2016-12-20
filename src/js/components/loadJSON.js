/**
* @module Load JSON
* @version
*/

var loadJSON = (function ($) {
  'use strict';

  var items = [];

  function Iterate_billing_office_JSON(data1, data2) {
    console.log(data2);
    var select = $("form.project-info select[name='billing']");
    $.each(data1.d.results, function(key, val) {
      for (var key in val) {
        if(key === "OfficeName") {
          items.push('<option value="' + val[key] + '">' + val[key] + '</option>');
        }
      }
    });
    select.append(jQuery.unique(items));
  }

  function initJSON(jsonFile1, jsonFile2) {
    $.getJSON(jsonFile1, jsonFile2,  function(data1, data2) {
      Iterate_billing_office_JSON(data1, data2);
    })
    .done(function() {
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