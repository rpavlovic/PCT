function trimInputs(){
  $("[contenteditable]").each(function(index, elem) {
    elem.innerText = elem.innerText.trim();
  });
  $("input:text, textarea").each(function(index, elem) {
      $(this).val($.trim($(this).val()));
  });
}
