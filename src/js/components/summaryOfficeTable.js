/**
 * @module Draw Data Table for Active Projects.
 * @version
 */
var summaryOfficeTable = (function ($) {
  'use strict';
  function initSummaryOfficeTable(data) {
    var byOfficeTable = $("#breakdown-office-table");

    byOfficeTable.DataTable({
      dom: '<tip>',
      data: data, //TODO CORRECT DATA
      searching: false,
      paging: false,
      length: false,
      info: false,
      order: [[1, 'asc']],
      "columns": [
        {
          "title": "Office",
          "data": null,
          "defaultContent": "WS Chicago",
          "class": "office",
          render: function (data, type, row) {
            if (data)
              return data;
          }
        },
        {
          "title": "Billing Office",
          "data": null,
          "defaultContent": "WS Chicago",
          "class": "office",
          render: function (data, type, row) {
            if (data)
              return data;
          }
        },
        {
          "title": "Proj. Fees",
          "data": null,
          "defaultContent": "$10,000.00",
          "class": "office-total-fees",
          render: function (data, type, row) {
            if (data)
              return data;
          }
        },
        {
          "title": "Fees in Local Currency",
          "data": null,
          "defaultContent": "$450,000.00",
          "class": "office-total-currency",
          render: function (data, type, row) {
            if (data)
              return data;
          }
        },
        {
          "title": "Hours",
          "data": null,
          "defaultContent": "2,000",
          "class": "office-total-hours",
          render: function (data, type, row) {
            if (data)
              return data;
          }
        },
        {
          "title": "Staffing Mix",
          "data": null,
          "defaultContent": "30%",
          "class": "office-total-mix",
          render: function (data, type, row) {
            if (data)
              return data;
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