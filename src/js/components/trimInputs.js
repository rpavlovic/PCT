function trimInputs() {
  $("[contenteditable]").each(function(index, elem) {
    $(this).text($.trim($(this).text()));
  });
  $("input:text, textarea").each(function(index, elem) {
    $(this).val($.trim($(this).val()));
  });
}
