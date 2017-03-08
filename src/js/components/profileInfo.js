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
  }
  return {
    initProfileInfo: initProfileInfo
  };

})($);