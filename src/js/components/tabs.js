/**
* @module Tabs
* @version
*/

var fadeTabs = (function ($) {
  'use strict';

  function initFadeTabs() {

    $('ul.tabs li').on('click', function() {
      var tab_id = "#" + $(this).attr('data-tab');

      $('ul.tabs li, .tab-content').removeClass('current');

      $(this).addClass('current');
      $(tab_id).addClass('current');
    })
  }

  return {
    initFadeTabs:initFadeTabs
  }

})($);
