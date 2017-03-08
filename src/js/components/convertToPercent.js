/**
 * @param amount - takes in a string dollar amount e.g. .2300 and just returns 23.00%
 * @returns {string}
 */
function convertToPercent(amount){
  if(amount && $.isNumeric(amount)) {
    return amount.toFixed(2) * 100 + '%';
  }
  else {
    return 0 + "%";
  }
}
