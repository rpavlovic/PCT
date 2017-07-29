/**
 * @module takes in a string amount 1000123.00 convert to $1,000,123.00
 * @param {String} currency: three character country code of currency
 * @param {String} amount: amount to convert
 */

var RegExDollar = /(\d)(?=(\d\d\d)+(?!\d))/g;

function convertToDollar(currency, amount){
  var symbol = terms_currency[currency];

  switch(currency){
    case 'AUD':
      return parseFloat(amount).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
    case 'CAD':
      return parseFloat(amount).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
    case 'CHF':
      return parseFloat(amount).toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' });
    case 'GBP':
      return parseFloat(amount).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
    case 'HKD':
      return parseFloat(amount).toLocaleString('zh-HK', { style: 'currency', currency: 'HKD' });
    case 'JPY':
      return parseFloat(amount).toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
    case 'MYR':
      return parseFloat(amount).toLocaleString('en-MY', { style: 'currency', currency: 'RM' });
    case 'NZD':
      return parseFloat(amount).toLocaleString('en-NZ', { style: 'currency', currency: 'NZD' });
    case 'USD':
      return parseFloat(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    case 'SGD':
      return parseFloat(amount).toLocaleString('en-SG', { style: 'currency', currency: 'SGD' });

    // countries that use commas as decimals...
    /*
    case 'EUR':
      return parseFloat(amount).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    */

    default:
      if (amount && $.isNumeric(amount)) {
        return symbol + amount.toFixed(2).replace(RegExDollar, "$1,");
      } else {
        return symbol + 0.00;
      }
      break;
  }
}
