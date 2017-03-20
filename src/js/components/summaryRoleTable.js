/**
 * @module Draw Data Table for Active Projects.
 * @version
 */
var summaryRoleTable = (function ($) {
  'use strict';
  function initSummaryRoleTable(projectInfo, projectResources, rateCards, selectedModel) {
    var byRoleTable = $("#breakdown-role-table");
    var rows = {};

    projectResources.forEach(function (resource) {
      if (!rows[resource.EmpGradeName]) {
        var officeRateCards = rateCards.find(function (val) {
          return val.OfficeId === resource.Officeid;
        });

        var rc = officeRateCards.rateCards.find(function (val) {
          return val.OfficeId === resource.OfficeId &&
          val.CostCenter === resource.Practiceid &&
          val.EmpGradeName === resource.EmpGradeName;
        });

        rows[resource.EmpGradeName] = {
          title: resource.EmpGradeName,
          fees: 0,
          class: rc.Class,
          hours: 0
        };
      }
      rows[resource.EmpGradeName].fees += parseFloat(resource.TotalFee);
      rows[resource.EmpGradeName].hours += parseFloat(resource.TotalHrs);
    });

    // compare the fees per role / total fee to get the ratio.
    // use this ratio against fft or tmbf
    rows = Object.values(rows);

    var reducedObject = rows.reduce(function (a, b) {
      return {
        fees: a.fees + b.fees,
        hours: a.hours + b.hours
      }
    });

    // only need to messwith the numbers if we have selected one of these models
    // need to calculate the ratios here...
    rows.forEach(function (row) {
      var ratio = row.fees / reducedObject.fees;
      row.fees = ratio * selectedModel.Fees;
      row.staffMix = row.hours / reducedObject.hours * 100;
    });

    $('#roles-total-hours').text(reducedObject.hours);
    // now we actually override withthe  total fee from the selected model.
    $('#roles-total').text(convertToDollar(projectInfo.Currency, parseFloat(selectedModel.Fees)));

    byRoleTable.DataTable({
      dom: '<tip>',
      data: rows,
      searching: false,
      paging: false,
      length: false,
      info: false,
      order: [[1, 'asc']],
      "columns": [
        {
          "title": "Title",
          "data": 'title',
          "defaultContent": "",
          "class": "office",
          render: function (data, type, row) {
            return data;
          }
        },
        {
          "title": "Class",
          "data": 'class',
          "defaultContent": "0",
          "class": "office",
          render: function (data, type, row) {
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
          "title": "Hours",
          "data": 'hours',
          "defaultContent": "0",
          "class": "office-total-hours",
          render: function (data, type, row) {
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
    initSummaryRoleTable: initSummaryRoleTable
  };
})($);