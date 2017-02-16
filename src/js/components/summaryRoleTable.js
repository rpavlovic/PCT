
/**
* @module Draw Data Table for Active Projects.
* @version
*/
var summaryRoleTable = (function ($) {
  'use strict';
  function initSummaryRoleTable(data) {
    console.log(data);
    var byRoleTable = $("#breakdown-role-table");

    byRoleTable.DataTable({
      dom:'<tip>',
      data: data,//TODO CORRECT DATA
      searching: false,
      paging: false,
      length: false,
      info: false,
      order: [[ 1, 'asc' ]],
      "columns": [
        {
          "title": "Title",
          "data": null,
          "defaultContent": "President",
          "class": "office",
          render: function ( data, type, row ) {
            return data;
          }
        },
        {
          "title": "Class",
          "data": null,
          "defaultContent": "E1",
          "class": "office",
          render: function ( data, type, row ) {
            return data;
          }
        },
        {
          "title": "Proj. Fees",
          "data": null,
          "defaultContent": "$10,000.00",
          "class": "office-total-fees",
          render: function ( data, type, row ) {
            return data;
          }
        },
        {
          "title": "Hours",
          "data": null,
          "defaultContent": "2,000",
          "class": "office-total-hours",
          render: function ( data, type, row ) {
            return data;
          }
        },
        {
          "title": "Staffing Mix",
          "data": null,
          "defaultContent": "30%",
          "class": "office-total-mix",
          render: function ( data, type, row ) {
            return data;
          }
        }
      ],
      bDestroy: true,
    });
  }
  return {
    initSummaryRoleTable:initSummaryRoleTable
  };
})($);