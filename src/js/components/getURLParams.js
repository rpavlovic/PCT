/**
* @module Get URL parameters for the project's forms and tables.
* @version
*/
// $.urlParam = function(name) {
//   var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
//   if (results==null){
//     return null;
//   }
//   else{
//     return results[1] || 0;
//   }
// }

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");


  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  console.log(results[2])
  return decodeURIComponent(results[2]);

}