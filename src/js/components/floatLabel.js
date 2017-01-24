 /**
 * @module float label on the forms.
 * @version
 */
 var floatLabel = (function ($) {
   'use strict';

   function initfloatLabel(form) {
     var onClass = "on",
        showClass = "show";

    $("input, select, textarea").bind("checkval", function() {
      var label = $(this).prev("label");
      if(this.value !== ""){
        label.addClass(showClass);
      } else {
        label.removeClass(showClass);
      }
    }).on("keyup",function() {
      $(this).trigger("checkval");
    }).on("ready",function() {
      $(this).trigger("checkval");
    }).on("change",function() {
      $(this).trigger("checkval");
    }).on("focus",function() {
      $(this).prev("label").addClass(onClass);
    }).on("blur",function() {
        $(this).prev("label").removeClass(onClass);
    }).trigger("checkval");
   }
   return {
     initfloatLabel:initfloatLabel
   };

 })($);
