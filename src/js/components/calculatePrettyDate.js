/**
* @module takes in unix epoch time  "\/Date(1484784000000)\/", and returns MM DD, YYYY
* @version
*/

function calcPrettyDate(dateVal){
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];
  var date = new Date( parseFloat( dateVal.substr(6 )));
  return (months[date.getMonth()]) + " " + date.getDate() + ", " + date.getFullYear();
}
