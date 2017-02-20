/**
* @module takes in a string amount 1000123.00 convert to  $1,000,123.00
* @version
*/

var RegExDollar = /(\d)(?=(\d\d\d)+(?!\d))/g;

function convertToDollar(amount){
  return "$" + amount.toFixed(2).replace(RegExDollar, "$1,");
}
