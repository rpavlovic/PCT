/**
 * @module Load JSON
 * @version
 */

var projectInfoForm = (function ($) {
  'use strict';
  var items_business = [],
    items_country = [],
    items_currency =
      [
        'AUD',
        'CAD',
        'CHF',
        'CNY',
        'EUR',
        'GBP',
        'HKD',
        'JPY',
        'MYR',
        'NZD',
        'SGD',
        'USD'
      ],
    items_region = [],
    select_billing_office = $("form.project-info select[name='Office']"),
    select_currency = $("form.project-info select[name='Currency']"),
    select_region = $("form.project-info select[name='Region']"),
    select_country = $("form.project-info select[name='Country']"),
    input_duration = $("input[name='Duration']"),
    plan_units = $("input[name='PlanUnits']"),
    client_name = $("input[name='name']"),
    project_name = $("input[name='Projname']"),
    prepared_by = $('form.project-info input[name="Preparedby"]'),
    selected = false,
    compensation_type = $("select[name='compensation']"),
    comments = $("textarea[name='comments']");

  items_currency.map(function (value, key) {
    select_currency.append('<option value="' + value + '">' + value + '</option>');
  });

  if (getParameterByName('projName')) {
    $('form.project-info input[name="Projname"]').val(getParameterByName('projName'));
  }

  function prepopulateDeliverables(results) {
    console.log(results);
    results.forEach(function(deliverable) {
      if(!$('input[name="deliverable"]').val()){
        // if the first one is empty, we just fill it in.
        $('input[name="deliverable"]').val(deliverable.DelvDesc);
      }
      else{
        // as we go along, if the last one has a value, we add a row and then fill in the value
        if($('input[name="deliverable"]')[$('input[name="deliverable"]').length-1].value){
          $('button.add-row').click();
          var newInput = $('input[name="deliverable"]')[$('input[name="deliverable"]').length-1];
          $(newInput).val(deliverable.DelvDesc);
        }
      }
    })
  }

  //prepopulate Billing office select with JSON data.
  function prepopulate_Billing_Office_JSON(results) {
    $.each(results, function (key, val) {
      for (key in val) {
        //create office name options.
        if (key === "Office") {
          items_business.push('<option value="' + val[key] + '">' + val.OfficeName + ', ' + val.City + ' / ' + val[key] + '</option>');
        }
        //create country options.
        if (key == "Country") {
          items_country.push('<option value="' + val[key] + '">' + val[key] + '</option>');
        }
        //create region options
        if (key == "Region") {
          items_region.push('<option value="' + val[key] + '">' + val[key] + '</option>');
        }
        //if the currency data is matching to the currency array.
        if (key == "Currency") {
          matchOptions(val[key], select_currency[0]);
        }
      }
    });

    select_billing_office.append($.unique(items_business));
    select_country.append($.unique(items_country));
    select_region.append($.unique(items_region));
  }

  //match the employee office with list of offices and select the matching one.
  function prepopulate_Employee_Office(results) {
    $.each(results, function (key, val) {
      for (key in val) {
        //select the office for the employee that matches
        if (key === "Office") {
          matchOptions(val[key], select_billing_office[0]);
        }
        //select the region for the employee that matches
        if (key === "OfficeRegion") {
          matchOptions(val[key], select_region[0]);
        }
        //select the office country for the employee that matches
        if (key === "OfficeCountry") {
          matchOptions(val[key], select_country[0]);
        }
      }
    });
  }

  function matchOptions(key, elem) {
    $(elem).find('option').map(function () {
      if ($(this).val() === key) {
        return $(this).prop('selected', true);
      }
    });
  }

  function prepopulate_ExtraInfo_JSON(results) {
    results.map(function (value) {
      if (value.Projid == getParameterByName('projID')) {
        $('textarea').val(value.Comments);
        $('form.project-info input[name="name"]').val(value.Clientname);
        $('form.project-info input[name="Preparedby"]').val(value.Preparedby);
        input_duration.val(value.Duration);
        plan_units.val(value.Comptyp);
      }
    });
  }

  function get_unique_id() {
    var d = new Date().getTime();

    //use high-precision timer if available
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now();
    }

    var ProjID = 'xxxxxxxx-xxxx-4xxx-y'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return ProjID;
  }

  function initProjectInfoForm(feeds) {
    var p1 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectDeliverables), function (deliverables) {
        resolve(deliverables.d.results);
      });
    });

    var p2 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.offices), function (offices) {
        resolve(offices.d.results);
      });
    });

    var p3 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.employee), function (employees) {
        resolve(employees.d.results);
      });
    });

    var p4 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.project), function (projects) {
        resolve(projects.d.results);
      });
    });

    Promise.all([p1, p2, p3, p4])
      .then(function (values) {
        prepopulateDeliverables(values[0]);
        prepopulate_Billing_Office_JSON(values[1]);
        prepopulate_Employee_Office(values[2]);
        prepopulate_ExtraInfo_JSON(values[3]);
        floatLabel.initfloatLabel();
      });
  }

  select_billing_office.on('change', function () {
    var url = $('#btn-save').attr('href');
    $('#btn-save').attr('href', updateQueryString('Office', $(this).val(), url));
  });

  $('#btn-save').on('click', function (event) {
    event.preventDefault();
    console.log("saving form");
    var formData = {
      "Projid": get_unique_id(),
      "Plantyp": "OP",
      "Region": select_region.val(),
      "Office": select_billing_office.val(),
      "Currency": select_currency.val(),
      "Clientname": client_name.val(),
      "Projname": project_name.val(),
      "Comptyp": compensation_type.val(),
      "EstStDate": "\/Date(1484784000000)\/",
      "Duration": input_duration.val(),
      "PlanUnits": plan_units.val(),
      "StartDate": "\/Date(1484784000000)\/",
      "EstEndDate": "\/Date(1484784000000)\/",
      "Comments": comments.val(),
      "Preparedby": prepared_by.val(),
      "Createdby": prepared_by.val(),
      "Createdon": "\/Date(1484784000000)\/",
      "Changedby": prepared_by.val(),
      "Changedon": "\/Date(1484784000000)\/"
    };

    $.ajax({
      method: "POST",
      url: get_data_feed('project', get_unique_id()),
      data: formData

      //todo: this needs to be fixed and actually handle errors properly
    })
      .done(function (msg) {
        console.log("Data Saved: " + msg);
      })
      .fail(function () {
        console.log("post failed");
      })
      .always(function () {
        window.location.href = $('#btn-save').attr('href');
      });
  });

  return {
    initProjectInfoForm: initProjectInfoForm
  };

})($);