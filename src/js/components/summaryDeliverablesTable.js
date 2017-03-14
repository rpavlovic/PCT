/**
 * @module Draw Data Table for Active Projects.
 * @version
 */
var summaryDeliverablesTable = (function ($) {
  'use strict';
  function initSummaryDeliverablesTable(projectInfo, deliverables, resources, expenses) {
    var DeliverablesTable = $("#breakdown-delivery-table");
    var deliverablesBreakdown = {};

    resources.forEach(function (data) {
      var item = deliverables.find(function (val) {
        return val.DelvDesc === data.DelvDesc;
      });

      if (!item.TotalFee) {
        item.TotalFee = 0;
      }
      item.TotalFee += parseFloat(data.TotalFee);

      if (!item.TotalHrs) {
        item.TotalHrs = 0;
      }
      item.TotalHrs += parseFloat(data.TotalHrs);
    });

    expenses.forEach(function (data) {
      var item = deliverables.find(function (val) {
        return val.DelvDesc === data.DelvDesc;
      });
      if (!item.TotalExpenses) {
        item.TotalExpenses = 0;
      }
      item.TotalExpenses += parseFloat(data.Amount);
    });

    var totalProjectHours = 0;
    deliverables.forEach(function (d) {
      d.TotalFee = d.TotalFee ? d.TotalFee : 0;
      d.TotalExpenses = d.TotalExpenses ? d.TotalExpenses : 0;
      
      d.Budget = d.TotalExpenses + d.TotalFee;
      if (d.TotalHrs)
        totalProjectHours += parseFloat(d.TotalHrs);
    });

    deliverables.forEach(function (d) {
      if (d.TotalHrs) {
        d.HoursPercentage = d.TotalHrs / totalProjectHours * 100;
      } else
        d.HoursPercentage = 0;
    });

    var totalDeliverableFees = deliverables.reduce(function (acc, val) {
      if (parseFloat(val.TotalFee))
        return acc + parseFloat(val.TotalFee);
      else
        return acc;
    }, 0);

    $('#total-deliv-fees').text(convertToDollar(projectInfo.Currency, totalDeliverableFees));

    var totalExpenses = deliverables.reduce(function (acc, val) {
      if (val.TotalExpenses)
        return acc + parseFloat(val.TotalExpenses);
      else
        return acc;
    }, 0);

    $('#total-deliv-expenses').text(convertToDollar(projectInfo.Currency, totalExpenses));

    var totalBudget = deliverables.reduce(function (acc, val) {
      if (val.Budget)
        return acc + parseFloat(val.Budget);
      else
        return acc;
    }, 0);

    $('#total-deliv-budget').text(convertToDollar(projectInfo.Currency, totalBudget));

    var totalHours = deliverables.reduce(function (acc, val) {
      if (val.TotalHrs)
        return acc + parseFloat(val.TotalHrs);
      else
        return acc;
    }, 0);

    $('#total-deliv-hours').text(totalHours);

    DeliverablesTable.DataTable({
      dom: '<tip>',
      data: deliverables,
      searching: false,
      paging: false,
      length: false,
      info: false,
      order: [[1, 'asc']],
      "columns": [
        {
          "title": "Deliverable/Workstream",
          "data": 'DelvDesc',
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
          "data": 'TotalFee',
          "defaultContent": "$0",
          "class": "deliv-fees",
          render: function (data, type, row) {
            if (data || isNaN(data)) {
              return convertToDollar(projectInfo.Currency, data);
            } else {
              return data;
            }
          }
        },
        {
          "title": "Expenses",
          "data": "TotalExpenses",
          "defaultContent": "$0",
          "class": "deliv-expenses",
          render: function (data, type, row) {
            if (data || isNaN(data)) {
              return convertToDollar(projectInfo.Currency, data);
            } else {
              return data;
            }
          }
        },
        {
          "title": "Total Budget",
          "data": 'Budget',
          "defaultContent": "$0",
          "class": "deliv-budget",
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
          "data": 'TotalHrs',
          "defaultContent": "0",
          "class": "total-hours",
          render: function (data, type, row) {
            if (data) {
              return data;
            }
          }
        },
        {
          "title": "Hours %",
          "data": 'HoursPercentage',
          "defaultContent": "%",
          "class": "deliv-percent",
          render: function (data, type, row) {
            if (data || isNaN(data)) {
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
    initSummaryDeliverablesTable: initSummaryDeliverablesTable
  };
})($);