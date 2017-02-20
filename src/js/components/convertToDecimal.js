/**
* @module takes in a string dollar amount e.g. $1,000,123.00 and just returns 1000123.00
* @version
*/

function convertToDecimal(amount){
  return amount.replace('$', '').replace(',', '').toString();
}
