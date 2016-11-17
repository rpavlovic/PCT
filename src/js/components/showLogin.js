/**
* @module ShowLogin
* @version
*/

var showLogin = (function ($) {
  'use strict';
  var path = window.location.pathname;

  $("#show2, #show3").hide();

  function initLoginTabs() {
    $('button.show-login, button.login, .forgot-pass').on('click', function(e) {
      e.preventDefault();
      jQuery('.targetBlock').fadeOut('slow');
      jQuery('#show'+$(this).attr('target')).fadeIn('slow');
    });
    //open the tabs
    fadeTabs.initFadeTabs();
  }

  return {
    initLoginTabs:initLoginTabs
  }

})($);
