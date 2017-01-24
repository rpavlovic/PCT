
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
  }

  var isNum = false;
  if($(new_data.element).html() != isNaN && $.isNumeric($(new_data.element).html())) {
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
    var data = $('td.rate-override').map(function(index, value) {
      if($(this).text() !== '') {
        return $(this).text();
      }
    }).get();

    var ovd_rate = $(new_data.element).html(),
        active_modeling_tabs = $('.modeling-table tr td');
    active_modeling_tabs.removeClass('active');
    //activate Adjusted Resource Hdr when override is entered.
    if(data.length > 0 && isNum) {
      $(active_modeling_tabs[2]).addClass('active');
      $(active_modeling_tabs[2]).children('input').prop('checked', true);
    }
    else {
      $(active_modeling_tabs[1]).addClass('active');
      $(active_modeling_tabs[1]).children('input').prop('checked', true);
      error();
    }
  }
  if(table === '#project-expence-table') {
    if(isNum) {

    }
    else {
      error();
    }
  }
}