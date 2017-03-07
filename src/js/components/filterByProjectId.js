function filterByProjectId(element) {
  var projectId = $.map($(this), function (val, key) {
    return val;
  }).join('');
  return element.Projid === projectId;
}
