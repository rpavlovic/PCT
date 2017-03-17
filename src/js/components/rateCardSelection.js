/**
 * @module Populate Select Rate Card titles.
 * @version
 */

var rateCardSelect = (function ($) {
  'use strict';

  var select_cards = $('select#rate-card'),
    view_card_link = $('.project-resources .view-card-rate'),
    rateCardTitles = [];

  function initRateCardSelect(customBillsheets, BillsheetId) {
    select_cards.append('<option value="0">Office Standard Rate</option>');
    var bsIds = [];
    customBillsheets.forEach(function (val) {
      if (-1 === $.inArray(val.BillsheetId, bsIds)) {
        var selected = (val.BillsheetId === BillsheetId) ? 'selected="selected"' : '';
        rateCardTitles.push('<option value="' + val.BillsheetId + '" ' + selected + '>' + val.BillsheetName + '</option>');
        bsIds.push(val.BillsheetId);
        if (val.BillsheetId === BillsheetId) {
          view_card_link.text("View/Edit " + val.BillsheetName);
        }
      }
    });

    select_cards.append(rateCardTitles);

    if ($(".project-resources select#rate-card :selected").val() === '0') {
      $(".view-card-rate").parent().fadeOut('slow').addClass('hide');
    }

    //on select change the Card Title for the View Edit link
    select_cards.on('change', function () {
      view_card_link.text("View/Edit " + $("option:selected", this).text());
    });

    $('.project-resources .view-card-rate').on('click', function (event) {
      var url = $(this).attr('href');
      var CardID = select_cards.find(':selected').val();
      url = updateQueryString('CardID', CardID, url);
      $(this).attr('href', url);
    });
  }

  return {
    initRateCardSelect: initRateCardSelect
  };
})($);