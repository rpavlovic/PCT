/**
 * @module Draw Data Table for Active Projects.
 * @version
 */
var summaryOfficeTable = (function ($) {
  'use strict';
  function initSummaryOfficeTable(projectInfo, projectResources, offices, rateCards, marginModeling) {
    var byOfficeTable = $("#breakdown-office-table");
    var rows = {};

    var selectedModel = marginModeling.find(function (val) {
      return val.Selected === '1';
    });

    projectResources.forEach(function (resource) {
      // just the rate card we need to find to get the SourceBillRate
      var office = {};
      if (!rows[resource.Officeid + resource.Practiceid]) {
        var officeRateCards = rateCards.find(function (val) {
          return val.OfficeId === resource.Officeid;
        });

        if (officeRateCards) {
          office = officeRateCards.rateCards.find(function (val) {
            return val.OfficeId === resource.OfficeId && val.CostCenter === resource.Practiceid;
          });
        }

        rows[resource.Officeid + resource.Practiceid] = {
          office: office.OfficeName ? office.OfficeName : resource.Officeid,
          practice: office.CostCenterName ? office.CostCenterName : resource.Practiceid,
          localFees: 0,
          fees: 0,
          hours: 0,
          staffMix: 0
        };
      }

      rows[resource.Officeid + resource.Practiceid].localFees += parseFloat(resource.TotalHrs) * parseFloat(office.SourceBillrate);
      rows[resource.Officeid + resource.Practiceid].fees += parseFloat(resource.TotalFee);
      rows[resource.Officeid + resource.Practiceid].hours += parseFloat(resource.TotalHrs);
    });

    rows = Object.values(rows);
    var sumHours = rows.reduce(function (acc, val) {
      return acc + parseFloat(val.hours);
    }, 0);

    rows.forEach(function (row) {
      row.staffMix = row.hours / sumHours * 100;
    });

    var totalFees = rows.reduce(function (acc, val) {
      if (val.fees)
        return acc + parseFloat(val.fees);
      else return acc;
    }, 0);

    var localFees = rows.reduce(function (acc, val) {
      if (val.localFees)
        return acc + parseFloat(val.localFees);
      else return acc;
    }, 0);

    $('#office-total-currency').text(convertToDollar(projectInfo.Currency, localFees));

    var totalHours = rows.reduce(function (acc, val) {
      if (val.hours)
        return acc + parseFloat(val.hours);
      else return acc;
    }, 0);

    $('#office-total-hours').text(totalHours);

    // only need to messwith the numbers if we have selected one of these models
    if (selectedModel && (selectedModel.ModelType === 'FFT' || selectedModel.ModelType === 'TMBF')) {
      // need to calculate the ratios here...
      rows.forEach(function (row) {
        var ratio = row.fees / totalFees;
        row.fees = ratio * selectedModel.Fees;
      });
      // now we actually override withthe  total fee from the selected model.
      $('#office-total-fees').text(convertToDollar(projectInfo.Currency, parseFloat(selectedModel.Fees)));
    } else {
      $('#office-total-fees').text(convertToDollar(projectInfo.Currency, totalFees));
    }

    byOfficeTable.DataTable({
      dom: '<tip>',
      data: rows,
      searching: false,
      paging: false,
      length: false,
      info: false,
      order: [[1, 'asc']],
      "columns": [
        {
          "title": "Office",
          "data": 'office',
          "defaultContent": "",
          "class": "office",
          render: function (data, type, row) {
            if (data)
              return data;
          }
        },
        {
          "title": "Billing Office",
          "data": 'practice',
          "defaultContent": "",
          "class": "office",
          render: function (data, type, row) {
            if (data)
              return data;
          }
        },
        {
          "title": "Proj. Fees",
          "data": 'fees',
          "defaultContent": "$0",
          "class": "office-total-fees",
          render: function (data, type, row) {
            if (data || isNaN(data)) {
              return convertToDollar(projectInfo.Currency, data);
            } else {
              return data;
            }
          }
        },
        {
          "title": "Fees in Local Currency",
          "data": 'localFees',
          "defaultContent": "$0",
          "class": "office-total-currency",
          render: function (data, type, row) {
            if (data || isNaN(data)) {
              return convertToDollar(projectInfo.Currency, data);
            } else {
              return data;
            }
          }
        },
        {
          "title": "Hours",
          "data": 'hours',
          "defaultContent": "0",
          "class": "office-total-hours",
          render: function (data, type, row) {
            if (data)
              return data;
          }
        },
        {
          "title": "Staffing Mix",
          "data": 'staffMix',
          "defaultContent": "0%",
          "class": "office-total-mix",
          render: function (data, type, row) {
            if (data) {
              return data.toFixed(2) + '%';
            } else {
              return data + "%";
            }
          }
        }
      ],
      bDestroy: true
    });
  }

  return {
    initSummaryOfficeTable: initSummaryOfficeTable
  };
})($);