
/**
* @module Add remove form fields.
* @version
*/
var addRemoveFields = (function ($) {
  'use strict';
    function initAddRemoveFields(form) {
      var html_row = '<div class="row\">' +
        '<div class="col-11">'  +
          '<div class="field-wrapper">'+
          '<label for="city">Deliverables/Work Stream</label>' +
          '<input name="city" placeholder="Deliverables/Work Stream" value="" />' +
          '</div></div>' +
          '<div class="col-1">' +
          '<button type="button" class="btn btn-blue fa fa-trash" value=""></button>' +
          '</div></div>';

      $(form + ' .deliverables .row').on('click',  function(e) {
        var target = $(e.target);
        var $this = $(this);
        var cloned_input = $this.prev().clone(true, true);

        if(target.hasClass('fa-trash')) {
          $this.detach();
        }
        if(target.hasClass('add-row')) {
          var clear_input = cloned_input.insertAfter($this.prev());
          clear_input.find('input, label').removeClass('show').val('');
        }
      });
  }
  return {
    initAddRemoveFields:initAddRemoveFields
  }

})($);