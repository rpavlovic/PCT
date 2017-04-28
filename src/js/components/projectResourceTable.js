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
    showLoader();
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
      hideLoader();
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
          "title": '<i class="fa fa-copy"></i>',
          "class": "center blue-bg",
          "data": null,
          "orderable": false,
          "defaultContent": '<a href=" " class="copy"><i class="fa fa-copy"></i></a>'
        },
        {
          "title": 'Row',
          "class": "center rowno",
          "defaultContent": '',
          "orderable": false,
          "render": function (data, type, row, meta) {
            return meta.row + 1;
          }
        },
        {
          "title": '<i class="fa fa-trash"></i>',
          "class": "center blue-bg",
          "data": null,
          "orderable": false,
          "defaultContent": '<a href=" " class="remove"><i class="fa fa-trash"></i></a>'
        },
        {
          "title": 'Deliverable / Work&nbsp;Stream',
          "data": 'DelvDesc',
          "defaultContent": '',
          "sType": "select",
          "render": function (data, type, row, meta) {
            return getDeliverables(row);
          }
        },
        {
          "title": 'Office',
          "defaultContent": '',
          "class": "td-office",
          "sType": "selecttext",
          "render": function (data, type, row, meta) {
            return getOffices(row);
          }
        },
        {
          "title": 'Title',
          "defaultContent": '',
          "class": 'td-title',
          "sType": "selecttext",
          "render": function (data, type, row, meta) {
            return getEmployeeTitles(row);
          }
        },
        {
          "title": 'Class',
          "class": "center td-class",
          "defaultContent": '',
          "sType": "rclass",
          render: function (data, type, row) {
            return getEmployeeClass(row);
          }
        },
        {
          "title": 'Practice',
          "defaultContent": '',
          "class": "td-practice",
          "sType": "selecttext",
          "render": function (data, type, row, meta) {
            return getPractices(row);
          }
        },
        {
          "title": 'Role',
          "sClass": "td-role",
          "orderable": false,
          "defaultContent": "<div contenteditable onkeypress='return (this.innerText.length <= 39)'/>",
          "render": function (data, type, row, meta) {
            if (row.Role)
              return "<div contenteditable onkeypress='return (this.innerText.length <= 39)'>" + row.Role + "</div>";
          }
        },
        {
          "title": 'Proposed <br/> Resource',
          "sClass": "td-proposed-resource",
          "orderable": false,
          "defaultContent": "<div contenteditable onkeypress='return (this.innerText.length <= 39)'/>",
          "render": function (data, type, row, meta) {
            if (row.ProposedRes)
              return "<div contenteditable onkeypress='return (this.innerText.length <= 39)'>" + row.ProposedRes + "</div>";
          }
        },
        {
          "title": 'Office Standard Rate',
          "defaultContent": '',
          "class": "td-billrate",
          "render": function (data, type, row, meta) {
            if (row.Currency) {
              currencyStyles.initCurrencyStyles(row.Currency);
            }
            if (row.BillRate) {
              return convertToDollar(projectInfo.Currency, parseFloat(row.BillRate));
            }
          }
        },
        {
          "title": 'Client Ratecard',
          "data": "BillRateOvride",
          "orderable": false,
          "defaultContent": '<div contenteditable class="currency-sign usd" />',
          "class": "rate-override num",
          "render": function (data, type, row, meta) {
            if (parseFloat(row.BillRateOvride))
              return '<div contenteditable class="currency-sign ' + projectInfo.Currency + '">' + parseFloat(row.BillRateOvride) + '</div>';
          }
        },
        {
          "title": "Cost Rate",
          "data": "CostRate",
          "class": 'td-costrate hide',
          "visible": true,
          "render": function (data, type, row, meta) {
            return getCostRate(row);
          }
        },
        {
          "title": 'Total Hours',
          "defaultContent": '',
          "orderable": false,
          "class": "total-hours can-clear"
        },
        {
          "title": 'Total Fees',
          "defaultContent": '',
          "orderable": false,
          "class": "total-fees can-clear"
        }
      ];

      // this is supposed to come from data/PlannedHours.json
      projectResources.forEach(function (resource) {
        // just patching up some stuff
        resource.Currency = projectInfo.Currency;
        resource.Rowno = parseInt(resource.Rowno);

        $.each(hrRows[resource.Rowno], function (k, v) {
          resource['hour-' + k] = v;
        });
        myRows.push(resource);
      });

      var planLabel = planBy === 'WK' ? 'Week' : 'Month';

      var startDate = projectInfo.EstStDate;
      for (var i = 1; i <= duration; i++) {
        columns.push({
          "orderable": false,
          "title": planLabel === 'Month' ? calcMonthHeader(startDate) : 'Week ' + i,
          "sClass": "hour",
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
        "buttons": [
          {
            "extend": 'excel',
            action: function (e, dt, node, config) {
              $('#project-resource-table').resourceTableToCSV();
            }
          }
        ],
        //"order": [[3, 'asc']],
        "columns": columns,
        "bFilter": false,
        "select": true,
        "rowCallback": function (row, json) {
          $(row).removeClass('odd even');
          $("td:nth-child(n+9):not(:nth-child(11)):not(:nth-child(13)):not(:nth-child(14))", row)
            .addClass("contenteditable");
        },
        "createdRow": function (row, data, index) {
          $('tfoot th').removeClass('center blue-bg total-hours total-fees rate-override td-costrate num hide td-office td-title td-class td-practice td-billrate');
        },
        "drawCallback": function (row) {
          $("#project-resource-table tbody select.deliverable").on('change', function () {
            var dataRow = $(this).closest('tr');
            var currentRowObject = projResourceTable.row(dataRow).data();
            if (!currentRowObject)
              return;

            currentRowObject.DelvDesc = $(this).val();
            projResourceTable.row(dataRow).data(currentRowObject).draw();
          });

          $("#project-resource-table tbody select.office").on('change', function () {
            console.log("office changed");
            var dataRowO = $(this).closest('tr');
            var currentRowObj = projResourceTable.row(dataRowO).data();
            if (!currentRowObj)
              return;
            currentRowObj.Officeid = $(this).val();
            currentRowObj.EmpGradeName = '';
            currentRowObj.Class = '';
            currentRowObj.Practiceid = '';
            currentRowObj.CostRate = '';
            currentRowObj.BillRate = '';
            currentRowObj.BillRateOvride = '';

            var nodes = $(this);
            var Currency = projectInfo.Currency;
            $('.loader').show();
            // check to see if that office Rate exists in local storage
            // if it exists, then go ahead and then update the dropdown
            if (getRateCardLocal(currentRowObj.Officeid, Currency).length) {
              projResourceTable.row(dataRowO).data(currentRowObj).draw();
              $('.loader').hide();
            }
            else {
              var pGetRateCard = getRateCard(currentRowObj.Officeid, Currency);
              console.log('rate card' + currentRowObj.Officeid + ' not found. loading from server');
              return pGetRateCard.then(function (rateCards) {
                sessionStorage.setItem('RateCard' + currentRowObj.Officeid + 'Currency' + Currency, JSON.stringify(rateCards));
                $('.loader').hide();
                projResourceTable.row(dataRowO).data(currentRowObj).draw();
              });
            }
            recalculateStuff();
          });

          $("#project-resource-table tbody select.title").on('change', function () {
            console.log("title changed");
            var dataRow = $(this).closest('tr');
            var currentRowObj = projResourceTable.row(dataRow).data();
            if (!currentRowObj)
              return;

            currentRowObj.EmpGradeName = $(this).find(':selected').text();
            currentRowObj.Class = $(this).find(':selected').data('class');
            currentRowObj.Practiceid = '';
            currentRowObj.CostRate = '';
            currentRowObj.BillRate = '';
            currentRowObj.BillRateOvride = '';

            projResourceTable.row(dataRow).data(currentRowObj).draw();
            recalculateStuff();
          });

          $("#project-resource-table tbody select.practice").on('change', function () {
            console.log("practice/cost center changed");
            var dataRow = $(this).closest('tr');
            var currentRowObj = projResourceTable.row(dataRow).data();
            if (!currentRowObj)
              return;

            currentRowObj.Practiceid = $(this).find(':selected').val();

            var rateCard = getBillRateCard(currentRowObj);
            currentRowObj.BillRate = rateCard.BillRate;
            currentRowObj.CostRate = rateCard.CostRate;
            projResourceTable.row(dataRow).data(currentRowObj).draw();
            resourceCalculation.initResourceFormulas($(this).closest('tr').find('.td-billrate'), "#project-resource-table", projectInfo.Currency);
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

          var rowNumber = 1;
          $.each($("#project-resource-table tbody tr"), function (k, v) {
            $(v).find('.rowno').text(rowNumber);
            rowNumber++;
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
        var rows = projResourceTable.rows().count();
        projResourceTable.row.add({
          "Office": '',
          "CostCenterName": '',
          "Deliverables": deliverables[0].DelvDesc,
          "Class": '',
          "Role": ''
        }).draw().node();
        recalculateStuff();
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
        projResourceTable.row($(this).closest('tr')).remove().draw();
        recalculateStuff();
      });

      //clone row
      $('#project-resource-table tbody').on('click', '.copy', function (e) {
        e.preventDefault();
        var currentRowbody = projResourceTable.row($(this).closest('tr')).data();
        projResourceTable.row.add(currentRowbody).draw().node();
        recalculateStuff();
      });

      // for debugging
      // $('#project-resource-table tbody').on('click', 'tr', function () {
      //   console.log(projResourceTable.row(this).data());
      //   var currentRow = projResourceTable.row(this).data();
      // });
      
      $('#rate-card').on('change', function (event) {
        projectInfo.BillsheetId = $('#rate-card').val();

        var url = $(this).attr('href');
        var CardID = $(this).find(':selected').val();
        url = updateQueryString('CardID', CardID, url);

        var p = getBillSheet(CardID);
        p.then(function (cardResults) {
          var projResourceTable = $('#project-resource-table').DataTable();
          var rows = projResourceTable.rows();
          for (var i = 0; i < rows.context[0].aoData.length; i++) {
            // employee title
            var EmpGrade = $(rows.context[0].aoData[i].anCells[5]).find(':selected').val();
            // bill rate override
            var foundCard = cardResults.filter(function (val) {
              return val.TitleId === EmpGrade;
            });
            $(rows.context[0].aoData[i].anCells[11]).find('div').text('');
            if (foundCard[0] && parseInt(foundCard[0].OverrideRate)) {
              $(rows.context[0].aoData[i].anCells[11]).find('div').text(foundCard[0].OverrideRate);
              $(rows.context[0].aoData[i].anCells[10]).css('color', 'lightgrey');
            }
            else {
              $(rows.context[0].aoData[i].anCells[10]).css('color', '#5b5b5b');
            }
          }
          recalculateStuff();
        });
      });

      function getDeliverables(resource) {
        var select = "<select class='deliverable' name='DelvDesc'>";
        $.each(deliverables, function (key, val) {
          var selected = val.DelvDesc === resource.DelvDesc ? 'selected="selected" ' : '';
          select += '<option ' + selected + ' >' + val.DelvDesc + '</option>';
        });
        select += "</select>";
        return select;
      }

      function getBillRateCard(resource) {
        var rateCards = getRateCardLocal(resource.Officeid, projectInfo.Currency);
        var selectedRateCard = rateCards.find(function (val) {
          return val.Office === resource.Officeid && val.EmpGradeName === resource.EmpGradeName && val.CostCenter === resource.Practiceid;
        });
        return selectedRateCard ? selectedRateCard : '';
      }

      function getOffices(resource) {
        var select = "<select class='office' name='Office'>";
        select += "<option>Select Office</option>";
        $.each(offices, function (key, val) {
          var selectString = resource.Officeid === val.Office ? 'selected="selected"' : '';
          select += '<option value="' + val.Office + '"' + selectString + '>' + val.OfficeName + ', ' + val.City + ' (' + val.Office + ')</option>';
        });
        select += "</select>";
        return select;
      }

      function getEmployeeTitles(resource) {
        var selectedStyle = resource.EmpGradeName ? '' : "style='border:solid 1px red;'";
        var select = "<select class='title' name='EmpGradeName' " + selectedStyle + ">";
        select += '<option data-class="">Select Title</option>';
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
        var selectedStyle = employee.Practiceid ? '' : "style='border:solid 1px red;'";
        var select = "<select class='practice' name='CostCenterName' " + selectedStyle + ">";
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
        var filteredRates = rateCards.find(function (val) {
          //Practiceid which is also CostCenter
          return val.Office === resource.Officeid && val.EmpGradeName === resource.EmpGradeName && val.CostCenter === resource.Practiceid;
        });

        return filteredRates ? filteredRates.CostRate : '';
      }

      //To activate adjusted resource Tab.
      var active_modeling_tabs = $('#modeling-table tr td');

      function modelingTableTabActive() {
        active_modeling_tabs.removeClass('active');
        active_modeling_tabs.children('input').prop('checked', false);
        function activateStates() {
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
        var tableHoursSum = 0;
        var tableFeeSum = 0;
        // calculate total hours
        var standardFeeSum = 0;
        var isAdjusted = false;
        var totalCostSum = 0;
        for (var i = 0; i < rows.context[0].aoData.length; i++) {
          // get sum of the hour column per row
          var hoursPerRow = 0;
          for (var j = 15; j < rows.context[0].aoData[i].anCells.length; j++) {
            var hoursCells = parseFloat($(rows.context[0].aoData[i].anCells[j]).text());
            hoursPerRow += !isNaN(hoursCells) ? hoursCells : 0;
          }
          var rowSum = !isNaN(hoursPerRow) ? hoursPerRow.toFixed(2) : '';
          $(rows.context[0].aoData[i].anCells[13]).text(rowSum);

          // calc fee per row
          var billRate = convertToDecimal($(rows.context[0].aoData[i].anCells[10]).text());
          billRate = !isNaN(billRate) ? billRate : 0;

          var billRateOverride = convertToDecimal($(rows.context[0].aoData[i].anCells[11]).text());
          billRateOverride = !isNaN(billRateOverride) ? billRateOverride : 0;

          //highlight the rate is override is present.
          if (!isNaN(billRateOverride) && billRateOverride > 0) {
            $(rows.context[0].aoData[i].anCells[10]).css('color', 'lightgrey');
          }
          else {
            $(rows.context[0].aoData[i].anCells[10]).css('color', '#5b5b5b');
          }
          var rate = parseFloat(billRateOverride) ? billRateOverride : billRate;
          var costRate = convertToDecimal($(rows.context[0].aoData[i].anCells[12]).text());

          costRate = !isNaN(costRate) ? costRate : 0;
          if (!isAdjusted && parseFloat(billRateOverride)) {
            isAdjusted = true;
          }

          var totalFeePerRow = parseFloat(hoursPerRow) * rate;
          var totalStandardFeePerRow = parseFloat(hoursPerRow) * billRate;
          var totalCostPerRow = parseFloat(hoursPerRow) * costRate;

          if (totalFeePerRow) {
            $(rows.context[0].aoData[i].anCells[14]).text(convertToDollar(projectInfo.Currency, totalFeePerRow));
          } else {
            $(rows.context[0].aoData[i].anCells[14]).text('');
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

    $('.project-resources #btn-save, .project-resources #btn-save-only').on('click', function (event) {
      event.preventDefault();

      trimInputs();

      console.log("saving form");

      var url = $(this).attr('href');
      url = updateQueryString('projID', projectID, url) + "&" + getTimestamp();

      $(this).attr('href', url);

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

      if (event.target.id === 'btn-save') {
        ajaxBatch(payloads, $(this).attr('href'), true);
      } else {
        ajaxBatch(payloads, $(this).attr('href'), false);
      }
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
        "Currency": projectInfo.Currency,
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
        "Currency": projectInfo.Currency,
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
        "Currency": projectInfo.Currency,
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
        "Currency": projectInfo.Currency,
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
    for (var i = 0; i < rows.context[0].aoData.length; i++) {
      var payloadIndex = padNumber(rowIndex);
      var brOverRide = convertToDecimal($(rows.context[0].aoData[i].anCells[11]).text()) ? convertToDecimal($(rows.context[0].aoData[i].anCells[11]).text()).toString() : null;
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
          "DelvDesc": $(rows.context[0].aoData[i].anCells[3]).find('option:selected').text(),
          "Officeid": $(rows.context[0].aoData[i].anCells[4]).find('option:selected').val(),
          "EmpGradeName": $(rows.context[0].aoData[i].anCells[5]).find('option:selected').text(),
          "Practiceid": $(rows.context[0].aoData[i].anCells[7]).find('option:selected').val(),
          "Role": $(rows.context[0].aoData[i].anCells[8]).text(),
          "ProposedRes": $(rows.context[0].aoData[i].anCells[9]).text(),
          "BillRate": convertToDecimal($(rows.context[0].aoData[i].anCells[10]).text()),
          "BillRateOvride": brOverRide,
          "TotalHrs": parseFloat(convertToDecimal($(rows.context[0].aoData[i].anCells[13]).text())),
          "TotalFee": convertToDecimal($(rows.context[0].aoData[i].anCells[14]).text()),
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
      for (var j = 15; j < rows.context[0].aoData[i].anCells.length; j++) {
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
