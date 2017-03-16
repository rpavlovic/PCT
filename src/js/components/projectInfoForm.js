/**
 * @module Load Info Page form input fields.
 * @version
 */
/*jshint loopfunc: true */
var projectInfoForm = (function ($) {
  'use strict';

  var projectId = getParameterByName('projID');
  // no id means there's no url string and we will create a new one.
  if (!projectId) {
    projectId = get_unique_id();
  }

  var deletePayloads = [];
  var isNewProject = false;

  var projectDeliverables = [];
  var items_currency =
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
    plan_units = $("input[name='PlanUnits']"),
    client_name = $("input[name='Clientname']"),
    project_name = $("input[name='Projname']"),
    prepared_by = $('form.project-info input[name="Preparedby"]'),
    selected = false,
    compensation_type = $("select[name='compensation']"),
    comments = $("textarea[name='Comments']"),
    createdOn = null;

  items_currency.forEach(function (currency) {
    select_currency.append('<option value="' + currency + '">' + currency + '</option>');
  });

  function prepopulateDeliverables(results) {
    projectDeliverables = results;

    results.forEach(function (deliverable) {
      if (projectId === deliverable.Projid) {
        var test = $('input[name="deliverable"]').length - 1;
        $('input[name="deliverable"]:eq(' + (test) + ')').val(deliverable.DelvDesc);
        $('button.add-row').click();
      }
    });
    $('input[name="deliverable"]').each(function () {
      if ($('.row.deliverables input[name="deliverable"]').last().val() === '' && $('input[name="deliverable"]').length > 1) {
        $('.row.deliverables input[name="deliverable"]').last().parents().eq(2).detach();
      }
    });
  }

  //prepopulate Billing office select with JSON data.
  function prepopulate_Billing_Office_JSON(results) {
    var offices = [];
    var countries = [];
    var countryOptions = [
      {
        Code: 'AU',
        Country: 'Australia'
      },
      {
        Code: 'CN',
        Country: 'China'
      },
      {
        Code: 'HK',
        Country: 'Hong Kong'
      },
      {
        Code: 'JP',
        Country: 'Japan'
      },
      {
        Code: 'MY',
        Country: 'Malaysia'
      },
      {
        Code: 'SG',
        Country: 'Singapore'
      },
      {
        Code: 'BE',
        Country: 'Belgium'
      },
      {
        Code: 'FR',
        Country: 'France'
      },
      {
        Code: 'DE',
        Country: 'Germany'
      },
      {
        Code: 'GB',
        Country: 'Great Britain'
      },
      {
        Code: 'IE',
        Country: 'Ireland'
      },
      {
        Code: 'IT',
        Country: 'Italy'
      },
      {
        Code: 'NL',
        Country: 'Netherlands'
      },
      {
        Code: 'ES',
        Country: 'Spain'
      },
      {
        Code: 'CH',
        Country: 'Switzerland'
      },

      {
        Code: 'CA',
        Country: 'Canada'
      },
      {
        Code: 'US',
        Country: 'The United States'
      }
    ];

    var regionsOptions = ['APAC', 'EMEA', 'NA'];
    var regions = [];

    regionsOptions.forEach(function (val) {
      regions.push('<option value="' + val + '">' + val + '</option>');
    });

    countryOptions.forEach(function (val) {
      countries.push('<option value="' + val.Code + '">' + val.Country + '</option>');
    });

    results.forEach(function (office) {
      offices.push('<option value="' + office.Office + '">' + office.OfficeName + ', ' + office.City + ' (' + office.Office + ')</option>');
      matchOptions(office.Currency, select_currency[0]);
    });

    select_billing_office.append($.unique(offices.sort()));
    select_country.append($.unique(countries.sort()));
    select_region.append($.unique(regions.sort()));
  }

  //match the employee office with list of offices and select the matching one.
  function prepopulate_Employee_Office(employeeOffice) {
    matchOptions(employeeOffice.Office, select_billing_office[0]);
    matchOptions(employeeOffice.OfficeRegion, select_region[0]);
    matchOptions(employeeOffice.OfficeCountry, select_country[0]);
  }

  function matchOptions(key, elem) {
    $(elem).find('option').map(function () {
      if ($(this).val() === key) {
        return $(this).prop('selected', true);
      }
    });
  }

  function prepopulate_ExtraInfo_JSON(projectInfo) {
    $('textarea').val(projectInfo.Comments);
    $('select[name="Region"]').val(projectInfo.Region);
    $('select[name="Currency"]').val(projectInfo.Currency);

    if(projectInfo.Currency) {
      $('select[name="Currency"]').prop("disabled", true);
    }

    $('select[name="Office"]').val(projectInfo.Office);
    $('select[name="compensation"]').val(projectInfo.Comptyp);
    $('form.project-info input[name="Clientname"]').val(projectInfo.Clientname);
    $('form.project-info input[name="Projname"]').val(projectInfo.Projname);
    $('form.project-info input[name="Preparedby"]').val(projectInfo.Preparedby);
    select_plan_by.val(projectInfo.Plantyp);
    var plan_by = (projectInfo.Plantyp === "WK") ? "Weeks" : "Months";
    input_duration.val(projectInfo.Duration + " " + plan_by);
    plan_units.val('Hourly');
    createdOn = projectInfo.Createdon;
    $('input.datepicker').val(calcPrettyDate(projectInfo.EstStDate));
    $('input[name="weekstart"]').val(calcPrettyDate(projectInfo.StartDate));
    $('input[name="enddate"]').val(calcPrettyDate(projectInfo.EstEndDate));
  }

  function initProjectInfoForm(feeds) {
    var p1 = getProjectDeliverables(projectId);
    var p2 = getOffices();
    var p3 = getEmployeeInfo();
    var p4 = getProjectInfo(projectId);

    Promise.all([p1, p2, p3, p4])
      .then(function (values) {
        prepopulateDeliverables(values[0]);
        prepopulate_Billing_Office_JSON(values[1]);
        prepopulate_Employee_Office(values[2]);
        prepopulate_ExtraInfo_JSON(values[3]);
        floatLabel.initfloatLabel();
      });
  }

  function deleteDeliverables() {
    // if we had more deliverables than we did inputs, then delete the last few
    var deliverableLength = projectDeliverables.length;
    deletePayloads = [];
    while (deliverableLength > $('input[name="deliverable"]').length) {
      var deliverableId = deliverableLength;
      var targetUrl = "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjDeliverablesCollection(Projid='" + projectId.toString() + "',Delvid='" + padNumber(deliverableId.toString()) + "')";
      var lookupPayload = deletePayloads.filter(function (val) {
        return val.url === targetUrl;
      });
      // just make sure we don't keep adding the delete payloads.
      if (lookupPayload.length === 0) {
        deletePayloads.push({
          type: 'DELETE',
          url: targetUrl
        });
      }
      deliverableLength--;
    }
  }

  function checkValues() {
    var array_inpt = [];
    $(arguments).each(function () {
      if (!$.trim($(this).val())) {
        $(this).addClass('empty-error');
        array_inpt.push($(this));
      } else {
        $(this).removeClass('empty-error');
      }
    });
    return array_inpt.length === 0;
  }

  $('.project-info #btn-save').on('click', function (event) {
    event.preventDefault();

    //if Input fields fileld in are filled then continue to the next page.
    if (checkValues(input_duration, client_name, project_name, $('input.datepicker'))) {

      var url = $(this).attr('href'),
        date = new Date(),
        timeStamp = date.getTime();

      url = updateQueryString('projID', projectId, url) + "&" + timeStamp;

      $(this).attr('href', url);


      // get val in unix epoch time
      var EstStDate = new Date($('input.datepicker').val()).getTime();
      var startDate = new Date($('input[name="weekstart"]').val()).getTime();
      var EstEndDate = new Date($('input[name="enddate"]').val()).getTime();
      var changedDate = new Date().getTime();

      if (!createdOn) {
        createdOn = "\/Date(" + changedDate + ")\/";
      }

      var formData = {
        "__metadata": {
          "id": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection('" + projectId + "')",
          "uri": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection('" + projectId + "')",
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
        "Preparedby": prepared_by.val()
      };

      // update deliverables if necessary
      deleteDeliverables();

      var payloads = [];
      payloads.push({
        type: 'POST',
        url: '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection',
        data: formData
      });

      payloads = payloads.concat(deletePayloads);

      var deliverableId = 1;
      $('input[name="deliverable"]').each(function (key, value) {
        if ($(value).val()) {
          payloads.push({
            type: 'POST',
            url: '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjDeliverablesCollection',
            data: {
              "__metadata": {
                "id": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjDeliverablesCollection('" + projectId + "')",
                "uri": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjDeliverablesCollection('" + projectId + "')",
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
            if (!is_fiori()) { window.location.href = $('#btn-save').attr('href'); }
          }, timeout);
        }
      });
    } //end if
  });

  return {
    initProjectInfoForm: initProjectInfoForm
  };

})($);
