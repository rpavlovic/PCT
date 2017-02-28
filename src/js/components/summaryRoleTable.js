/**
 * @module Draw Data Table for Active Projects.
 * @version
 */
var summaryRoleTable = (function ($) {
  'use strict';
  function initSummaryRoleTable(projectResources, rateCards) {
    var byRoleTable = $("#breakdown-role-table");
    var rows = {};

    projectResources.forEach(function(resource){
      if(!rows[resource.EmpGradeName]){

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

    rows = Object.values(rows);
    console.log(rows);

    var totalHrs = rows.reduce(function (acc, val){
      return acc + parseFloat(val.hours);
    }, 0);

    console.log(totalHrs);
    rows.forEach(function(row){
      console.log(row);
      row.staffMix = row.hours / totalHrs * 100;
    });

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
          "defaultContent": "President",
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
            return data;
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
            return data + '%';
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