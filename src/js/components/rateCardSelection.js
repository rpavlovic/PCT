/**
 * @module Populate Select Rate Card titles.
 * @version
 */

var rateCardSelect = (function ($) {
  'use strict';

    var select_cards= $('select#rate-card'),
        cart_title_items = [];

  function initRateCardSelect(feeds) {
    var empID = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.employee), function (employees) {
        resolve(employees.d.results);
      });
    });
    var rateCard = new Promise(function(resolve, reject) {
      $.getJSON(get_data_feed(feeds.billSheet), function (cards) {
        resolve(cards.d.results);
      });
    });

    Promise.all([empID, rateCard])
      .then(function (values) {
        $.each(values[0], function(key, val){
          return val.EmployeeFullName;
        });
      prepopulate_Bill_Titles(values[0], values[1]);
    });

    //match the employee office with list of offices and select the matching one.
    function prepopulate_Bill_Titles(results1, results2) {
      $.each(results1, function(key, val1) {
        var EmpID = val1.EmployeeNumber;
         $.each(results2, function(key, val) {
          if(EmpID === val.EmpNumber) {
            cart_title_items.push('<option value="' + val.BillsheetId + '">' + val.BillsheetName + '</option>');
          }
         });
      });
      select_cards.append($.unique(cart_title_items));
    }

    $('.project-resources .view-card-rate').on('click', function (event) {
      var url = $(this).attr('href');
      var CardID;
      select_cards.each(function(key, val){
        CardID = $(this).find(':selected').val();
      });
      url = updateQueryString('CardID', CardID, url);
      $(this).attr('href', url);
    });
  }

  return {
    initRateCardSelect:initRateCardSelect
  };

})($);


// var p3 = new Promise(function (resolve, reject) {
//             $.getJSON(get_data_feed(feeds.employee), function (employees) {
//               resolve(employees.d.results);
//             });
//           });

//     select_cards.append($.unique(items_business));

//         var cardRate = get_data_feed('billSheet', '10000071');
//       console.log(cardRate);
