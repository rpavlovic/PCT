function filterByProjectId(element) {
  var projectId = $.map(this, function(val, key) {
    return key;
  }).join();
    return element.Projid === projectId;
}
