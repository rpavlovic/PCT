/**
* @module Load JSON
* @version
*/

var loadJSON = (function ($) {
  'use strict';

  var items_business = [],
      items_country = [],
      items_currency = [
      'AUD',
      'CAD',
      'CHF',
      'CNY',
      'EUR',
      'GBP',
      'HKD',
      'JPY',
      'MYR',
      'NZD',
      'SGD',
      'USD'
  ],
      items_region = [],
      select_billing_office = $("form.project-info select[name='billing']"),
      select_currency = $("form.project-info select[name='currency']"),
      select_region = $("form.project-info select[name='regions']"),
      select_country = $("form.project-info select[name='country']"),
      selected = false;

    items_currency.map( function(value, key) {
      select_currency.append('<option value="' + value + '">' +  value + '</option>');
    });

  //prepopulate Billing office select with JSON data.
  function prepopulate_Billing_Office_JSON(data1) {
    $.each(data1.d.results, function(key, val) {
      for (var key in val) {
        //create office name options.
        if(key === "OfficeName") {
          items_business.push('<option value="' + val[key] + '">' + val[key] + '</option>');
        }
        //create country options.
        if(key == "Country") {
          items_country.push('<option value="' + val[key] + '">' + val[key] + '</option>');
        }
        //create region options
        if(key == "Region") {
          items_region.push('<option value="' + val[key] + '">' + val[key] + '</option>');
        }
        //if the currency data is matching to the currency array.
        if(key == "Currency") {
          $.each(select_currency[0].options, function() {
            if( $(this).val() === val[key]) {
              $(this).prop('selected', true);
            }
          });
        }
      }
    });
    select_billing_office.append($.unique(items_business));
    select_country.append($.unique(items_country));
    select_region.append($.unique(items_region));
  }

  //match the employee office with list of offices and select the matching one.
  function prepopulate_Employee_Office(data2) {
    $.each(data2.d.results, function(key, val) {
      for (var key in val) {
        //select the office for the employee that matches
        if(key === "OfficeName") {
          $.each( select_billing_office[0].options, function() {;
            if( $(this).val() === val[key]) {
              $(this).prop('selected', true);
            }
          });
        }
        //select the office country for the employee that matches
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