/**
 * @module Draw Data Table for Preoject Resource page.
 * @version
 */
/*jshint loopfunc: true */
var projectResourceTable = (function ($) {
  'use strict';
  var projectID = getParameterByName('projID') ? getParameterByName('projID').toString() : '';
  var duration;
  var planBy;
  var office;
  var projectResources = [];
  var deletePayloads = [];
  var projectInfo;
  var currency;

  var customBillsheets;

  function loadRateCardFromServerIntoSessionStorage(OfficeId, Currency) {
    var pGetRateCard = getRateCard(OfficeId, Currency);
    return pGetRateCard.then(function (rateCards) {
      sessionStorage.setItem('RateCard' + OfficeId + 'Currency' + Currency, JSON.stringify(rateCards));
    });
  }

  function initProjectResourceTable() {
    var p1 = getProjectDeliverables(projectID);
    var p2 = getOffices();
    var p4 = getProjectResources(projectID);
    //fees for modeling table targets
    var t1 = getMarginModeling(projectID);
    var p5 = getPlannedHours(projectID);
    var pInfo = getProjectInfo(projectID);

    var p3 = Promise.all([p4, pInfo])
      .then(function (values) {
        var resources = values[0];
        var pInfo = values[1];
        var promiseArray = [];
        var limit = {};
        resources.forEach(function (val) {
          if (!limit['RateCard' + val.Officeid + 'Currency' + pInfo.Currency] && !getRateCardLocal(val.Officeid, pInfo.Currency).length) {
            promiseArray.push(loadRateCardFromServerIntoSessionStorage(val.Officeid, pInfo.Currency));
            limit['RateCard' + val.Officeid + 'Currency' + pInfo.Currency] = 1;
          }
        });
        return Promise.all(promiseArray)
          .then(function (results) {
            console.log("rateCard with associated offices are loaded");
            return resources;
          });
      });

    var pBillsheets = getBillSheet(' ');
    Promise.all([p1, p2, p3, p4, t1, p5, pInfo, pBillsheets]).then(function (values) {
      //deliverables
      var deliverables = values[0];
      var offices = values[1];
      projectResources = values[3];
      var marginModeling = values[4];
      var plannedHours = values[5];
      projectInfo = values[6];
      customBillsheets = values[7];

      duration = projectInfo.Duration;
      office = projectInfo.Office;
      planBy = projectInfo.Plantyp;

      rateCardSelect.initRateCardSelect(customBillsheets, projectInfo.BillsheetId);

      var selectedModel = marginModeling.find(function (obj) {
        return obj.Selected === '1';
      });

      var targetMarginBasedFee = marginModeling.filter(function (obj) {
        return obj.ModelType === 'TMBF';
      });

      if (targetMarginBasedFee.length && parseFloat(targetMarginBasedFee[0].CtrMargin)) {
        $('#target-contribution-margin').text(targetMarginBasedFee[0].CtrMargin);
      }

      var fixedFeeTarget = marginModeling.filter(function (obj) {
        return obj.ModelType === 'FFT';
      });
      var comma = /(\d)(?=(\d\d\d)+(?!\d))/g;
      if (fixedFeeTarget.length && parseFloat(fixedFeeTarget[0].Fees)) {
        var fixedFee = convertDecimalToFixed(fixedFeeTarget[0].Fees);
        $('#fixed-fee-target').text(fixedFee);
      }
      var hrRows = {};
      var maxDuration = 0;
      plannedHours.forEach(function (cell) {
        cell.Rowno = parseInt(cell.Rowno);
        if (!hrRows[cell.Rowno]) {
          hrRows[cell.Rowno] = {};
        }

        var cellId = cell.Cellid.replace(/R\d+C/g, '');
        hrRows[cell.Rowno][cellId] = cell.Planhours;
        maxDuration = maxDuration < Object.keys(hrRows[cell.Rowno]).length ? Object.keys(hrRows[cell.Rowno]).length : maxDuration;
      });

      // in case duration not provided
      duration = maxDuration > duration ? maxDuration : duration;
      var myRows = [];
      var hoursSum = 0;
      var columns = [
        {
          "title": 'Row',
          "class": "center",
          "defaultContent": '',
          "data": "Rowno",
          "render": function (data, type, row, meta) {
            if (data) {
              return parseInt(data);
            }
            else {
              return meta.row + 1;
            }
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
            return getDeliverables(data);
          }
        },
        {
          "title": 'Office',
          "data": "Office",
          "defaultContent": '',
          "class": "td-office",
          "render": function (data, type, row, meta) {
            return getOffices(data);
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
            if (data)
              return "<div contenteditable>" + data + "</div>";
          }
        },
        {
          "title": 'Proposed <br/> Resource',
          "data": "ProposedResource",
          "defaultContent": '<div contenteditable />',
          "render": function (data, type, row, meta) {
            if (data)
              return "<div contenteditable>" + data + "</div>";
          }
        },
        {
          "title": 'Bill Rate',
          "defaultContent": '',
          "data": "BillRate",
          "class": "td-billrate",
          "render": function (data, type, row, meta) {
            if (row.Currency) {
              currencyStyles.initCurrencyStyles(row.Currency);
            }
            if (data) {
              return convertToDollar(projectInfo.Currency, parseFloat(data));
            }
          }
        },
        {
          "title": 'Bill Rate <br/> Override',
          "data": "BillRateOvride",
          "defaultContent": '<div contenteditable class="currency-sign usd" />',
          "class": "rate-override num",
          "render": function (data, type, row, meta) {
            if (parseFloat(data))
              return '<div contenteditable class="currency-sign usd">' + parseFloat(data) + '</div>';
          }
        },
        {
          "title": "Cost Rate",
          "data": "CostRate",
          "class": 'td-costrate hide',
          "visible": true,
          "render": function (data, type, row, meta) {
            return getCostRate(data);
          }
        },
        {
          "title": 'Total Hours',
          "data": "TotalHours",
          "defaultContent": '',
          "class": "total-hours can-clear"
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

      // this is supposed to come from data/PlannedHours.json
      projectResources.forEach(function (resource) {

        resource.Rowno = parseInt(resource.Rowno);
        var row = {
          "Rowno": resource.Rowno,
          "EmpGradeName": resource,
          "Deliverables": resource.DelvDesc,
          "Office": resource.Officeid,
          "Role": resource.Role,
          "ProposedResource": resource.ProposedRes,
          "Class": resource,
          "CostRate": resource,
          "CostCenterName": resource,
          "BillRate": resource.BillRate,
          "BillRateOvride": resource.BillRateOvride,
          "Currency": projectInfo.Currency //from projectInfo
        };
        $.each(hrRows[resource.Rowno], function (k, v) {
          row['hour-' + k] = v;
        });
        myRows.push(row);
      });

      var planLabel = planBy === 'WK' ? 'Week' : 'Month';

      var startDate = projectInfo.EstStDate;
      for (var i = 1; i <= duration; i++) {
        columns.push({
          "title": planLabel === 'Month' ? calcMonthHeader(startDate) : 'Week ' + i,
          "data": 'hour-' + i,
          "defaultContent": '<div contenteditable />',
          render: renderMonth
        });
        startDate = addMonthsUTC(startDate, 1);
      }

      //Project Resource Table Datatable starts.
      var projResourceTable = $('#project-resource-table').DataTable({
        "searching": false,
        "dom": '<"toolbar"><B><tip>',
        "data": myRows,
        "deferRender": true,
        "paging": false,
        "stateSave": false,
        "info": false,
        "bAutoWidth": false,
        "ordering": true,
        "columnDefs": [
          {
            "orderable": false,
            "targets": [1]
          }
        ],
        "buttons": [
          {
            "extend": 'csv',
            action: function ( e, dt, node, config ) {
              $('#project-resource-table').resourceTableToCSV();
           }
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
          $('tfoot th').removeClass('center blue-bg total-hours total-fees rate-override td-costrate num hide td-office td-title td-class td-practice td-billrate');
        },
        "drawCallback": function (row) {
          $("#project-resource-table tbody select.office").on('change', function () {
            console.log("office changed");
            var nodes = $(this);
            var OfficeId = $(this).val();
            var Currency = projectInfo.Currency;

            $('.loader').show();
            // clear out the rest of the rows when office was changed..
            nodes.closest('tr').find('.title').empty();
            nodes.closest('tr').find('.td-class').empty();
            nodes.closest('tr').find('.practice').empty();
            nodes.closest('tr').find('.td-billrate').empty();
            nodes.closest('tr').find('.td-costrate').empty();

            // check to see if that office Rate exists in local storage
            // if it exists, then go ahead and then update the dropdown
            if (getRateCardLocal(OfficeId, Currency).length) {
              updateEmployeeTitleSelect(nodes);
            }
            else{
              var pGetRateCard = getRateCard(OfficeId, Currency);
              console.log('rate card not found. loading from server');
              return pGetRateCard.then(function (rateCards) {
                sessionStorage.setItem('RateCard' + OfficeId + 'Currency' + Currency, JSON.stringify(rateCards));
                updateEmployeeTitleSelect(nodes);
              })
            }
            recalculateStuff();
          });
          $("#project-resource-table tbody select.title").on('change', function () {
            console.log("title changed");
            var nodes = $(this);
            getClass(nodes);
            updatePracticeSelect(nodes);
            nodes.closest('tr').find('.td-billrate').empty();
            nodes.closest('tr').find('.td-costrate').empty();
            recalculateStuff();
          });

          $("#project-resource-table tbody select.practice").on('change', function () {
            console.log("practice/cost center changed");
            // just sending out this so we can modify the same row.
            var nodes = $(this);
            loadBillRate(nodes);
            recalculateStuff();
          });
          $('.contenteditable').on('keyup focusout', function (e) {
            recalculateStuff();
            //lighten the rate when in override mode.
            var rate_td = $(this);
            if (rate_td.children('div').text() && rate_td.hasClass('rate-override')) {
              rate_td.prev().css('color', 'lightgrey');
            } else {
              rate_td.prev().css('color', '#5b5b5b');
            }
          });
        },
        "initComplete": function (settings, json) {
          //change currency class names.
          setTimeout(recalculateStuff, 1000);
          currencyStyles.initCurrencyStyles(projectInfo.Currency);
        },
        "bDestroy": true
      });

      function addRow() {
        //if there is no data add one empty row.
        projResourceTable.row.add({
          "Office": '',
          "CostCenterName": '',
          "Deliverables": deliverables,
          "Class": '',
          "Role": ''
        }).draw().node();
        currencyStyles.initCurrencyStyles(projectInfo.Currency);
      }

      if (!projResourceTable.data().count()) {
        addRow();
      }
      //Add Row
      $('.project-resources').on('click', '#add-row', function (e) {
        e.preventDefault();
        addRow();
        projResourceTable.rows().nodes().to$().last().addClass('new-row').delay(1000).queue(function () {
          $(this).removeClass("new-row").dequeue();
        });
      });

      //Remove row
      $('#project-resource-table tbody').on('click', '.remove', function (e) {
        e.preventDefault();
        projResourceTable.row($(this).parents('tr')).remove().draw(false);
        recalculateStuff();
      });

      // maybe move this into that
      $('#rate-card').on('change', function (event) {

        projectInfo.BillsheetId = $('#rate-card').val();

        var url = $(this).attr('href');
        var CardID = $(this).find(':selected').val();
        url = updateQueryString('CardID', CardID, url);

        var p = getBillSheet(CardID);

        p.then(function (cardResults) {
          //console.log(cardResults);
          var projResourceTable = $('#project-resource-table').DataTable();
          var rows = projResourceTable.rows();
          for (var i = 0; i < rows.context[0].aoData.length; i++) {
            // employee title
            //console.log($(rows.context[0].aoData[i].anCells[4]).find(':selected').text());
            var EmpGrade = $(rows.context[0].aoData[i].anCells[4]).find(':selected').val();
            // bill rate override
            //console.log($(rows.context[0].aoData[i].anCells[10]).find('div'));
            var foundCard = cardResults.filter(function (val) {
              return val.TitleId === EmpGrade;
            });
            $(rows.context[0].aoData[i].anCells[10]).find('div').text('');
            if (foundCard[0] && parseInt(foundCard[0].OverrideRate)) {
              $(rows.context[0].aoData[i].anCells[10]).find('div').text(foundCard[0].OverrideRate);
              $(rows.context[0].aoData[i].anCells[9]).css('color', 'lightgrey');
            }
            else {
              $(rows.context[0].aoData[i].anCells[9]).css('color', '#5b5b5b');
            }
          }
          recalculateStuff();
        });
      });

      function getClass(nodes) {
        nodes.closest('tr').find('.td-class').empty().append(nodes.find(':selected').data('class'));
      }

      function getDeliverables(data) {
        var select = "<select class='deliverable' name='DelvDesc'>";
        $.each(deliverables, function (key, val) {
          var selected = val.DelvDesc === data ? 'selected="selected" ' : '';
          select += '<option ' + selected + ' >' + val.DelvDesc + '</option>';
        });
        select += "</select>";
        return select;
      }

      //get deliverables from projectRelatedDeliverables json
      function updatePracticeSelect(nodes) {
        var practiceSelect = nodes.closest('tr').find('.practice');
        var Officeid = nodes.closest('tr').find('.office :selected').val();
        var EmpGradeName = nodes.closest('tr').find('.title :selected').text();
        var practices = getPractices({
          EmpGradeName: EmpGradeName,
          Officeid: Officeid
        });
        practiceSelect.html(practices);
      }

      function loadBillRate(nodes) {
        currency = currencyStyles.currSymbol();
        // the officeId, US01, US12, etc
        var Office = nodes.closest('tr').find('.office :selected').val();
        var EmpGradeName = nodes.closest('tr').find('.title :selected').text();
        var CostCenter = nodes.closest('tr').find('.practice :selected').val();
        var rateCards = getRateCardLocal(Office, projectInfo.Currency);
        var selectedRate = rateCards.find(function (val) {
          return val.Office === Office && val.EmpGradeName === EmpGradeName && val.CostCenter === CostCenter;
        });

        nodes.closest('tr').find('.td-billrate').empty().append(currency + selectedRate.BillRate);
        //this doesn't work if costrate is hidden
        nodes.closest('tr').find('.td-costrate').empty().append(selectedRate.CostRate);

        if (projectInfo.BillsheetId) {
          var targetEmployeeRate = customBillsheets.find(function (rateCard) {
            return rateCard.BillsheetId === projectInfo.BillsheetId && EmpGradeName === rateCard.TitleDesc;
          });

          if (parseFloat(targetEmployeeRate.OverrideRate) > 0) {
            nodes.closest('tr').find('.rate-override div').text(targetEmployeeRate.OverrideRate);
          }
        }

        //for calculations on resourceCalculation.js file
        resourceCalculation.initResourceFormulas(nodes.closest('tr').find('.td-billrate'), "#project-resource-table", projectInfo.Currency);
      }

      function getOffices(Officeid) {
        var select = "<select class='office' name='Office'>";
        select += "<option>Select Office</option>";

        $.each(offices, function (key, val) {
          var selectString = Officeid === val.Office ? 'selected="selected"' : '';
          select += '<option value="' + val.Office + '"' + selectString + '>' + val.OfficeName + ', ' + val.City + ' (' + val.Office + ')</option>';
        });
        select += "</select>";
        return select;
      }

      function updateEmployeeTitleSelect(nodes) {
        $('.loader').hide();
        var employeeTitleSelect = nodes.closest('tr').find('.title');
        var Officeid = nodes.closest('tr').find('.office :selected').val();
        var empTitles = getEmployeeTitles({EmpGradeName: '', Officeid: Officeid});
        employeeTitleSelect.html(empTitles);
      }

      function getEmployeeTitles(resource) {
        // remove duplicates
        var select = "<select class='title' name='EmpGradeName'>";
        select += '<option data-class="">Select Title</option>';
        if (resource) {
          var empGrades = [];
          var rateCards = getRateCardLocal(resource.Officeid, projectInfo.Currency);
          rateCards.filter(function (val) {
            return val.Office === resource.Officeid;
          }).forEach(function (val) {
            empGrades[val.EmpGrade] = val;
          });

          empGrades.sort(function (a, b) {
            return (a.EmpGradeName > b.EmpGradeName) ? 1 : ((b.EmpGradeName > a.EmpGradeName) ? -1 : 0);
          });

          empGrades.forEach(function (val) {
            var selectString = resource && resource.EmpGradeName === val.EmpGradeName ? 'selected="selected"' : '';
            select += '<option value="' + val.EmpGrade + '" data-class="' + val.Class + '" data-currency="' + val.LocalCurrency + '" ' + selectString + '>' + val.EmpGradeName + '</option>';
          });
        }
        select += "</select>";
        return select;
      }

      function getEmployeeClass(employee) {
        var rateCards = getRateCardLocal(employee.Officeid, projectInfo.Currency);
        var rcElement = rateCards.find(function (val) {
          return val.Office === employee.Officeid && employee.EmpGradeName === val.EmpGradeName;
        });
        if (rcElement)
          return rcElement.Class;
        else
          return '';
      }

      // you should filter practices based on employee title/EmpGrade
      function getPractices(employee) {
        var rateCards = getRateCardLocal(employee.Officeid, projectInfo.Currency);
        var select = "<select class='practice' name='CostCenterName'>";
        select += "<option>Select Practice</option>";
        var practices = [];
        rateCards.filter(function (val) {
          return val.Office === employee.Officeid && val.CostCenterName && employee.EmpGradeName === val.EmpGradeName;
        }).forEach(function (val) {
          practices[val.CostCenter] = val;
        });
        practices = Object.values(practices);
        practices.sort(function (a, b) {
          return (a.CostCenterName > b.CostCenterName) ? 1 : ((b.CostCenterName > a.CostCenterName) ? -1 : 0);
        });

        practices.forEach(function (val) {
          var selected = '';
          if (val.CostCenter === employee.Practiceid) {
            selected = 'selected="selected" ';
          }
          select += '<option value="' + val.CostCenter + '" ' + selected + '>' + val.CostCenterName + '</option>';
        });
        select += "</select>";
        return select;
      }

      function renderMonth(data, type, row, meta) {
        if (data) {
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

        var rateCards = getRateCardLocal(resource.Officeid, projectInfo.Currency);
        var filteredRates = rateCards.filter(function (val) {
          //Practiceid which is also CostCenter
          return val.Office === resource.Officeid && val.EmpGradeName === resource.EmpGradeName && val.CostCenter === resource.Practiceid;
        });

        if (!filteredRates.length) {
          return '';
        }

        if (filteredRates.length > 1) {
          console.log("error, resource matched more than one");
        }

        return filteredRates.pop().CostRate;
      }

      //To activate adjusted resource Tab.
      var active_modeling_tabs = $('#modeling-table tr td');

      function modelingTableTabActive() {
        active_modeling_tabs.removeClass('active');
        active_modeling_tabs.children('input').prop('checked', false);
        function activateStates() {
          // if (isAdjusted && tableFeeSum) {
          //   $(active_modeling_tabs[2]).addClass('active');
          //   $(active_modeling_tabs[2]).children('input').prop('checked', true);
          // }
          // else {
          //   $(active_modeling_tabs[1]).addClass('active');
          //   $(active_modeling_tabs[1]).children('input').prop('checked', true);
          // }
          if (selectedModel) {
            $('#' + selectedModel.ModelType).prop("checked", true);
            $('#' + selectedModel.ModelType).parent().addClass('active');
          } else {
            $(active_modeling_tabs[1]).addClass('active');
            $(active_modeling_tabs[1]).children('input').prop('checked', true);
          }
        }

        activateStates();
      }

      modelingTableTabActive();

      function recalculateStuff() {
        var rows = projResourceTable.rows();
        //  console.log(rows.context[0].aoData);
        var tableHoursSum = 0;
        var tableFeeSum = 0;
        // calculate total hours
        var standardFeeSum = 0;
        var isAdjusted = false;
        var totalCostSum = 0;
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
          var billRate = convertToDecimal($(rows.context[0].aoData[i].anCells[9]).text());
          billRate = !isNaN(billRate) ? billRate : 0;

          var billRateOverride = convertToDecimal($(rows.context[0].aoData[i].anCells[10]).text());
          billRateOverride = !isNaN(billRateOverride) ? billRateOverride : 0;

          //highlight the rate is override is present.
          if (!isNaN(billRateOverride) && billRateOverride > 0) {
            $(rows.context[0].aoData[i].anCells[9]).css('color', 'lightgrey');
          }
          else {
            $(rows.context[0].aoData[i].anCells[9]).css('color', '#5b5b5b');
          }
          var rate = billRateOverride ? billRateOverride : billRate;
          var costRate = convertToDecimal($(rows.context[0].aoData[i].anCells[11]).text());

          costRate = !isNaN(costRate) ? costRate : 0;
          if (!isAdjusted && parseFloat(billRateOverride)) {
            isAdjusted = true;
          }

          var totalFeePerRow = parseFloat(hoursPerRow) * rate;
          var totalStandardFeePerRow = parseFloat(hoursPerRow) * billRate;
          var totalCostPerRow = parseFloat(hoursPerRow) * costRate;

          if (totalFeePerRow) {
            $(rows.context[0].aoData[i].anCells[13]).text(convertToDollar(projectInfo.Currency, totalFeePerRow));
          } else {
            $(rows.context[0].aoData[i].anCells[13]).text('');
          }

          totalCostSum += totalCostPerRow;
          tableFeeSum += totalFeePerRow;
          standardFeeSum += totalStandardFeePerRow;
          tableHoursSum += hoursPerRow;
        }

        var standardContribMargin = (standardFeeSum - totalCostSum) / standardFeeSum;
        var adjustedContributionMargin = (tableFeeSum - totalCostSum) / tableFeeSum;
        var standardAvgRate = standardFeeSum / tableHoursSum;
        var adjustedAvgRate = tableFeeSum / tableHoursSum;

        var modeling_table_strd_fee = $("#modeling-table tbody #total-fee_standard-resource");
        var modeling_table_strd_contrib = $("#modeling-table tbody #contribution-margin_standard-resource");
        var modeling_table_strd_avg_rate = $("#modeling-table tbody #avg-rate_standard-resource");

        var modeling_table_adj_fee = $("#modeling-table tbody #total-fee_adjusted-resource");
        var modeling_table_adj_contrib = $("#modeling-table tbody #contribution-margin_adjusted-resource");
        var modeling_table_adj_avg_rate = $("#modeling-table tbody #avg-rate_adjusted-resource");

        if (tableFeeSum) {
          $('tfoot th:eq(2)').text(convertToDollar(projectInfo.Currency, tableFeeSum));
        } else {
          $('tfoot th:eq(2)').text('');
        }
        if (tableHoursSum) {
          $('tfoot th:eq(1)').text(tableHoursSum.toFixed(2));
        } else {
          $('tfoot th:eq(1)').text('');
        }

        if (standardFeeSum) {
          modeling_table_strd_fee.text(convertToDollar(projectInfo.Currency, standardFeeSum));
        } else {
          modeling_table_strd_fee.text('');
        }
        if (standardContribMargin) {
          modeling_table_strd_contrib.text(convertToPercent(standardContribMargin));
        } else {
          modeling_table_strd_contrib.text('');
        }
        if (standardAvgRate) {
          modeling_table_strd_avg_rate.text(convertToDollar(projectInfo.Currency, standardAvgRate));
        } else {
          modeling_table_strd_avg_rate.text('');
        }

        if (isAdjusted) {
          if (tableFeeSum) {
            modeling_table_adj_fee.text(convertToDollar(projectInfo.Currency, tableFeeSum));
          } else {
            modeling_table_adj_fee.text('');
            modeling_table_adj_contrib.text('');
            modeling_table_adj_avg_rate.text('');
          }
          if (adjustedContributionMargin) {
            modeling_table_adj_contrib.text(convertToPercent(adjustedContributionMargin));
          }
          if (adjustedAvgRate) {
            modeling_table_adj_avg_rate.text(convertToDollar(projectInfo.Currency, adjustedAvgRate));
          }
        }
        else {
          modeling_table_adj_fee.text('');
          modeling_table_adj_contrib.text('');
          modeling_table_adj_avg_rate.text('');
        }

        var targetContributionMargin = parseFloat($('#target-contribution-margin').text());
        if (!isNaN(targetContributionMargin) && (totalCostSum || tableHoursSum)) {

          var targetMarginBasedFee = totalCostSum / (1 - (targetContributionMargin / 100));
          $("#modeling-table #total-fee_target-resource").text(convertToDollar(projectInfo.Currency, targetMarginBasedFee));
          var targetMarginAvgRate = targetMarginBasedFee / tableHoursSum;
          $('#modeling-table #avg-rate_target-resource').text(convertToDollar(projectInfo.Currency, targetMarginAvgRate));
        }
        else {
          $("#modeling-table #total-fee_target-resource").text('');
          $('#modeling-table #avg-rate_target-resource').text('');
        }

        var fixedFeeTarget = parseFloat(convertToDecimal($('#fixed-fee-target').text()));

        if (!isNaN(fixedFeeTarget) && (tableHoursSum || totalCostSum)) {
          var contributionMarginFixedFee = ((fixedFeeTarget - totalCostSum) / fixedFeeTarget);
          if (!isNaN(contributionMarginFixedFee)) {
            $('#contribution-margin_fixed-fee').text(convertToPercent(contributionMarginFixedFee));

          }
          var avgRateFixedFee = fixedFeeTarget / tableHoursSum;
          $('#avg-rate_fixed-resource').text(convertToDollar(projectInfo.Currency, avgRateFixedFee));
        }
        else {
          $('#contribution-margin_fixed-fee').text('');
          $('#avg-rate_fixed-resource').text('');
        }
      }
    });

    $('.project-resources #btn-save').on('click', function (event) {
      event.preventDefault();

      console.log("saving form");

      var url = $('#btn-save').attr('href'),
        date = new Date(),
        timeStamp = date.getTime();

      url = updateQueryString('projID', projectID, url) + "&" + timeStamp;

      $('#btn-save').attr('href', url);

      var modelingTablePayloads = buildModelingTablePayload();
      var resourcePayloads = buildResourcePayload();
      var resourceHours = buildResourceHoursPayload();

      deleteResources();

      projectInfo.BillsheetId = $('#rate-card').val();

      var updateProjectInfo = {
        type: 'POST',
        url: '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection',
        data: projectInfo
      };


      var payloads = modelingTablePayloads
        .concat(updateProjectInfo)
        .concat(deletePayloads)
        .concat(resourcePayloads)
        .concat(resourceHours);

      ajaxBatch(payloads, $('#btn-save').attr('href'));
    });
  }

  //Posting the Table to JSON
  function buildModelingTablePayload() {
    var payloads = [];
    var selectedModelId = $('#modeling-table input:checked').attr('id');
    // arbf, srbf, etc

    payloads.push({
      type: 'POST',
      url: '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectRsrcModelingCollection',
      data: {
        "__metadata": {
          "id": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectRsrcModelingCollection(Projid='" + projectID + "',ModelType='ARBF')",
          "uri": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectRsrcModelingCollection(Projid='" + projectID + "',ModelType='ARBF')",
          "type": "ZUX_EMPLOYEE_DETAILS_SRV.ProjectRsrcModeling"
        },
        "Projid": projectID,
        "ModelType": "ARBF",
        "Fees": convertToDecimal($("#modeling-table tbody #total-fee_adjusted-resource").text()) ? convertToDecimal($("#modeling-table tbody #total-fee_adjusted-resource").text()) : "0.0",
        "CtrMargin": convertToDecimal($("#modeling-table tbody #contribution-margin_adjusted-resource").text()) ? convertToDecimal($("#modeling-table tbody #contribution-margin_adjusted-resource").text()) : "0.0",
        "AvgRate": convertToDecimal($("#modeling-table tbody #avg-rate_adjusted-resource").text()) ? convertToDecimal($("#modeling-table tbody #avg-rate_adjusted-resource").text()) : "0.0",
        "Currency": "USD",
        "Selected": selectedModelId === 'ARBF' ? '1' : '0'
      }
    });

    payloads.push({
      type: 'POST',
      url: '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectRsrcModelingCollection',
      data: {
        "__metadata": {
          "id": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectRsrcModelingCollection(Projid='" + projectID + "',ModelType='SRBF')",
          "uri": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectRsrcModelingCollection(Projid='" + projectID + "',ModelType='SRBF')",
          "type": "ZUX_EMPLOYEE_DETAILS_SRV.ProjectRsrcModeling"
        },
        "Projid": projectID,
        "ModelType": "SRBF",
        "Fees": convertToDecimal($("#modeling-table tbody #total-fee_standard-resource").text()) ? convertToDecimal($("#modeling-table tbody #total-fee_standard-resource").text()) : "0.0",
        "CtrMargin": convertToDecimal($("#modeling-table tbody #contribution-margin_standard-resource").text()) ? convertToDecimal($("#modeling-table tbody #contribution-margin_standard-resource").text()) : "0.0",
        "AvgRate": convertToDecimal($("#modeling-table tbody #avg-rate_standard-resource").text()) ? convertToDecimal($("#modeling-table tbody #avg-rate_standard-resource").text()) : "0.0",
        "Currency": "USD", // need to change this to the correct currency
        "Selected": selectedModelId === 'SRBF' ? '1' : '0'
      }
    });

    payloads.push({
      type: 'POST',
      url: '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectRsrcModelingCollection',
      data: {
        "__metadata": {
          "id": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectRsrcModelingCollection(Projid='" + projectID + "',ModelType='FFT')",
          "uri": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectRsrcModelingCollection(Projid='" + projectID + "',ModelType='FFT')",
          "type": "ZUX_EMPLOYEE_DETAILS_SRV.ProjectRsrcModeling"
        },
        "Projid": projectID,
        "ModelType": "FFT",
        "Fees": convertToDecimal($("#modeling-table tbody #fixed-fee-target").text()) ? convertToDecimal($("#modeling-table tbody #fixed-fee-target").text()) : "0.0",
        "CtrMargin": convertToDecimal($("#modeling-table tbody #contribution-margin_fixed-fee").text()) ? convertToDecimal($("#modeling-table tbody #contribution-margin_fixed-fee").text()) : "0.0",
        "AvgRate": convertToDecimal($("#modeling-table tbody #avg-rate_fixed-resource").text()) ? convertToDecimal($("#modeling-table tbody #avg-rate_fixed-resource").text()) : "0.0",
        "Currency": "USD",
        "Selected": selectedModelId === 'FFT' ? '1' : '0'
      }
    });
    payloads.push({
      type: 'POST',
      url: '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectRsrcModelingCollection',
      data: {
        "__metadata": {
          "id": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectRsrcModelingCollection(Projid='" + projectID + "',ModelType='TMBF')",
          "uri": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectRsrcModelingCollection(Projid='" + projectID + "',ModelType='TMBF')",
          "type": "ZUX_EMPLOYEE_DETAILS_SRV.ProjectRsrcModeling"
        },
        "Projid": projectID,
        "ModelType": "TMBF",
        "Fees": convertToDecimal($("#modeling-table tbody #total-fee_target-resource").text()) ? convertToDecimal($("#modeling-table tbody #total-fee_target-resource").text()) : "0.0",
        "CtrMargin": convertToDecimal($("#modeling-table tbody #target-contribution-margin").text()) ? convertToDecimal($("#modeling-table tbody #target-contribution-margin").text()) : "0.0",
        "AvgRate": convertToDecimal($("#modeling-table tbody #avg-rate_target-resource").text()) ? convertToDecimal($("#modeling-table tbody #avg-rate_target-resource").text()) : "0.0",
        "Currency": "USD",
        "Selected": selectedModelId === 'TMBF' ? '1' : '0'
      }
    });
    return payloads;
  }

  function buildResourcePayload() {
    var projResourceTable = $('#project-resource-table').DataTable();
    var rows = projResourceTable.rows();

    var rowIndex = 1;
    var payloads = [];
    //console.log(rows.context[0].aoData);
    for (var i = 0; i < rows.context[0].aoData.length; i++) {
      var payloadIndex = padNumber(rowIndex);
      var brOverRide = convertToDecimal($(rows.context[0].aoData[i].anCells[10]).text()) ? convertToDecimal($(rows.context[0].aoData[i].anCells[10]).text()).toString() : null;
      payloads.push({
        type: 'POST',
        url: '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectResourcesCollection',
        data: {
          "__metadata": {
            "id": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectResourcesCollection(Projid='" + projectID + "',Rowno='" + payloadIndex + "')",
            "uri": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectResourcesCollection(Projid='" + projectID + "',Rowno='" + payloadIndex + "')",
            "type": "ZUX_EMPLOYEE_DETAILS_SRV.ProjectResources"
          },
          "Projid": projectID,
          "Duration": duration.toString(),
          "Rowno": payloadIndex,
          "DelvDesc": $(rows.context[0].aoData[i].anCells[2]).find('option:selected').text(),
          "Officeid": $(rows.context[0].aoData[i].anCells[3]).find('option:selected').val(),
          "EmpGradeName": $(rows.context[0].aoData[i].anCells[4]).find('option:selected').text(),
          "Practiceid": $(rows.context[0].aoData[i].anCells[6]).find('option:selected').val(),
          "Role": $(rows.context[0].aoData[i].anCells[7]).text(),
          "ProposedRes": $(rows.context[0].aoData[i].anCells[8]).text(),
          "BillRate": convertToDecimal($(rows.context[0].aoData[i].anCells[9]).text()),
          "BillRateOvride": brOverRide,
          "TotalHrs": parseFloat(convertToDecimal($(rows.context[0].aoData[i].anCells[12]).text())),
          "TotalFee": convertToDecimal($(rows.context[0].aoData[i].anCells[13]).text()),
          "Plantyp": planBy
        }
      });
      rowIndex++;
    }
    return payloads;
  }

  function buildResourceHoursPayload() {
    // post all of the hours cells
    var projResourceTable = $('#project-resource-table').DataTable();
    var rows = projResourceTable.rows();
    var payloads = [];
    var rowIndex = 1;
    for (var i = 0; i < rows.context[0].aoData.length; i++) {
      var hoursPerRow = 0;
      var columnIndex = 1;
      var payloadRowIndex = padNumber(rowIndex);
      for (var j = 14; j < rows.context[0].aoData[i].anCells.length; j++) {
        var value = $(rows.context[0].aoData[i].anCells[j]).text();
        value = value ? value : "0.0";
        var cellId = "R" + rowIndex + "C" + columnIndex;
        payloads.push({
          type: 'POST',
          url: '/sap/opu/odata/sap/ZUX_PCT_SRV/PlannedHoursSet',
          data: {
            "__metadata": {
              "id": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/PlannedHoursSet(Projid='" + projectID + "',Rowno='" + payloadRowIndex + "',Plantyp='" + planBy + "',Cellid='" + cellId + "')",
              "uri": getHost() + "/sap/opu/odata/sap/ZUX_PCT_SRV/PlannedHoursSet(Projid='" + projectID + "',Rowno='" + payloadRowIndex + "',Plantyp='" + planBy + "',Cellid='" + cellId + "')",
              "type": "ZUX_EMPLOYEE_DETAILS_SRV.PlannedHours"
            },
            "Projid": projectID,
            "Rowno": payloadRowIndex,
            "Plantyp": planBy,
            "Cellid": cellId,
            "Planhours": value
          }
        });
        columnIndex++;
      }
      rowIndex++;
    }
    return payloads;
  }

  function deleteResources() {
    // post all of the hours cells
    deletePayloads = [];
    var resourceLength = projectResources.length;
    while (resourceLength > $('select.deliverable').length) {
      var resourceId = resourceLength;
      var targetUrl = "/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectResourcesCollection(Projid='" + projectID + "',Rowno='" + padNumber(resourceId) + "')";
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

      for (var j = 1; j <= duration; j++) {
        var cellId = "R" + resourceId + "C" + j;
        deletePayloads.push({
          type: 'DELETE',
          url: "/sap/opu/odata/sap/ZUX_PCT_SRV/PlannedHoursSet(Projid='" + projectID + "',Rowno='" + padNumber(resourceId) + "',Plantyp='" + planBy + "',Cellid='" + cellId + "')"
        });
      }
      resourceLength--;
    }
  }

  return {
    initProjectResourceTable: initProjectResourceTable
  };
})($);
