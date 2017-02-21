/**
 * @module Draw Data Table for Active Projects.
 * @version
 */
var summaryDeliverablesTable = (function ($) {
  'use strict';
  function initSummaryDeliverablesTable(data) {
    var DeliverablesTable = $("#breakdown-delivery-table");
    DeliverablesTable.DataTable({
      dom: '<tip>',
      data: data,//TODO CORRECT DATA
      searching: false,
      paging: false,
      length: false,
      info: false,
      order: [[1, 'asc']],
      "columns": [
        {
          "title": "Deliverable/Workstream",
          "data": null,
          "defaultContent": "Non-Deliverable Specific",
          "class": "deliv-name",
          render: function (data, type, row) {
            if (data) {
              return data;
            }
          }
        },
        {
          "title": "Project Fees",
          "data": null,
          "defaultContent": "$350,000.00",
          "class": "deliv-fees",
          render: function (data, type, row) {
            if (data) {
              return data;
            }
          }
        },
        {
          "title": "Expenses",
          "data": null,
          "defaultContent": "$10,000.00",
          "class": "deliv-expenses",
          render: function (data, type, row) {
            if (data) {
              return data;
            }
          }
        },
        {
          "title": "Total Budget",
          "data": null,
          "defaultContent": "$450,000.00",
          "class": "deliv-budget",
          render: function (data, type, row) {
            if (data) {
              return data;
            }
          }
        },
        {
          "title": "Hours",
          "data": null,
          "defaultContent": "2,000",
          "class": "total-hours",
          render: function (data, type, row) {
            if (data) {
              return data;
            }
          }
        },
        {
          "title": "Hours %",
          "data": null,
          "defaultContent": "30%",
          "class": "deliv-percent",
          render: function (data, type, row) {
            if (data) {
              return data;
            }
          }
        }
      ],
      bDestroy: true
    });
  }

  return {
    initSummaryDeliverablesTable: initSummaryDeliverablesTable
  };
})($);