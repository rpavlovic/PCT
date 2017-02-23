/**
 * @param amount - takes in a number 1 and returns 001
 * @returns {string}
 */
function padNumber(amount, padAmount){
  var str = "" + amount;

  var pad = "000";
  if(padAmount){
    while(pad.length < padAmount){
      pad = pad + "0";
    }
  }

  console.log(pad);

  return pad.substring(0, pad.length - str.length) + str;
}
