function filterByProjectId(element){
  // return element.Projid === Object.values(this).join('');
  Object.keys(element).map(function(key) {
      return element[key];
  }).join();
  return element === element;
}
