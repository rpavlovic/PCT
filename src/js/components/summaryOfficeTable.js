/**
 * @module Draw Data Table for Active Projects.
 * @version
 */
var summaryOfficeTable = (function ($) {
  'use strict';
  function initSummaryOfficeTable(projectResources, offices, rateCards) {
    var byOfficeTable = $("#breakdown-office-table");
    var rows = {};
    projectResources.forEach(function (resource) {
      if (!rows[resource.Officeid + resource.Practiceid]) {
        var officeRateCards = rateCards.find(function (val) {
          return val.OfficeId === resource.Officeid;
        });

        var office = {};
        if (officeRateCards) {
          office = officeRateCards.rateCards.find(function (val) {
            return val.OfficeId === resource.OfficeId && val.CostCenter === resource.Practiceid;
          });
        }

        rows[resource.Officeid + resource.Practiceid] = {
          office: office.OfficeName ? office.OfficeName : resource.Officeid,
          practice: office.CostCenterName ? office.CostCenterName : resource.Practiceid,
          fees: 0,
          hours: 0,
          staffMix: 0
        };
      }
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
    $('#office-total-fees').text(convertToDollar(totalFees));
    $('#office-total-currency').text(convertToDollar(totalFees));

    var totalHours = rows.reduce(function (acc, val) {
      if (val.hours)
        return acc + parseFloat(val.hours);
      else return acc;
    }, 0);
    $('#office-total-hours').text(totalHours);

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
            if (data)
              return data;
          }
        },
        {
          "title": "Fees in Local Currency",
          "data": 'fees',
          "defaultContent": "$0",
          "class": "office-total-currency",
          render: function (data, type, row) {
            if (data)
              return data;
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
            if (data)
              return data + '%';
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