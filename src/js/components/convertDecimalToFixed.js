/**
 * @module takes in a string amount 1000123.00 convert to  1,000,123.00
 * @version
 */

function convertDecimalToFixed(x) {
  var dec = x.toString().split('.');
  dec[0] = dec[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  var cents = dec[1] ? dec[1] : '00';
  return dec[0] + '.' + cents;
}
