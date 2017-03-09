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

    var OfficeId;

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

    $.getJSON(get_data_feed(feeds.billSheet), function (cards) {
      $(cards).map(function(key, val) {
        var cardName = val.d.results.filter(function( value ) {
          console.log(value.BillsheetName);
          return value.BillsheetName;
        });

      });
    });

    var p2 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.billSheet), function (cards) {
        resolve(cards.d.results);
      }).fail(function () {
        // not found, but lets fix this and return empty set
        console.log('no offices found.... returning empty set');
        resolve([]);
      });
    });

    console.log(p2)



  }

  return {
    initProfileInfo: initProfileInfo
  };

})($);