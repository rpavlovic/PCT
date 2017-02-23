/**
 * @module Populate Select Rate Card titles.
 * @version
 */

var rateCardSelect = (function ($) {
  'use strict';

  var select_cards = $('select#rate-card'),
    cart_title_items = [];

  function initRateCardSelect(feeds) {
    var rateCard = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.billSheet), function (cards) {
        resolve(cards.d.results);
      });
    });

    Promise.resolve(rateCard)
      .then(function (values) {
        $.each(values, function (key, val) {
            cart_title_items.push('<option value="' + val.BillsheetId + '">' + val.BillsheetName + '</option>');
        });
        select_cards.append('<option value="">Select Custom Rate Card</option>');
        select_cards.append($.unique(cart_title_items));
      });

    $('.project-resources .view-card-rate').on('click', function (event) {
      var url = $(this).attr('href');
      var CardID;
      select_cards.each(function (key, val) {
        CardID = $(this).find(':selected').val();
      });
      url = updateQueryString('CardID', CardID, url);
      $(this).attr('href', url);
    });
  }

  return {
    initRateCardSelect: initRateCardSelect
  };
})($);