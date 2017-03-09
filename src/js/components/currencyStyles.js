/**
* @module Style Currency for all places where it's displayed.
* @version
*/
var terms_currency = {
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

var lastCall = '';
var currencyStyles = (function ($) {
  'use strict';

  //1. find currency from json endpont ProjectInfoCollection.json
  function initCurrencyStyles(currency) {
    var class_name = currency.toLowerCase();
    $('.currency-sign').removeClass('usd').addClass(class_name);
    lastCall = currency;
  }

  function currSymbol() {
    return terms_currency[lastCall];
  }

  return {
    currSymbol:currSymbol,
    initCurrencyStyles:initCurrencyStyles
  };
})($);
