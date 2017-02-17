
/**
* @module Draw Data Table for Active Projects.
* @version
*/
var summaryDelivTable = (function ($) {
  'use strict';
  function initSummaryDelivTable(data) {
    var DelierableTable = $("#breakdown-delivery-table");
    DelierableTable.DataTable({
      dom:'<tip>',
    //  data: '',
      searching: false,
      paging: false,
      length: false,
      order: [[ 1, 'asc' ]],
      "columns": [
        {
          "title": "Deliverable/Workstream",
          "data": null,
          "defaultContent": "Non-Deliverable Specific",
          "class": "deliv-name",
          render: function ( data, type, row ) {
            return data;
          }
        },
        {
          "title": "Project Fees",
          "data": null,
          "defaultContent": "$350,000.00",
          "class": "deliv-fees",
          render: function ( data, type, row ) {
            return data;
          }
        },
        {
          "title": "Expenses",
          "data": null,
          "defaultContent": "$10,000.00",
          "class": "deliv-expences",
          render: function ( data, type, row ) {
            return data;
          }
        },
        {
          "title": "Total Budget",
          "data": null,
          "render": "$450,000.00",
          "class": "deliv-budget",
          // render: function ( data, type, row ) {
          //   return data;
          // }
        },
        {
          "title": "Hours",
          "data": null,
          "defaultContent": "2,000",
          "class": "total-hours",
          render: function ( data, type, row ) {
            return data;
          }
        },
        {
          "title": "Hours %",
          "data": null,
          "defaultContent": "30%",
          "class": "deliv-percent",
          render: function ( data, type, row ) {
            return data;
          }
        }
      ],
      bDestroy: true,
    });
  }
  return {
    initSummaryDelivTable:initSummaryDelivTable
  };
})($);