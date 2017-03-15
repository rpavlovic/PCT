/**
 * @param amount - takes in a string dollar amount e.g. .2300 and just returns 23.00%
 * @returns {string}
 */
function convertToPercent(amount){
  if(amount && $.isNumeric(amount)) {
    return (Math.round(amount * 100).toFixed(2)) + '%';
  }
  else {
    return 0 + "%";
  }
}
