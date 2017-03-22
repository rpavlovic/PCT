/**
* @module takes in a string amount 1000123.00 convert to  $1,000,123.00
* @version
*/

var RegExDollar = /(\d)(?=(\d\d\d)+(?!\d))/g;

function convertToDollar(currency, amount){
  var symbol = terms_currency[currency];

  switch(currency){
    case 'AUD':
      return parseFloat(amount).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
      break;
    case 'CAD':
      return parseFloat(amount).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
      break;
    case 'CHF':
      return parseFloat(amount).toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' });
      break;
    case 'GBP':
      return parseFloat(amount).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
      break;
    case 'HKD':
      return parseFloat(amount).toLocaleString('zh-HK', { style: 'currency', currency: 'HKD' });
      break;
    case 'JPY':
      return parseFloat(amount).toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
      break;
    case 'MYR':
      return parseFloat(amount).toLocaleString('en-MY', { style: 'currency', currency: 'RM' });
      break;
    case 'NZD':
      return parseFloat(amount).toLocaleString('en-NZ', { style: 'currency', currency: 'NZD' });
      break;
    case 'USD':
      return parseFloat(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      break;
    case 'SGD':
      return parseFloat(amount).toLocaleString('en-SG', { style: 'currency', currency: 'SGD' });
      break;
    // countries that use commas as decimals...
    // case 'EUR':
    //   return parseFloat(amount).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    //   break;

    default:
      if (amount && $.isNumeric(amount)) {
        return symbol + amount.toFixed(2).replace(RegExDollar, "$1,");
      } else {
        return symbol + 0.00;
      }
      break;
  }
}
