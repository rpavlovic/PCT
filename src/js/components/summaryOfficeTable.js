/**
 * @module Draw Data Table for Active Projects.
 * @version
 */

function getExchangeRate(rateCardArray, officeId, practiceId, empGradeName) {
  var rcOffice = rateCardArray.find(function (rcCollection) {
    return rcCollection.OfficeId === officeId;
  });

  var empRc = rcOffice.rateCards.find(function (rc) {
    return rc.EmpGradeName === empGradeName && rc.Office === officeId && rc.CostCenter === practiceId;
  });

  return empRc.SourceBillrate / empRc.BillRate;
}


var summaryOfficeTable = (function ($) {
  'use strict';
  function initSummaryOfficeTable(projectInfo, projectResources, projectExpenses, rateCards, selectedModel) {
    var byOfficeTable = $("#breakdown-office-table");
    var rows = {};

    projectResources.forEach(function (resource) {
      // just the rate card we need to find to get the SourceBillRate
      var office = {};
      if (!rows[resource.Officeid]) {
        var officeRateCards = rateCards.find(function (val) {
          return val.OfficeId === resource.Officeid;
        });

        if (officeRateCards) {
          office = officeRateCards.rateCards.find(function (val) {
            return val.Office === resource.Officeid && val.CostCenter === resource.Practiceid && resource.EmpGradeName === val.EmpGradeName;
          });
          rows[resource.Officeid] = {
            office: office.OfficeName ? office.OfficeName : resource.Officeid,
            localFees: 0,
            fees: 0,
            hours: 0,
            expenses: 0,
            staffMix: 0,
            budget: 0,
            localCurrency: office.LocalCurrency
          };
        }
      }

      // calculate exchange rate based on the resource, office, etc...
      rows[resource.Officeid].exchangeRate = getExchangeRate(rateCards, resource.Officeid, resource.Practiceid, resource.EmpGradeName);
      rows[resource.Officeid].fees += parseFloat(resource.TotalFee);
      rows[resource.Officeid].hours += parseFloat(resource.TotalHrs);
    });

    projectExpenses.forEach(function (expense) {
      // just the rate card we need to find to get the SourceBillRate
      var office = {};
      if (!rows[expense.Officeid]) {
        var officeRateCards = rateCards.find(function (val) {
          return val.OfficeId === expense.Officeid;
        });

        if (officeRateCards) {
          office = officeRateCards.rateCards.find(function (val) {
            return val.Office === expense.Officeid;
          });

          rows[expense.Officeid] = {
            office: office.OfficeName ? office.OfficeName : expense.Officeid,
            localFees: 0,
            fees: 0,
            hours: 0,
            expenses: 0,
            staffMix: 0,
            budget: 0,
            localCurrency: office.LocalCurrency
          };
        }
      }
      rows[expense.Officeid].expenses += parseFloat(expense.Amount);
    });

    rows = Object.values(rows);

    var reducedObject = rows.reduce(function (a, b) {
      return {
        fees: a.fees + b.fees,
        hours: a.hours + b.hours,
        expenses: a.expenses + b.expenses
      };
    });

    // only need to messwith the numbers if we have selected one of these models
    // need to calculate the ratios here...
    rows.forEach(function (row) {
      row.staffMix = row.hours / reducedObject.hours;
      var ratio = row.fees / reducedObject.fees;
      row.fees = ratio * selectedModel.Fees;
      row.budget = row.fees + row.expenses;
      row.localFeeObject = {
        localCurrency: row.localCurrency,
        localFees: row.fees * row.exchangeRate
      };
    });

    // we have to do this again based on the model selected
    var budget = 0;
    rows.forEach(function (row) {
      budget += row.budget;
    });

    // now we actually override withthe  total fee from the selected model.
    $('#office-total-hours').text(reducedObject.hours);
    $('#office-total-expenses').text(convertToDollar(projectInfo.Currency, parseFloat(reducedObject.expenses)));
    $('#office-budget').text(convertToDollar(projectInfo.Currency, parseFloat(budget)));

    $('#office-total-fees').text(convertToDollar(projectInfo.Currency, parseFloat(selectedModel.Fees)));
    $('#office-total-currency').text(convertToDollar(projectInfo.Currency, parseFloat(selectedModel.Fees)));

    byOfficeTable.DataTable({
      dom: '<tip>',
      data: rows,
      searching: false,
      paging: false,
      length: false,
      info: false,
      order: [[1, 'asc']],
      bAutoWidth: false,
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
          "title": "Fees in Local Currency",
          "data": 'localFeeObject',
          "defaultContent": "$0",
          "class": "office-total-currency",
          render: function (data, type, row) {
            if (data && !isNaN(data.localFees)) {
              return convertToDollar(data.localCurrency, data.localFees);
            } else {
              return '0';
            }
          }
        },
        {
          "title": "Fees in Target",
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
          "title": "Expenses",
          "data": "expenses",
          "defaultContent": "$0",
          "class": "deliv-expenses",
          render: function (data, type, row) {
            if (data && !isNaN(data)) {
              return convertToDollar(projectInfo.Currency, data);
            } else {
              return data;
            }
          }
        },
        {
          "title": "Total Budget",
          "data": "budget",
          "defaultContent": "$0",
          "class": "total-budget",
          render: function (data, type, row) {
            if (data && !isNaN(data)) {
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
            if (data) {
              return convertToPercent(data);
            } else {
              return convertToPercent(data);
            }
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