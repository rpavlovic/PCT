/**
* @module Style Currency for all places where it's displayed.
* @version
*/
var currencyStyles = (function ($) {
  'use strict';

//1. find currency from json endpont projectInfo/projectList

  function initCurrencyStyles(currency) {
    var class_name = currency.toLowerCase();
    console.log( class_name );
    $('.currency-sign').removeClass('usd').addClass(class_name);
  }
  return {
    initCurrencyStyles:initCurrencyStyles
  };

})($);
