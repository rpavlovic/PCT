/**
 * @module Load Info Page form input fields.
 * @version
 */

var projectInfoForm = (function ($) {
  'use strict';

  var projectId = getParameterByName('projID');

  // no id means there's no url string and we will create a new one.
  if(!projectId){
    projectId = get_unique_id();
  }
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
    select_plan_by = $("select[name='planby']"),
    input_duration = $("input[name='Duration']"),
   // input_deliverable = $('input[name="deliverable"]'),
    plan_units = $("input[name='PlanUnits']"),
    client_name = $("input[name='name']"),
    project_name = $("input[name='Projname']"),
    prepared_by = $('form.project-info input[name="Preparedby"]'),
    selected = false,
    compensation_type = $("select[name='compensation']"),
    comments = $("textarea[name='Comments']"),
    createdOn = null;

  items_currency.forEach(function (currency) {
    select_currency.append('<option value="' + currency + '">' + currency + '</option>');
  });

  if (getParameterByName('projName')) {
    $('form.project-info input[name="Projname"]').val(getParameterByName('projName'));
  }

  function prepopulateDeliverables(results) {
    results.forEach(function (deliverable) {
      if (projectId === deliverable.Projid) {
        if (!$('input[name="deliverable"]').val()) {
          // if the first one is empty, we just fill it in.
          $('input[name="deliverable"]').val(deliverable.DelvDesc);
        }
        else {
          // as we go along, if the last one has a value, we add a row and then fill in the value
          if ($('input[name="deliverable"]')[$('input[name="deliverable"]').length - 1].value) {
            $('button.add-row').click();
            $('input[name="deliverable"]')[$('input[name="deliverable"]').length - 1].value = deliverable.DelvDesc;
          }
        }
      }
    });
  }

  //prepopulate Billing office select with JSON data.
  function prepopulate_Billing_Office_JSON(results) {
    results.forEach(function (office) {
      items_business.push('<option value="' + office.Office + '">' + office.OfficeName + ', ' + office.City + ' (' + office.Office + ')</option>');
      items_country.push('<option value="' + office.Country + '">' + office.Country + '</option>');
      items_region.push('<option value="' + office.Region + '">' + office.Region + '</option>');
      matchOptions(office.Currency, select_currency[0]);
    });

    select_billing_office.append($.unique(items_business));
    select_country.append($.unique(items_country));
    select_region.append($.unique(items_region));
  }

  //match the employee office with list of offices and select the matching one.
  function prepopulate_Employee_Office(results) {
    results.forEach(function (employeeOffice) {
      matchOptions(employeeOffice.Office, select_billing_office[0]);
      matchOptions(employeeOffice.OfficeRegion, select_region[0]);
      matchOptions(employeeOffice.OfficeCountry, select_country[0]);
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
    var extraProjInfo = results.find(function (value) {
      return value.Projid === projectId;
    });
    if (extraProjInfo) {
      $('textarea').val(extraProjInfo.Comments);
      $('form.project-info input[name="Clientname"]').val(extraProjInfo.Clientname);
      $('form.project-info input[name="Projname"]').val(extraProjInfo.Projname);
      $('form.project-info input[name="Preparedby"]').val(extraProjInfo.Preparedby);
      input_duration.val(extraProjInfo.Duration);
      plan_units.val(extraProjInfo.Comptyp);
      createdOn = extraProjInfo.Createdon;
      $('input.datepicker').val(calcPrettyDate(extraProjInfo.EstStDate));
      $('input[name="weekstart"]').val(calcPrettyDate(extraProjInfo.StartDate));
      $('input[name="enddate"]').val(calcPrettyDate(extraProjInfo.EstEndDate));
    } else {
      plan_units.val('HOURLY');
    }
  }

  function initProjectInfoForm(feeds) {
    var p1 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectDeliverables, projectId), function (deliverables) {
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
      $.getJSON(get_data_feed(feeds.project, projectId), function (projects) {
        resolve(projects.d.results);
      }).fail(function () {
        // not found, but lets fix this and return empty set
        resolve([]);
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

  function checkValues(elem) {
    if (elem.val() === '') {
      elem.addClass('empty-error').focus();
      alert("Please set the missing values");
      return true;
    }
    else {
      elem.removeClass('empty-error');
      return false;
    }
  }

  $('.project-info #btn-save').on('click', function (event) {
    event.preventDefault();

    console.log("saving form");
    var url = $('#btn-save').attr('href');
    url = updateQueryString('projID', projectId, url);
    url = updateQueryString('Office', select_billing_office.val(), url);
    url = updateQueryString('Duration', input_duration.val().replace(/\D/g, ''), url);
    url = updateQueryString('PlanBy', select_plan_by.val(), url);

    $('#btn-save').attr('href', url);

    // get val in unix epoch time
    var EstStDate = new Date($('input.datepicker').val()).getTime();
    var startDate = new Date($('input[name="weekstart"]').val()).getTime();
    var EstEndDate = new Date($('input[name="enddate"]').val()).getTime();
    var changedDate = new Date().getTime();

    if (!createdOn) {
      createdOn = "\/Date(" + changedDate + ")\/";
    }

    if (checkValues(input_duration)) {
      return false;
    }

    var formData = {
      "__metadata": {
        "id": "https://fioridev.interpublic.com:443/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection('" + projectId + "')",
        "uri": "https://fioridev.interpublic.com:443/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection('" + projectId + "')",
        "type": "ZUX_EMPLOYEE_DETAILS_SRV.ProjectInfo"
      },
      "Projid": projectId.toString(),
      "Plantyp": select_plan_by.val().toString().substr(0, 2),
      "Region": select_region.val(),
      "Office": select_billing_office.val(),
      "Currency": select_currency.val(),
      "Clientname": client_name.val(),
      "Projname": project_name.val(),
      "Comptyp": compensation_type.val(),
      "EstStDate": "\/Date(" + EstStDate + ")\/",
      "Duration": parseInt(input_duration.val().replace(/\D/g, '')),
      "PlanUnits": plan_units.val().toString().substr(0, 3),
      "StartDate": "\/Date(" + startDate + ")\/",
      "EstEndDate": "\/Date(" + EstEndDate + ")\/",
      "Comments": comments.val(),
      "Preparedby": prepared_by.val(),
      "Createdby": prepared_by.val(),
      "Createdon": createdOn,
      "Changedby": prepared_by.val(),
      "Changedon": "\/Date(" + changedDate + ")\/"
    };

    var payloads = [];
    payloads.push({
      type: 'POST',
      url: '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection',
      data: formData
    });

    var deliverableId = 1;
    $('input[name="deliverable"]').each(function (key, value) {
      if($(value).val()) {
        payloads.push({
          type: 'POST',
          url: '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjDeliverablesCollection',
          data: {
            "__metadata": {
              "id": "http://fioridev.interpublic.com/sap/opu/odata/sap/ZUX_PCT_SRV/ProjDeliverablesCollection('" + projectId + "')",
              "uri": "http://fioridev.interpublic.com/sap/opu/odata/sap/ZUX_PCT_SRV/ProjDeliverablesCollection('" + projectId + "')",
              "type": "ZUX_EMPLOYEE_DETAILS_SRV.ProjectDeliverables"
            },
            "Projid": projectId.toString(),
            "Delvid": padNumber(deliverableId.toString()),
            "DelvDesc": $(value).val()
          }
        });
        deliverableId++;
      }
    });

    // then we will post the batch,
    $.ajaxBatch({
      url: '/sap/opu/odata/sap/ZUX_PCT_SRV/$batch',
      data: payloads,
      complete: function (xhr, status, data) {
        console.log(data);
        var timeout = getParameterByName('timeout');
        console.log("navigating to new window in" + timeout + "seconds");
        timeout = timeout ? timeout : 1;
        setTimeout(function () {
          window.location.href = $('#btn-save').attr('href');
        }, timeout);
      },
      always: function (xhr, status, data) {
        var timeout = getParameterByName('timeout');
        console.log("navigating to new window in" + timeout + "seconds");
        timeout = timeout ? timeout : 1;
        setTimeout(function () {
          window.location.href = $('#btn-save').attr('href');
        }, timeout);
      }
    });
  });

  return {
    initProjectInfoForm: initProjectInfoForm
  };

})($);