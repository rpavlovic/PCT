/**
 * @module Populate Profile from feeds.employee json.
 * @version
 */

var profileInfo = (function ($) {
  'use strict';
  var profile_form = $('.form-edit-profile'),
    email = profile_form.find('.email'),
    name = profile_form.find('.name'),
    phone = profile_form.find('.phone'),
    mobile = profile_form.find('.mobile'),
    office = profile_form.find('.office_name'),
    street = profile_form.find('.street'),
    city = profile_form.find('.city');

  function initProfileInfo(feeds) {
    $.getJSON(get_data_feed(feeds.employee), function (employees) {
        var val = employees.d.results[0];
        name.text(val.EmployeeFullName);
        email.attr("href", "mailto:" + val.EmployeeEmail).text(val.EmployeeEmail);
        phone.attr("href", "tel:" + val.OfficeTelnumber).text(val.OfficeTelnumber);
        mobile.attr("href", "tel:" + val.EmployeePhoneNum).text(val.EmployeePhoneNum);
        office.text(val.OfficeName).css('font-weight', 'bold');
        street.text(val.OfficeHousenum + " " + val.OfficeStreet + ", " + val.OfficeFloor);
        city.text(val.OfficeCity + ", " + val.OfficeRegion + ", " + val.OfficePostalcode);
      });

    function sort_unique(arr) {
      if (arr.length === 0) return arr;

      var customRateCards = {};
      for (var i = 0; i < arr.length; i++) { // start loop at 1 as element 0 can never be a duplicate
        if (!customRateCards[arr[i].BillsheetId]) {
          customRateCards[arr[i].BillsheetId] = arr[i];
        }
      }
      customRateCards = Object.values(customRateCards).sort(function (a, b) {
        if (a.BillsheetName < b.BillsheetName)
          return -1;
        if (a.BillsheetName > b.BillsheetName)
          return 1;
        return 0;
      });
      return customRateCards;
    }

    var card_names= [];

    $.getJSON(get_data_feed(feeds.billSheet, ' '), function (cards) {
      card_names = sort_unique(cards.d.results);
      card_names.map(function(v, k) {
        $('#profile-rate-cards ul').append('<li><a href="customBillSheet.htm?CardID='+v.BillsheetId+'">'+v.BillsheetName+'</a></li>');
      });
    });
  }

  return {
    initProfileInfo: initProfileInfo
  };

})($);
