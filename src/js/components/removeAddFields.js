/**
* @module Add remove form fields.
* @version
*/
var addRemoveFields = (function ($) {
  'use strict';

    function initAddRemoveFields(form) {
    var Form        = {};
    Form.row        =  $(form + ' .deliverables .row');
    Form.input      = $(form + ' .deliverables .row input');
    Form.removeBtn  = $(".fa-trash");
    Form.AddBtn     = $('.add-row');

    Form.row.on('click',  function(e) {
      var target = $(e.target),
          $this = $(this),
          cloned_input = $this.prev().clone(true, true);
      if(target.hasClass('fa-trash')) {
        if($(form + ' .deliverables .row').length > 2) {
          $this.detach();
        }
        if($(form + ' .deliverables .row').length == 2) {
           Form.removeBtn.prop('disabled', true);
        }
      }
      if(target.hasClass('add-row')) {
        e.preventDefault();
        Form.removeBtn.prop('disabled', false);
        var clear_input = cloned_input.insertAfter($this.prev());
        clear_input.find('input, label, .fa-trash').removeClass('show').val('').prop('disabled', false);
      }
    });
  }
  return {
    initAddRemoveFields:initAddRemoveFields
  };

})($);