
/**
* @module Add remove form fields.
* @version
*/
var addRemoveFields = (function ($) {
  'use strict';

    function initAddRemoveFields(form) {
    //   var html_row = '<div class="row\">' +
    //     '<div class="col-11">'  +
    //       '<div class="field-wrapper">'+
    //       '<label for="city">Deliverables/Work Stream</label>' +
    //       '<input name="city" placeholder="Deliverables/Work Stream" value="" />' +
    //       '</div></div>' +
    //       '<div class="col-1">' +
    //       '<button type="button" class="btn btn-blue fa fa-trash" value=""></button>' +
    //       '</div></div>';
      $(form + ' .deliverables .row').on('click',  function(e) {
        var target = $(e.target),
            $this = $(this),
            cloned_input = $this.prev().clone(true, true);

        if(target.hasClass('fa-trash')) {
          if($(form + ' .deliverables .row').length > 2) {
            $this.detach();
          }
          if($(form + ' .deliverables .row').length == 2) {
            $('.fa-trash').prop('disabled', true);
          }
        }
        if(target.hasClass('add-row')) {
          $('.fa-trash').prop('disabled', false);
          var clear_input = cloned_input.insertAfter($this.prev());
          clear_input.find('input, label, .fa-trash').removeClass('show').val('').prop('disabled', false);
        }
      });
  }
  return {
    initAddRemoveFields:initAddRemoveFields
  }

})($);