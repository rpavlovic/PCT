/**
 * @module Populate Select Rate Card titles.
 * @version
 */

var rateCardSelect = (function ($) {
  'use strict';

  var select_cards = $('select#rate-card'),
    rateCardTitles = [];

  function initRateCardSelect(feeds) {
    var rateCard = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.billSheet, ' '), function (cards) {
        resolve(cards.d.results);
      });
    });

    Promise.resolve(rateCard)
      .then(function (values) {
        select_cards.append('<option value="0">Office Standard Rate</option>');

        var bsIds = [];
        values.forEach(function(val){
          if(-1 === $.inArray(val.BillsheetId, bsIds)){
            rateCardTitles.push('<option value="' + val.BillsheetId + '">' + val.BillsheetName + '</option>');
            bsIds.push(val.BillsheetId);
          }
        });
        // $.each(values, function (key, val) {
        //   rateCardTitles.push('<option value="' + val.BillsheetId + '">' + val.BillsheetName + '</option>');
        // });
        select_cards.append(rateCardTitles);
        
        //hide on load if the Default is loaded
        if (select_cards[0].selectedIndex === 0) {
          $(".col-9 a.view-card-rate").addClass('hide');
        }
      });

    $('.project-resources .view-card-rate').on('click', function (event) {
      var url = $(this).attr('href');
      var CardID = select_cards.find(':selected').val();
      url = updateQueryString('CardID', CardID, url);
      $(this).attr('href', url);
    });

    $('#rate-card').on('change', function (event) {
      var url = $(this).attr('href');
      var CardID = $(this).find(':selected').val();
      url = updateQueryString('CardID', CardID, url);
      var p = new Promise(function (resolve, reject) {

        $.getJSON(get_data_feed(feeds.billSheet, CardID), function (cards) {
          var cardResults = cards.d.results;
          cardResults = cardResults.filter(function(val){
            return val.BillsheetId === CardID;
          });
          resolve(cardResults);
        });
      }).then(function(cardResults){
        console.log(cardResults);
        // iterate over the whole table and insert the overridden values
      });


    });
  }

  return {
    initRateCardSelect: initRateCardSelect
  };
})($);