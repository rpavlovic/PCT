/**
 * @param amount - takes in a string dollar amount e.g. $1,000,123.00 and just returns 1000123.00, or takes 25.0% and returns 25.0
 * @returns {string}
 */
function convertToDecimal(amount){
    var res = amount.replace('$', '').replace(',', '').replace('%', '').trim();
    return res ? res : '';
}
