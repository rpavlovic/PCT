/**
 * @module Calulate summary info for each project
 * @version
 */

var projectSummaryCalculations = (function ($) {
  'use strict';

  function calculateBudget(projectId) {
    var projectInfo = getProjectInfo(projectId);
    var pExpenses = getProjectExpenses(projectId);
    var pModels = getMarginModeling(projectId);

    return Promise.all([projectInfo, pExpenses, pModels]).then(function (values) {
      var projInfo = values[0];
      var expenses = values[1];
      var marginModels = values[2];

      var expenseTotal = expenses.reduce(function (acc, val) {
        return parseFloat(acc) + parseFloat(val.Amount);
      }, 0);

      var selectedModel = getMarginModel(marginModels);

      if(selectedModel) {
        return {
          currency: projInfo.Currency,
          budget: expenseTotal + parseFloat(selectedModel.Fees)
        };
      }
      else{
        return {
          currency: 'USD',
          budget: 1.0
        };
      }
    });
  }

  return {
    calculateBudget: calculateBudget
  };
})($);
