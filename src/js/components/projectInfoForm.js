/**
 * @module Load Info Page form input fields.
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
    plan_by = $("select[name='planby']"),
    input_duration = $("input[name='Duration']"),
    plan_units = $("input[name='PlanUnits']"),
    client_name = $("input[name='name']"),
    project_name = $("input[name='Projname']"),
    prepared_by = $('form.project-info input[name="Preparedby"]'),
    selected = false,
    compensation_type = $("select[name='compensation']"),
    comments = $("textarea[name='comments']"),
    createdOn = null;

  items_currency.forEach(function (currency) {
    select_currency.append('<option value="' + currency + '">' + currency + '</option>');
  });

  if (getParameterByName('projName')) {
    $('form.project-info input[name="Projname"]').val(getParameterByName('projName'));
  }

  function prepopulateDeliverables(results) {
    var projId = getParameterByName('projID');
    results.forEach(function (deliverable) {
      if (projId === deliverable.Projid) {
        if (!$('input[name="deliverable"]').val()) {
          // if the first one is empty, we just fill it in.
          $('input[name="deliverable"]').val(deliverable.DelvDesc);
        }
        else {
          // as we go along, if the last one has a value, we add a row and then fill in the value
          if ($('input[name="deliverable"]')[$('input[name="deliverable"]').length - 1].value) {
            $('button.add-row').click();
            var newInput = $('input[name="deliverable"]')[$('input[name="deliverable"]').length - 1];
            $(newInput).val(deliverable.DelvDesc);
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
      return value.Projid === getParameterByName('projID');
    });
    if (extraProjInfo) {
      $('textarea').val(extraProjInfo.Comments);
      $('form.project-info input[name="name"]').val(extraProjInfo.Clientname);
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
      $.getJSON(get_data_feed(feeds.projectDeliverables, getParameterByName('projID')), function (deliverables) {
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
      $.getJSON(get_data_feed(feeds.project, getParameterByName('projID')), function (projects) {
        resolve(projects.d.results);
      }).fail(function() {
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

  $('.project-info #btn-save').on('click', function (event) {

    event.preventDefault();

    console.log("saving form");
    var url = $('#btn-save').attr('href');
    url = updateQueryString('projID', getParameterByName('projID'), url);
    url = updateQueryString('Office', $('select[name="Office"]').val(), url);
    url = updateQueryString('Duration', input_duration.val().replace(/\D/g, ''), url);
    url = updateQueryString('PlanBy', $('select[name="planby"]').val(), url);

    $('#btn-save').attr('href', url);

    // get val in unix epoch time
    var EstStDate = new Date($('input.datepicker').val()).getTime();
    var startDate = new Date($('input[name="weekstart"]').val()).getTime();
    var EstEndDate = new Date($('input[name="enddate"]').val()).getTime();
    var changedDate = new Date().getTime();

    if (!createdOn) {
      createdOn = "\/Date(" + changedDate + ")\/";
    }

    // var formData = {
    //   "Projid": getParameterByName('projID'),
    //   "Plantyp": plan_by.val(),
    //   "Region": select_region.val(),
    //   "Office": select_billing_office.val(),
    //   "Currency": select_currency.val(),
    //   "Clientname": client_name.val(),
    //   "Projname": project_name.val(),
    //   "Comptyp": compensation_type.val(),
    //   "EstStDate": "\/Date(" + EstStDate + ")\/",
    //   "Duration": input_duration.val(),
    //   "PlanUnits": plan_units.val(),
    //   "StartDate": "\/Date(" + startDate + ")\/",
    //   "EstEndDate": "\/Date(" + EstEndDate + ")\/",
    //   "Comments": comments.val(),
    //   "Preparedby": prepared_by.val(),
    //   "Createdby": prepared_by.val(),
    //   "Createdon": createdOn,
    //   "Changedby": prepared_by.val(),
    //   "Changedon": "\/Date(" + changedDate + ")\/"
    // };

    // $.ajax({
    //   method: "POST",
    //   url: get_data_feed('project', getParameterByName('projID')),
    //   data: formData
    //   //todo: this needs to be fixed and actually handle errors properly
    // })
    //   .done(function (msg) {
    //     console.log("Data Saved: " + msg);
    //     window.location.href = $('#btn-save').attr('href');
    //   })
    //   .fail(function (data) {
    //     console.log("post failed: " + data);
    //   })
    //   .always(function () {
    //     if ( !is_fiori() ) {
    //       window.location.href = $('#btn-save').attr('href');
    //     }
    //   });

    // get the token first.

    // $.ajax({
    //   method: "GET",
    //   url: "/sap/opu/odata/sap/ZUX_PCT_SRV/$metadata",
    //   beforeSend: function (request) {
    //     request.setRequestHeader("X-CSRF-Token", "Fetch");
    //   },
    // }).then(function (data, status, xhr) {
    //   var token = xhr.getResponseHeader("X-CSRF-Token");
    //   console.log(xhr.getResponseHeader("X-CSRF-Token"));
    //
    //   // then we will post the batch,
    //   $.ajaxBatch({
    //     url: '/sap/opu/odata/sap/ZUX_PCT_SRV/$batch',
    //     beforeSend: function (request) {
    //       request.setRequestHeader("X-CSRF-Token", token);
    //     },
    //     data: [
    //       {
    //         type: 'POST',
    //         url: '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjDeliverablesCollection',
    //         data: formData
    //       }
    //     ],
    //     complete: function (xhr, status, data) {
    //       console.log(data);
    //     }
    //   });
    // }).done(function (html) {
    //   console.log(html);
    // });


    var isEmpty = false;
    if (input_duration.val() !== '') {
      isEmpty = true;
    }

    function checkValues(elem) {
      if(isEmpty) {
        elem.removeClass('empty-error');
        return false;
      } else {
        elem.addClass('empty-error').focus();
        alert("Please set the missing values");
        return true;
      }
    }

    if(checkValues(input_duration)) {
      return false;
    }

    var pid = getParameterByName('projID');
    var formData = {
      "__metadata": {
        "id": "https://fioridev.interpublic.com:443/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection('" + pid + "')",
        "uri": "https://fioridev.interpublic.com:443/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection('" + pid + "')",
        "type": "ZUX_EMPLOYEE_DETAILS_SRV.ProjectInfo"
      },
      "Projid": getParameterByName('projID'),
      "Plantyp": plan_by.val().toString().substr(0,2),
      "Region": select_region.val(),
      "Office": select_billing_office.val(),
      "Currency": select_currency.val(),
      "Clientname": client_name.val(),
      "Projname": project_name.val(),
      "Comptyp": compensation_type.val(),
      "EstStDate": "\/Date(" + EstStDate + ")\/",
      "Duration": input_duration.val(),
      "PlanUnits": plan_units.val().toString().substr(0,3),
      "StartDate": "\/Date(" + startDate + ")\/",
      "EstEndDate": "\/Date(" + EstEndDate + ")\/",
      "Comments": comments.val(),
      "Preparedby": prepared_by.val(),
      "Createdby": prepared_by.val(),
      "Createdon": createdOn,
      "Changedby": prepared_by.val(),
      "Changedon": "\/Date(" + changedDate + ")\/"
    };

    $.ajax({
      method: "GET",
      url: "/sap/opu/odata/sap/ZUX_PCT_SRV/$metadata",
      beforeSend: function (request) {
        request.setRequestHeader("X-CSRF-Token", "Fetch");
      }
    }).then(function (data, status, xhr) {
      var token = xhr.getResponseHeader("X-CSRF-Token");
      console.log(token);

      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection",
        "method": "POST",
        "headers": {
          "x-csrf-token": token,
          "content-type": "application/json",
          "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(formData)
      };

      $.ajax(settings).done(function (response) {
        console.log(response);
        var timeout = getParameterByName('timeout');

        console.log("navigating to new window in" + timeout + "seconds");
        timeout = timeout ? timeout : 1;

        setTimeout(function () {
            window.location.href = $('#btn-save').attr('href');
        }, timeout);

      });
    }).always(function() {

      var timeout = getParameterByName('timeout');
      timeout = timeout ? timeout : 1;
      console.log("navigating to new window in" + timeout + "seconds");

      setTimeout(function () {
        window.location.href = $('#btn-save').attr('href');
      }, timeout);
    });

  }); //end on click

  return {
    initProjectInfoForm: initProjectInfoForm
  };

})($);