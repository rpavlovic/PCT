/**
* @module Generates a Unique ID
* @version
*/

function get_unique_id() {
  var d = new Date().getTime();

  //use high-precision timer if available
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now();
  }

  var ProjID = 'xxxxxxxx-xxxx-4xxx-y'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return ProjID;
}

function get_project_id() {
  if (getParameterByName('projID')) {
    return getParameterByName('projID');
  }
  return get_unique_id();
}
