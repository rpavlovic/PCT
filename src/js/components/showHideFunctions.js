/**
* @module ShowLogin
* @version
*/

var showHide = (function ($) {
  'use strict';
  var path = window.location.pathname;

  $("#show2, #show3").hide();
  // $('button.login').prop('disabled', false);

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

  $(".project-resources select[name='rate-card']").on("change", function(){
    if($(this).val().indexOf('Standard') === -1) {
      $(".col-9 a.toggle").fadeOut('slow');
    } else {
      $(".col-9 a.toggle").fadeIn('slow');
    }
  });


  return {
    initShowHide:initShowHide
  };

})($);
