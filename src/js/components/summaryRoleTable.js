/**
 * @module Draw Data Table for Active Projects.
 * @version
 */
var summaryRoleTable = (function ($) {
  'use strict';
  function initSummaryRoleTable(projectInfo, projectResources, rateCards, marginModeling) {
    var byRoleTable = $("#breakdown-role-table");
    var rows = {};

    var selectedModel = marginModeling.find(function (val) {
      return val.Selected === '1';
    });

    projectResources.forEach(function (resource) {
      if (!rows[resource.EmpGradeName]) {
        var officeRateCards = rateCards.find(function (val) {
          return val.OfficeId === resource.Officeid;
        });

        var rc = officeRateCards.rateCards.find(function (val) {
          return val.OfficeId === resource.OfficeId
            && val.CostCenter === resource.Practiceid
            && val.EmpGradeName === resource.EmpGradeName;
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

    var totalHrs = rows.reduce(function (acc, val) {
      return acc + parseFloat(val.hours);
    }, 0);

    $('#roles-total-hours').text(totalHrs);
    rows.forEach(function (row) {
      row.staffMix = row.hours / totalHrs * 100;
    });

    var rolesTotalFee = rows.reduce(function (acc, val) {
      if (val.fees)
        return acc + parseFloat(val.fees);
      else return acc;
    }, 0);
    // only need to messwith the numbers if we have selected one of these models
    if (selectedModel.ModelType === 'FFT' || selectedModel.ModelType === 'TMBF') {
      // need to calculate the ratios here...
      rows.forEach(function (row) {
        var ratio = row.fees / rolesTotalFee;
        row.fees = ratio * selectedModel.Fees;
      });
      // now we actually override withthe  total fee from the selected model.
      $('#roles-total').text(convertToDollar(projectInfo.Currency, parseFloat(selectedModel.Fees)));
    } else {
      $('#roles-total').text(convertToDollar(projectInfo.Currency, rolesTotalFee));
    }

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