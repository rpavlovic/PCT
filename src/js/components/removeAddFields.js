
/**
* @module Add remove form fields.
* @version
*/
var addRemoveFields = (function ($) {
  'use strict';

  function initaddRemoveFields(form) {
    $('.fa-trash').on('click',function () {
      $(this).parent().prevAll().remove();
      $(this).parent().remove();
    });
    $('.add-row').on('click', function() {
      var row = $(this).parent().parent().prev().clone();
      $(this).parent().parent().prev().before(row).find( 'input:text' ).val( '' );
    });
  }
  return {
    initaddRemoveFields:initaddRemoveFields
  }

})($);
