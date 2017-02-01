/**
* @functions Capture and validate and make calculations
* on the table cells.
* @version
*/
function returnData(new_data, table) {

  var error = function() {
    if($(new_data.element).hasClass('num')) {
      if($(new_data.element).html()) {
        $(new_data.element).html('this field accepts numbers only.').addClass('error');
      }
    }
    return true;
  };

  var isNum = false;
  if($(new_data.element).html() != isNaN && $.isNumeric($(new_data.element).html()) &&
    $(new_data.element).hasClass('num')) {
    $(new_data.element).removeClass('error');
    isNum = true;
  }
  if(table === "#csv-table") {
    if(isNum) {
      var ovd_rate = $(new_data.element).html(),
          st_rate = $(new_data.element).prevAll().eq(1).html().replace(/\D/g, ''),
          minus = st_rate - ovd_rate,
          percent = ( (st_rate - ovd_rate) / st_rate) * 100;
      if(st_rate.length > 0) {
        $(new_data.element).next('td.discount').html(percent.toFixed(2)+ "%");
      }
    }
    else {
      error();
    }
  }
  if(table === '#project-resource-table') {
    //for now only rate-override with values into an array from the #project-resource-table.
    var RateOverride = [];
   $('td.rate-override').map(function(index, value) {
      if($(this).text() !== '') {
        return RateOverride.push($(this).text());
      }
    });

    var active_modeling_tabs = $('.modeling-table tr td');
    active_modeling_tabs.removeClass('active');
    active_modeling_tabs.children('input').prop('checked', false);
    //activate Adjusted Resource Hdr when override is entered.
    if(RateOverride.length > 0) {
      if(isNum) {
     //   console.log("Number: " + RateOverride.length > 0 + "NUMEBER: " + isNum)
        $(active_modeling_tabs[2]).addClass('active');
        $(active_modeling_tabs[2]).children('input').prop('checked', true);
      } else {
        error();
      //  console.log("Number: " + RateOverride.length > 0 + "NUMEBER: " + isNum)
        $(active_modeling_tabs[2]).addClass('active');
        $(active_modeling_tabs[2]).children('input').prop('checked', true);
      }
    }
    else {
     // console.log(RateOverride.length > 0)
      error();
      $(active_modeling_tabs[1]).addClass('active');
      $(active_modeling_tabs[1]).children('input').prop('checked', true);
    }
  }
}