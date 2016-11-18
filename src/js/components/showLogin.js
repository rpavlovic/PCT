/**
* @module ShowLogin
* @version
*/

var showLogin = (function ($) {
  'use strict';
  var path = window.location.pathname;

  $("#show2, #show3").hide();
  // $('button.login').prop('disabled', false);

  function initLoginTabs() {
    $('button.show-login, button.login, .forgot-pass').on('click', function(e) {
      e.preventDefault();
      $('.targetBlock').fadeOut('slow');
      $('#show'+$(this).attr('target')).fadeIn('slow');

      if($('#show2').is(':visible')) {
       $('button.login').prop('disabled', true);
      }
      if($(e.target).hasClass('forgot-pass')){
        $('button.login').prop('disabled', false);
      }
    });

    //open the tabs
    fadeTabs.initFadeTabs();
  }

  return {
    initLoginTabs:initLoginTabs
  }

})($);
