/**
 * @module Draw Data Table for Preoject Resource page.
 * @version
 */

var projectResourceTable = (function ($) {
  'use strict';

  function initProjectResourceTable() {
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
      $.getJSON(get_data_feed(feeds.rateCards, getParameterByName('projID')), function (rateCards) {
        resolve(rateCards.d.results);
      });
    });

    var p4 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectResources, getParameterByName('projID')), function (resource) {
        resolve(resource.d.results);
      });
    });

    //fees for modeling table targets
    var t1 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.marginModeling, getParameterByName('projID')), function (data) {
        resolve(data.d.results);
      });
    });

    var p5 = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.plannedHours, getParameterByName('projID')), function (plan) {
        resolve(plan.d.results);
      });
    });

    Promise.all([p1, p2, p3, p4, t1, p5]).then(function (values) {
      //deliverables
      var deliverables = values[0];
      var offices = values[1];

      var rateCards = values[2].filter(function (val) {
        // add in any filtering params if we need them in the future
        return val.CostRate > 0 && val.EmpGradeName;
      });

      var projectResources = values[3];
      var marginModeling = values[4];
      var plannedHours = values[5];

      console.log(marginModeling);
      console.log(plannedHours);

      var targetMarginBasedFee = marginModeling.filter(function(obj){
        return obj.ModelType === 'TMBF';
      });

      if(targetMarginBasedFee.length) {
        $('#target-contribution-margin').text(targetMarginBasedFee[0].CtrMargin);
      }

      var fixedFeeTarget = marginModeling.filter(function(obj){
        return obj.ModelType === 'FFT';
      });

      if(fixedFeeTarget.length) {
        $('#fixed-fee-target').text(fixedFeeTarget[0].Fees);
      }


      var tableHrs = {};
      plannedHours.forEach(function(cell){
        console.log(cell);
        // Cellid:"R1C1"
        // Planhours:4
        // Plantyp:"WK"
        // Projid:"1000100"
        // Rowno:"1"
        // tableHrs
      });

      offices.push({
        Office: "Select Office",
        OfficeName: "Select Office Name",
        City: "Select City"
      });

      var myRows = [];
      var hoursSum = 0;
      var columns = [
        {
          "title": 'Row',
          "class": "center",
          "defaultContent": '',
          "data": "counter",
          "render": function (data, type, row, meta) {
            return meta.row + 1;
          }
        },
        {
          "title": '<i class="fa fa-trash"></i>',
          "class": "center blue-bg",
          "data": null,
          "defaultContent": '<a href=" " class="remove"><i class="fa fa-trash"></i></a>'
        },
        {
          "title": 'Deliverable / Work&nbsp;Stream',
          "data": "Deliverables",
          "defaultContent": '',
          "render": function (data, type, row, meta) {
            var select = "<select class='deliverable' name='DelvDesc'>";
            $.each(data, function (key, val) {
              select += '<option>' + val.DelvDesc + '</option>';
            });
            select += "</select>";
            return select;
          }
        },
        {
          "title": 'Office',
          "data": "Office",
          "defaultContent": '',
          "class": "td-office",
          "render": function (data, type, row, meta) {
            var offices = data.offices;
            var select = "<select class='office' name='Office'>";
            $.each(offices, function (key, val) {
              var selectString = data.selectedOffice === val.Office ? 'selected="selected"' : '';
              select += '<option value="' + val.Office + '"' + selectString + '>' + val.OfficeName + ', ' + val.City + ' (' + val.Office + ')</option>';
            });
            select += "</select>";
            return select;
          }
        },
        {
          "title": 'Title',
          "data": "EmpGradeName",
          "defaultContent": '',
          "class": 'td-title',
          "render": function (data, type, row, meta) {
            return getEmployeeTitles(data);
          }
        },
        {
          "title": 'Class',
          "data": "Class",
          "class": "center td-class",
          "defaultContent": '',
          render: function (data, type, row) {
            return getEmployeeClass(data);
          }
        },
        {
          "title": 'Practice',
          "data": "CostCenterName",
          "defaultContent": '',
          "class": "td-practice",
          "render": function (data, type, row, meta) {
            return getPractices(data);
          }
        },
        {
          "title": 'Role',
          "data": "Role",
          "defaultContent": '<div contenteditable />',
          "render": function (data, type, row, meta) {
            return "<div contenteditable>" + data + "</div>";
          }
        },
        {
          "title": 'Proposed <br/> Resource',
          "data": " ",
          "defaultContent": '<div contenteditable />',
        },
        {
          "title": 'Bill Rate',
          "defaultContent": '',
          "data": "BillRate",
          "class": "td-billrate can-clear",
          "render": function (data, type, row, meta) {
            return data;
          }
        },
        {
          "title": 'Bill Rate <br/> Override',
          "defaultContent": '<label>$</label><div contenteditable />',
          "sClass": "rate-override num"
        },
        {
          "title": "Cost Rate",
          "data": "CostRate",
          "class": 'cost-rate',
          "defaultContent": '<div contenteditable />',
          "visible": false,
          "render": function (data, type, row, meta) {
            var costRate = getCostRate(data);
            return '<div contenteditable>' + costRate + '</div>';
          }
        },
        {
          "title": 'Total Hours',
          "data": "TotalHours",
          "defaultContent": '',
          "class": "total-hours can-clear"//,
          // "render": function (data, type, row, meta) {
          //   var sum = sumHours(row);
          //   return !isNaN(sum) ? sum.toFixed(2) : '';
          // }
        },
        {
          "title": 'Total Fees',
          "data": "TotalFees",
          "defaultContent": '',
          "class": "total-fees can-clear",
          "render": function (data, type, row, meta) {
            return data;
          }
        }
      ];

      var duration = getParameterByName('Duration');
      var planBy = getParameterByName('PlanBy');

      var planLabel = planBy ==='Weekly' ? 'Week' : 'Month';

      // this is supposed to come from data/PlannedHours.json
      projectResources.forEach(function (resource) {
        resource.hours = [];
        for(var hrCnt = 1; hrCnt <= duration; hrCnt++){
          resource.hours.push(hrCnt);
        }

        var row = {
          "EmpGradeName": resource,
          "Deliverables": deliverables,
          "Office": {offices: offices, selectedOffice: getParameterByName('Office')},
          "Role": resource.Role,
          "Class": resource,
          "CostRate": resource,
          "CostCenterName": resource,
          "BillRate": resource.BillRate
        };

        var pos = 1;
        resource.hours.forEach(function (hour) {
          row['hour-' + pos++] = hour;
        });
        myRows.push(row);
      });

      for(var i = 1; i <= duration; i++) {
        columns.push({
          "title": planLabel + ' ' + i,
          "data": 'hour-' + i,
          "defaultContent": '<div contenteditable />',
          render: renderMonth
        });
      }

      var projResourceTable = $('#project-resource-table').DataTable({
        "searching": false,
        "data": myRows,
        "deferRender": true,
        "paging": false,
        "stateSave": true,
        "info": false,
        "bAutoWidth": false,
        "ordering": true,
        "columnDefs": [
          {
            "orderable": false,
            "targets": [1]
          }
        ],
        "order": [[3, 'asc']],
        "columns": columns,
        "bFilter": false,
        "select": true,
        "rowCallback": function (row, json) {
          $(row).removeClass('odd even');
          $("td:nth-child(n+8):not(:nth-child(10)):not(:nth-child(12)):not(:nth-child(13))", row)
            .addClass("contenteditable");
        },
        "createdRow": function (row, data, index) {
          $('tfoot th').removeClass('center blue-bg rate-override num');
        },
        "drawCallback": function (row) {
          $("#project-resource-table tbody select.office").on('change', function () {
            console.log("office changed");
            var OfficeID = $(this).val(),
              nodes = $(this);
            getJobTitle(OfficeID, nodes);
            recalculateStuff();
          });

          $("#project-resource-table tbody select.title").on('change', function () {
            console.log("title changed");
            var OfficeID = $(this).find(':selected').data('office');
            var nodes = $(this);
            getClass(nodes);
            getPractice(OfficeID, nodes);
            loadBillRate(nodes);
            recalculateStuff();
          });

          $('.contenteditable').on('keyup focusout', function (e) {
            recalculateStuff();
          });
        },
        "initComplete": function (settings, json, row) {
          setTimeout(recalculateStuff, 1000);
        },
        "bDestroy": true
      });

      //Add Row
      $('.project-resources').on('click', '#add-row', function (e) {
        e.preventDefault();
        projResourceTable.row.add({
          "Office": {offices: offices, selectedOffice: getParameterByName('Office')},
          "CostCenterName": [],
          "Deliverables": deliverables,
          "Class": '',
          "Role": ''
        }).draw().node();
        projResourceTable.rows().nodes().to$().last().addClass('new-row').delay(1000).queue(function () {
          $(this).removeClass("new-row").dequeue();
        });
      });

      //Remove row
      $('#project-resource-table tbody').on('click', '.remove', function (e) {
        e.preventDefault();
        projResourceTable.row($(this).parents('tr')).remove().draw(false);
      });

      function getJobTitle(OfficeID, nodes) {
        var titleSelect = nodes.closest('tr').find('.title'),
          EmpTitle = [];
        rateCards.map(function (val) {
          if (OfficeID === val.Office) {
            EmpTitle.push('<option value="' + val.EmpGradeName + '" ' +
              'data-rate="' + val.BillRate + '" data-class="' + val.Class + '" data-office="' + val.Office + '" data-company="'+ val.Company +'"' +
              'data-costrate="' + val.CostRate + 'data-currency="' + val.LocalCurrency + '" >' + val.EmpGradeName + '</option>');
          }
        });
        if (EmpTitle.length) {
          EmpTitle.unshift('<option data-class="">Select Title</option>');
        }
        titleSelect.empty().append(EmpTitle);
      }

      function getClass(nodes) {
        nodes.closest('tr').find('.td-class').empty().append(nodes.find(':selected').data('class'));
      }

      //get deliverables from projectRelatedDeliverables json
      function getPractice(OfficeID, nodes) {
        console.log(OfficeID);
        var practiceSelect = nodes.closest('tr').find('.practice');
        var Practice = [];
        Practice.push('<option>Select Practice</option>');
        rateCards.filter(function (val) {
          return val.Office === OfficeID && val.CostCenterName;
        }).map(function (val) {
          if (OfficeID === val.Office) {
            Practice.push('<option value="' + val.CostCenterName + '" ' + 'data-office="' + val.Office + '">' + val.CostCenterName + '</option>');
          }
        });
        practiceSelect.empty().append(Practice);
      }

      function loadBillRate(nodes) {
        var tems_currency = {
          'AUD': '$',
          'CAD': '$',
          'CHF': 'CHF',
          'CNY': '¥',
          'EUR': '€',
          'GBP': '£',
          'HKD': '$',
          'JPY': '¥',
          'MYR': 'RM',
          'NZD': '$',
          'SGD': '$',
          'USD': '$'
        };
        var currency = tems_currency[nodes.closest('tr').find('.title :selected').data('currency')];
        nodes.closest('tr').find('.td-billrate').empty().append(currency + nodes.find(':selected').data('rate'));
        //for calculations on resourceCalculation.js file
        resourceCalculation.initResourceFormulas(nodes.closest('tr').find('.td-billrate'), "#project-resource-table");
      }

      function getEmployeeTitles(resource) {
        var select = "<select class='title' name='EmpGradeName'>";
        select += '<option data-class="">Select Title</option>';

        rateCards.forEach(function (val) {
          var selectString = resource && resource.EmpGradeName === val.EmpGradeName ? 'selected="selected"' : '';
          select += '<option value="' + val.EmpGradeName + '" ' + 'data-rate="' + val.BillRate +
            '" data-class="' + val.Class + '" data-office="' + val.Office + '" ' + 'data-costrate="' + val.CostRate + '" ' +
            'data-currency="' + val.LocalCurrency + '" ' + selectString + '>' + val.EmpGradeName + '</option>';
        });

        select += "</select>";
        return select;
      }

      function getEmployeeClass(employee) {
        var rcElement = rateCards.find(function (val) {
          return val.Office === employee.Officeid && employee.EmpGradeName === val.EmpGradeName;
        });
        if (rcElement)
          return rcElement.Class;
        else
          return '';
      }

      function getPractices(employee) {
        var select = "<select class='practice' name='CostCenterName'>";
        select += "<option>Select Practice</option>";

        rateCards.filter(function (val) {
          return val.Office === employee.Officeid && val.CostCenterName;
        }).forEach(function (val) {
          var selected = '';
          if (val.Office === employee.Officeid) {
            selected = 'selected="selected" ';
          }
          select += '<option value="' + val.CostCenterName + '" ' + selected + 'data-office="' + val.Office + '">' + val.CostCenterName + '</option>';
        });

        return select;
      }

      function renderMonth(data, type, row, meta) {
        if(data) {
          return '<div contenteditable class="month">' + data + '</div>';
        }
        else {
          return '<div contenteditable class="month"></div>';
        }
      }

      function getCostRate(resource) {
        if (!resource) {
          return '';
        }

        var filteredRates = rateCards.filter(function (val) {
          return val.Office === resource.Officeid && val.EmpGradeName === resource.EmpGradeName;
        });

        if (!filteredRates.length) {
          return '';
        }

        if (filteredRates.length > 1) {
          console.log("error, resource matched more than one");
        }

        return filteredRates.pop().CostRate;
      }

      function recalculateStuff() {
        var rows = projResourceTable.rows();
      //  console.log(rows.context[0].aoData);
        var tableHoursSum = 0;
        var tableFeeSum = 0;
        // calculate total hours
        var standardFeeSum = 0;
        var isAdjusted = false;
        var totalCostSum = 0;
        var REgex_dollar = /(\d)(?=(\d\d\d)+(?!\d))/g;
        for (var i = 0; i < rows.context[0].aoData.length; i++) {
          // get sum of the hour column per row
          var hoursPerRow = 0;
          for (var j = 14; j < rows.context[0].aoData[i].anCells.length; j++) {
            var hoursCells = parseFloat($(rows.context[0].aoData[i].anCells[j]).text());
            hoursPerRow += !isNaN(hoursCells) ? hoursCells : 0;
          }
          var rowSum = !isNaN(hoursPerRow) ? hoursPerRow.toFixed(2) : '';
          $(rows.context[0].aoData[i].anCells[12]).text(rowSum);

          // calc fee per row
          var billRate = parseFloat($(rows.context[0].aoData[i].anCells[9]).text().replace('$', ''));
          billRate = !isNaN(billRate) ? billRate : 0;

          var billRateOverride = parseFloat($(rows.context[0].aoData[i].anCells[10]).text().replace('$', ''));
          billRateOverride = !isNaN(billRateOverride) ? billRateOverride : 0;

          var rate = billRateOverride ? billRateOverride : billRate;
          var costRate = parseFloat($(rows.context[0].aoData[i].anCells[11]).text().replace('$', ''));

          costRate = !isNaN(costRate) ? costRate : 0;
          if(!isAdjusted && billRateOverride) {
            isAdjusted = true;
           }
          var totalFeePerRow = parseFloat(hoursPerRow) * rate;
          var totalStandardFeePerRow = parseFloat(hoursPerRow) * billRate;
          var totalCostPerRow = parseFloat(hoursPerRow) * costRate;
          $(rows.context[0].aoData[i].anCells[13]).text("$" + totalFeePerRow.toFixed(2).replace(REgex_dollar, "$1,"));

          totalCostSum += totalCostPerRow;
          tableFeeSum += totalFeePerRow;
          standardFeeSum += totalStandardFeePerRow;
          tableHoursSum += hoursPerRow;
        }

        var standardContribMargin = (standardFeeSum - totalCostSum) / standardFeeSum;
        var adjustedContributionMargin =  (tableFeeSum - totalCostSum) / tableFeeSum;
        var standardAvgRate = standardFeeSum/tableHoursSum;
        var adjustedAvgRate = tableFeeSum/tableHoursSum;

        var modeling_table_strd_fee = $("#modeling-table tbody #total-fee_standard-resource");
        var modeling_table_strd_contrib = $("#modeling-table tbody #contribution-margin_standard-resource");
        var modeling_table_strd_avg_rate = $("#modeling-table tbody #avg-rate_standard-resource");

        var modeling_table_adj_fee = $("#modeling-table tbody #total-fee_adjusted-resource");
        var modeling_table_adj_contrib =  $("#modeling-table tbody #contribution-margin_adjusted-resource");
        var modeling_table_adj_avg_rate = $("#modeling-table tbody #avg-rate_adjusted-resource");

        $('tfoot th.total-fees').text("$" + tableFeeSum.toFixed(2).replace(REgex_dollar, "$1,"));
        $('tfoot th.total-hours').text(tableHoursSum.toFixed(2));

        modeling_table_strd_fee.text("$" + standardFeeSum.toFixed(2).replace(REgex_dollar, "$1,"));
        modeling_table_strd_contrib.text(standardContribMargin.toFixed(2) * 100 + "%");
        modeling_table_strd_avg_rate.text("$" + standardAvgRate.toFixed(2).replace(REgex_dollar, "$1,"));

        //To activate adjusted resource Tab.
        var active_modeling_tabs = $('#modeling-table tr td');
        active_modeling_tabs.removeClass('active');
        active_modeling_tabs.children('input').prop('checked', false);

        if(isAdjusted) {
          modeling_table_adj_fee.text("$" + tableFeeSum.toFixed(2).replace(REgex_dollar, "$1,"));
          modeling_table_adj_contrib.text(adjustedContributionMargin.toFixed(2) * 100 + "%");
          modeling_table_adj_avg_rate.text("$" + adjustedAvgRate.toFixed(2).replace(REgex_dollar, "$1,"));

          //active adjusted tab
          $(active_modeling_tabs[2]).addClass('active');
          $(active_modeling_tabs[2]).children('input').prop('checked', true);
        }
        else {
          modeling_table_adj_fee.text('');
          modeling_table_adj_contrib.text('');
          modeling_table_adj_avg_rate.text('');

          //remove Active state on the tab.
          $(active_modeling_tabs[1]).addClass('active');
          $(active_modeling_tabs[1]).children('input').prop('checked', true);
        }

        var targetContributionMargin = parseFloat($('#target-contribution-margin').text());
        if(targetContributionMargin) {
          var targetMarginBasedFee = totalCostSum / (1 - (targetContributionMargin/100));
          $("#modeling-table #total-fee_target-resource").text("$" + targetMarginBasedFee.toFixed(2).replace(REgex_dollar, "$1,"));
          var targetMarginAvgRate = targetMarginBasedFee/tableHoursSum;
          $('#modeling-table #avg-rate_target-resource').text("$" + targetMarginAvgRate.toFixed(2).replace(REgex_dollar, "$1,"));
        }
        else{
          $("#modeling-table #total-fee_target-resource").text('');
          $('#modeling-table #avg-rate_target-resource').text('');
        }

        var fixedFeeTarget = parseFloat($('#fixed-fee-target').text());

        if(!isNaN(fixedFeeTarget)){
          var contributionMarginFixedFee = ((fixedFeeTarget - totalCostSum) / fixedFeeTarget) * 100;
          $('#contribution-margin_fixed-fee').text(contributionMarginFixedFee.toFixed(2) + "%");
          var avgRateFixedFee = fixedFeeTarget / tableHoursSum ;
          $('#avg-rate_fixed-resource').text("$" + avgRateFixedFee.toFixed(2).replace(REgex_dollar, "$1,"));
        }
        else{
          $('#contribution-margin_fixed-fee').text('');
          $('#avg-rate_fixed-resource').text('');
        }
      }
    });
  $('.project-resources #btn-save').on('click', function (event) {
    event.preventDefault();
    console.log("saving form");

    var url = $('#btn-save').attr('href');
    url = updateQueryString('projID', getParameterByName('projID'), url);
    url = updateQueryString('Office', getParameterByName('Office'), url);
    url = updateQueryString('Duration', getParameterByName('Duration'), url);
    url = updateQueryString('PlanBy', getParameterByName('PlanBy'), url);

    $('#btn-save').attr('href', url);

    // get val in unix epoch time
    // var EstStDate = new Date($('input.datepicker').val()).getTime();
    // var startDate = new Date($('input[name="weekstart"]').val()).getTime();
    // var EstEndDate = new Date($('input[name="enddate"]').val()).getTime();
    // var changedDate = new Date().getTime();

    // if(!createdOn){
    //   createdOn = "\/Date("+changedDate+")\/";
    // }

    buildPayload();

    var formData = {
      "Projid" : getParameterByName('projID'),
      "Officeid" : getParameterByName('Office')
    };

    $.ajax({
      method: "POST",
      url: get_data_feed('project', getParameterByName('projID')),
      data: formData
      //todo: this needs to be fixed and actually handle errors properly
    })
      .done(function (msg) {
        console.log("Data Saved: " + msg);
        window.location.href = $('#btn-save').attr('href');
      })
      .fail(function (data) {
        console.log("post failed: " + data);
      })
      .always(function () {
        if ( !is_fiori() ) {
        //  window.location.href = $('#btn-save').attr('href');
        }
      });
    });
  }

  function buildPayload() {
    var projResourceTable = $('#project-resource-table').DataTable();
    var rows = projResourceTable.rows();

    var rowIndex = 1;
    for (var i = 0; i < rows.context[0].aoData.length; i++) {
      var hoursPerRow = 0;
      var columnIndex = 1;
      for (var j = 14; j < rows.context[0].aoData[i].anCells.length; j++) {
        var value = $(rows.context[0].aoData[i].anCells[j]).text();
        console.log("r" + rowIndex + "c" + columnIndex++ + ": "+ value);
      }
      rowIndex++;
    }
  }

  return {
    initProjectResourceTable: initProjectResourceTable
  };
})($);