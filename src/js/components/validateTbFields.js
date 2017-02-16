/**
* @functions Capture and validate and make calculations
* on the table cells.
* @version
*/
function returnData(new_data, table) {
  var isNum = false;
  if( ($(new_data).parent().hasClass('num') || $(new_data).hasClass('month')) &&
      $(new_data).html() != isNaN &&
      $.isNumeric($(new_data).html()) &&
      $(new_data).text() !== '' ) {
        $(new_data).removeClass('error');
        isNum = true;
  }

  var error = function() {
    var REgex = /^[\$]?[0-9\.\,]+[\%]?/g;
    if( ($(new_data).parent().hasClass('num') || $(new_data).hasClass('month')) &&
      !isNum && $(new_data).html().replace(REgex, '') &&
      $(new_data).text() !== '') {
      $(new_data).html('this field accepts numbers only.').addClass('error');
    }
    return true;
  };
  console.log(new_data);
  //run error here.
  error();

  if(table === "#csv-table") {
    if(isNum) {
      var ovd_rate = $(new_data).html(),
          st_rate = $(new_data).parent().prevAll('.rate').html().replace(/[^0-9\.]/g,""),
          minus = st_rate - ovd_rate,
          percent = ( (st_rate - ovd_rate) / st_rate) * 100;
      if(st_rate.length > 0) {
        $(new_data).parent().next('td.discount').html(percent.toFixed(2)+ "%");
      }
    }
  }
}