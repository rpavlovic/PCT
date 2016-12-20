/**
* @module Load JSON
* @version
*/

var loadJSON = (function ($) {
  'use strict';

  var items = [];

  function Iterate_billing_office_JSON(data) {

    var select = $("form.project-info select[name='billing']");
    $.each(data.d.results, function(key, val) {
      for (var key in val) {
        if(key === "OfficeName") {
          items.push('<option value="' + val[key] + '">' + val[key] + '</option>');
        }
      }
    });
    select.append(jQuery.unique(items));
  }

  function initJSON(jsonFile) {
    $.getJSON(jsonFile, function(data) {
      Iterate_billing_office_JSON(data);
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