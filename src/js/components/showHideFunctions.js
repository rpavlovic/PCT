/**
* @module ShowLogin
* @version
*/

var showHide = (function ($) {
  'use strict';

  $("#show2, #show3").hide();

  function initShowHide() {

    $('button.show-login, button.login, .forgot-pass').on('click', function(e) {
      e.preventDefault();
      $('.targetBlock').fadeOut('slow');
      $('#show'+$(this).attr('target')).fadeIn('slow');

      if($('#show2').is(':visible')) {
       $('button.login').prop('disabled', true);
      }
      if($(e.target).hasClass('forgot-pass')) {
        $('button.login').prop('disabled', false);
      }
    });

    $('.toggle').on('click', function() {
      $('.toolbar').fadeToggle('slow');
       $(this).html($(this)
        .html() == '- Hide Options' ? '+ Advanced Search Options' : '- Hide Options');
    });
    //open the tabs
    fadeTabs.initFadeTabs();
  }

  //Show/Hide view edit custom rate card link.
  $(".project-resources select#rate-card").on("change", function() {
    if($(this)[0].selectedIndex === 0) {
      $(".col-4 a.view-card-rate").fadeOut('slow').addClass('hide');
    } else {
      $(".col-4 a.view-card-rate").fadeIn('slow').removeClass('hide');
    }
  });

  return {
    initShowHide:initShowHide
  };

})($);
