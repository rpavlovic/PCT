
/**
* @module Add remove form fields.
* @version
*/
var addRemoveFields = (function ($) {
  'use strict';
  var cloned_row = $('.main-input').clone(true).html();

  function initaddRemoveFields(form) {
    // var html_row = '<div class="row\">' +
    //     '<div class="col-11">'  +
    //       '<div class="field-wrapper">'+
    //       '<label for="city">Deliverables/Work Stream</label>' +
    //       '<input name="city" placeholder="Deliverables/Work Stream" value="" />' +
    //       '</div></div>' +
    //       '<div class="col-1">' +
    //       '<button type="button" class="btn btn-blue fa fa-trash" value=""></button>' +
    //       '</div></div>';


    $('.main-input').on('click', function(e) {
      var target = $(e.target);
      var $this = $(this);
      var remove_row = $this;

      if(target.hasClass('fa-trash')) {
        remove_row.remove();
      }
      if(target.hasClass('add-row')) {
        var row = $(this).prev().clone(true);
        console.log(cloned_row);
        $(this).prepend(cloned_row);
        // remove_row.prev().before(row).find( 'input' ).val( '' );
        // if(row.length > 0) {
        //   remove_row.prev().before(row).find( 'input' ).val( '' );
        // }  else {
        //   remove_row.before(html_row);
        // }
      }
    });
  }

  return {
    initaddRemoveFields:initaddRemoveFields
  }

})($);
