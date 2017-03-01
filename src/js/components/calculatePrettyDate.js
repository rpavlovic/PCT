/**
 * @module takes in unix epoch time  "\/Date(1484784000000)\/", and returns MM DD, YYYY
 * @version
 */

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function calcPrettyDate(dateVal) {
  var date = new Date(parseFloat(dateVal.substr(6)));
  return (months[date.getMonth()]) + " " + date.getDate() + ", " + date.getFullYear();
}

function calcMonthHeader(dateVal) {
  var date = new Date(parseFloat(dateVal.substr(6)));
  return (months[date.getMonth()]) + " " + date.getFullYear();
}

function addMonthsUTC(date, count) {
  date = new Date(parseFloat(date.substr(6)));
  if (date && count) {
    var m, d = (date = new Date(+date)).getUTCDate();

    date.setUTCMonth(date.getUTCMonth() + count, 1);
    m = date.getUTCMonth();
    date.setUTCDate(d);
    if (date.getUTCMonth() !== m)
      date.setUTCDate(0);
  }
  var d = new Date(date);
  return '/Date(' + d.getTime() + ')/';
}