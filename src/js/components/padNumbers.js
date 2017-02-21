/**
 * @param amount - takes in a number 1 and returns 001
 * @returns {string}
 */
function padNumber(amount){
  var str = "" + amount;
  var pad = "000";
  return pad.substring(0, pad.length - str.length) + str;
}
