/**
* @module Load JSON
* @version
*/

var loadJSON = (function ($) {
  'use strict';

  var items_business = [],
      items_country = [],
      items_currency = [],
      items_region = [],
      select_billing_office = $("form.project-info select[name='billing']"),
      select_currency = $("form.project-info select[name='currency']"),
      select_region = $("form.project-info select[name='regions']"),
      select_country = $("form.project-info select[name='country']");


  //prepopulate Billing office select with JSON data.
  function prepopulate_Billing_Office_JSON(data1) {
    $.each(data1.d.results, function(key, val) {
      for (var key in val) {
        if(key === "OfficeName") {
          items_business.push('<option value="' + val[key] + '">' + val[key] + '</option>');
        }
        if(key == "Country") {
          items_country.push('<option value="' + val[key] + '">' + val[key] + '</option>');
        }
        if(key == "Currency") {
          items_currency.push('<option value="' + val[key] + '">' + val[key] + '</option>');
        }
        if(key == "Region") {
          items_region.push('<option value="' + val[key] + '">' + val[key] + '</option>');
        }
      }
    });
    select_billing_office.append(jQuery.unique(items_business));
    select_country.append(jQuery.unique(items_country));
    select_currency.append(jQuery.unique(items_currency));
    select_region.append(jQuery.unique(items_region));
  }

  //match the employee office with list of offices and select the matching one.
  function prepopulate_Employee_Office(data2) {
    $.each(data2.d.results, function(key, val) {
      for (var key in val) {
        if(key === "OfficeName") {
          $.each( select_billing_office[0].options, function() {;
            if( $(this).val() === val[key]) {
              $(this).prop('selected', true);
            }
          });
        }
        if(key === "OfficeCountry") {
          $.each( select_billing_office[0].options, function() {;
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