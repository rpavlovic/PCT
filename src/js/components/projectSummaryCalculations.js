/**
 * @module Calulate summary info for each project
 * @version
 */

var projectSummaryCalculations = (function ($) {
  'use strict';

  function calculateBudget(projectId) {
    var projectInfo = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.project, projectId), function (projects) {
        // return only 1 project info
        resolve(projects.d.results.find(filterByProjectId, projectId));
      });
    });

    var pExpenses = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.projectExpenses, projectId), function (projectDeliverables) {
        resolve(projectDeliverables.d.results.filter(filterByProjectId, projectId));
      });
    });

    var pModels = new Promise(function (resolve, reject) {
      $.getJSON(get_data_feed(feeds.marginModeling, projectId, ' '), function (marginModeling) {
        resolve(marginModeling.d.results.filter(filterByProjectId, projectId));
      });
    });

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
