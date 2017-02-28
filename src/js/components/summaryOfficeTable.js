/**
 * @module Draw Data Table for Active Projects.
 * @version
 */
var summaryOfficeTable = (function ($) {
  'use strict';
  function initSummaryOfficeTable(projectResources, offices) {
    var byOfficeTable = $("#breakdown-office-table");

    console.log(projectResources);
    var rows = {};
    projectResources.forEach(function (resource) {
      if (!rows[resource.Officeid + resource.Practiceid]) {
        rows[resource.Officeid + resource.Practiceid] = {
          office: resource.Officeid,
          practice: resource.Practiceid,
          fees: 0,
          hours: 0,
          staffMix: 0
        };
      }
      rows[resource.Officeid + resource.Practiceid].fees += parseFloat(resource.TotalFee);
      rows[resource.Officeid + resource.Practiceid].hours += parseFloat(resource.TotalHrs);
    });

    rows = Object.values(rows);
    var sumHours = rows.reduce(function(acc, val){
      return acc + parseFloat(val.hours);
    }, 0);

    rows.forEach(function(row){
      row.staffMix = row.hours / sumHours * 100;
    });

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