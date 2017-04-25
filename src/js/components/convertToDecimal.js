/**
 * @param amount - takes in a string dollar amount e.g. $1,000,123.00 and just returns 1000123.00, or takes 25.0% and returns 25.0
 * @returns {string}
 */
function convertToDecimal(amount){
  // need to strip out all symbols
  var re = /[^0-9.]/gi;
  var res = amount.replace(re, '').trim();
  return res ? res : '0';
}
