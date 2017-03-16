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
    var pEmployee = getEmployeeInfo();
    pEmployee.then(function (employee) {
      name.text(employee.EmployeeFullName);
      email.attr("href", "mailto:" + employee.EmployeeEmail).text(employee.EmployeeEmail);
      phone.attr("href", "tel:" + employee.OfficeTelnumber).text(employee.OfficeTelnumber);
      mobile.attr("href", "tel:" + employee.EmployeePhoneNum).text(employee.EmployeePhoneNum);
      office.text(employee.OfficeName).css('font-weight', 'bold');
      street.text(employee.OfficeHousenum + " " + employee.OfficeStreet + ", " + employee.OfficeFloor);
      city.text(employee.OfficeCity + ", " + employee.OfficeRegion + ", " + employee.OfficePostalcode);
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

    var bs = getBillSheet(' ');
    bs.then(function(cards){
      var card_names = sort_unique(cards);
      card_names.map(function (v, k) {
        $('#profile-rate-cards ul').append('<li><a href="customBillSheet.htm?CardID=' + v.BillsheetId + '">' + v.BillsheetName + '</a></li>');
      });
    });
  }

  return {
    initProfileInfo: initProfileInfo
  };

})($);
