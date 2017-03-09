/**
* @module Style Currency for all places where it's displayed.
* @version
*/
var tems_currency = {
  'AUD': '$',
  'CAD': '$',
  'CHF': 'CHF',
  'CNY': '¥',
  'EUR': '€',
  'GBP': '£',
  'HKD': '$',
  'JPY': '¥',
  'MYR': 'RM',
  'NZD': '$',
  'SGD': '$',
  'USD': '$'
};

var currencyStyles = (function ($) {
  'use strict';

  //1. find currency from json endpont projectInfo/projectList
  function initCurrencyStyles(currency) {
    var class_name = currency.toLowerCase();
    $('.currency-sign').removeClass('usd').addClass(class_name);
    tems_currency.map(function(val, key) {
      console.log(val)
    })
  }
  return {
    initCurrencyStyles:initCurrencyStyles
  };
})($);
