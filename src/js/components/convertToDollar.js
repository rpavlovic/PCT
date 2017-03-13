/**
* @module takes in a string amount 1000123.00 convert to  $1,000,123.00
* @version
*/

var RegExDollar = /(\d)(?=(\d\d\d)+(?!\d))/g;

function convertToDollar(symbol, amount){
  symbol = terms_currency[symbol];
  if(amount && $.isNumeric(amount)) {
    return symbol + amount.toFixed(2).replace(RegExDollar, "$1,");
  } else {
    return symbol + 0.00;
  }
}
