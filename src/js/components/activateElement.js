/**
* @module Highlight  header on radio click
* @version
*/
$.fn.activateElement = function() {

  function remove_active(elem, class_name) {
    elem.removeClass(class_name);
  }

  $(this).each(function() {

    var clicked_element = $(this),
        activate_element = $(this).parent(),
        class_name ='',
        drop_down = '',
        all_active_elements = activate_element.siblings(),
        attr = clicked_element.attr('data-toggle');

    if (typeof attr !== typeof undefined && attr !== false) {
      activate_element = $("#" + $(this).attr('data-toggle'));
      class_name = 'is-open';
      var removeClass = true;
    } else {
      class_name = 'active';
    }
    clicked_element.on('click', function() {
      //remove all active first.
      remove_active(all_active_elements, class_name);
      //if not dropdown button.
      if (!activate_element.hasClass(class_name)) {
        activate_element.addClass(class_name);
      }
      //if dropdown button.
      else if(removeClass) {
        activate_element.removeClass(class_name);
      }
    });
    //on reset clear active too.
    $('button[type="reset"]').on('click', function() {
        //remove_active(all_active_elements, class_name);
    });
  });
};
